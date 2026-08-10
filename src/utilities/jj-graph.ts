import { createHash } from "node:crypto";
import { Graphviz } from "@hpcc-js/wasm-graphviz";

/**
 * Renders a jj revision graph as static SVG at build time.
 *
 * Layout is done by Graphviz (compiled to wasm, so there is no system
 * dependency and no headless browser). The revisions leading to the working
 * copy are pinned into a single dead-straight column via Graphviz's `group`
 * attribute; anything else fans out to the side.
 *
 * No color is baked into the SVG. Every themable value is emitted as a
 * sentinel that {@link processGraphSvg} rewrites into a CSS class, so
 * light/dark theming and revision highlighting live entirely in
 * `JJGraph.astro`.
 */

/** jj displays change ids in "reverse hex": 0-f render as z-k. */
const REVERSE_HEX = "zyxwvutsrqponmlk";

/** The id of the virtual root revision, inferred rather than declared. */
const ROOT_ID = "root";

const CHANGE_ID_LENGTH = 8;
const ROOT_CHANGE_ID = "z".repeat(CHANGE_ID_LENGTH);
const VALID_ID = /^[A-Za-z0-9_-]+$/;

/**
 * Label typography, in points. Graphviz lays the text out in Courier, whose
 * advance is 0.6em — the same as the IBM Plex Mono the browser substitutes.
 */
const LABEL_FONT_SIZE = 11;
const MONO_ADVANCE = LABEL_FONT_SIZE * 0.6;
/** Spaces printed between the change id and the bookmarks. */
const LABEL_GAP_SPACES = 2;
const LABEL_GAP = MONO_ADVANCE * LABEL_GAP_SPACES;
/** Graphviz takes separation values in inches. */
const POINTS_PER_INCH = 72;

/**
 * Placeholder colors emitted into the DOT source purely so they can be found
 * again in Graphviz's SVG output and swapped for CSS classes. They are never
 * displayed.
 */
const SENTINEL = {
  edge: "#e10001",
  changeIdPrefix: "#e10002",
  changeIdRest: "#e10003",
  bookmark: "#e10004",
  dot: "#e10005",
  workingCopyGlyph: "#e10006",
} as const;

export type JJColor = string | { light: string; dark: string };

export type JJRevision = {
  /** Stable handle, referenced by `parentIds` and by the `selected` prop. */
  id: string;
  /** jj bookmarks pointing at this revision. */
  bookmarks?: string[] | undefined;
  /**
   * Parents of this revision. Defaults to `["root"]`; the root revision is
   * created automatically when something points at it.
   */
  parentIds?: string[] | undefined;
  /** Overrides the change id that would otherwise be generated from `id`. */
  changeId?: string | undefined;
  /** Immutable revisions render as a diamond, matching `jj log`. */
  immutable?: boolean | undefined;
  workingCopy?: boolean | undefined;
  /** Overrides the dot color. Accepts one color or a light/dark pair. */
  color?: JJColor | undefined;
  /**
   * Forces this revision into (or out of) the straight column. By default the
   * column is the first-parent ancestry of the working copy.
   */
  trunk?: boolean | undefined;
};

export type JJGraphOptions = {
  /**
   * Squeezes every revision into the straight column, one per row, so a fork
   * reads as a single stack: the branch that was pushed up a row keeps its real
   * edge, which bends around whatever now sits in between — much as `jj log`
   * folds a fork back into its column with `├─╯`.
   *
   * Off by default, where a fork fans out sideways instead. That is the plainer
   * picture, but it costs a second column of dots *and* labels — nearly double
   * the width — which is a bad trade in a diagram whose subject is the stack.
   */
  aggressivelyStackCommits?: boolean | undefined;
};

/** One graph in a diagram: the revisions, plus whatever a revset selects. */
export type JJGraphSpec = {
  revisions: readonly JJRevision[];
  /** Omit entirely to draw every revision at full strength. */
  selected?: readonly string[] | undefined;
};

/** An authored revision with its parents filled in, as every graph walk needs. */
type ParentedRevision = JJRevision & { parentIds: string[] };

type NormalizedRevision = {
  id: string;
  parentIds: readonly string[];
  changeId: string;
  bookmarks: readonly string[];
  immutable: boolean;
  workingCopy: boolean;
  isRoot: boolean;
  onTrunk: boolean;
  selected: boolean;
  color: { light: string; dark: string } | null;
};

type JJGraphModel = {
  revisions: NormalizedRevision[];
  /**
   * Every revision in one column, bottom row first, when the graph was stacked
   * hard. Empty when a fork was left to fan out sideways instead.
   */
  column: string[];
  /** True when a revset is being highlighted, so non-matches are dimmed. */
  highlighting: boolean;
  selectedCount: number;
};

/**
 * Derives a deterministic jj-looking change id from an arbitrary seed, so
 * authors get realistic ids without inventing them by hand. Deterministic
 * matters: it keeps rebuilds (and screenshot tests) stable.
 */
function generateChangeId(seed: string): string {
  const digest = createHash("sha256").update(seed).digest("hex");
  let changeId = "";
  for (const hexDigit of digest.slice(0, CHANGE_ID_LENGTH)) {
    changeId += REVERSE_HEX[Number.parseInt(hexDigit, 16)] ?? "z";
  }
  return changeId;
}

/**
 * jj abbreviates a change id to its shortest unambiguous prefix. What it must
 * be unambiguous *against* is the whole diagram rather than one graph, so that
 * a revision appearing in both halves of a before/after pair abbreviates
 * identically on both sides.
 */
function uniquePrefixLength(changeId: string, pool: readonly string[]): number {
  for (let length = 1; length < changeId.length; length++) {
    const prefix = changeId.slice(0, length);
    const ambiguous = pool.some(
      (other) => other !== changeId && other.startsWith(prefix),
    );
    if (!ambiguous) return length;
  }
  return changeId.length;
}

function normalizeColor(color: JJColor | undefined): {
  light: string;
  dark: string;
} | null {
  if (color === undefined) return null;
  if (typeof color === "string") return { light: color, dark: color };
  return color;
}

/**
 * Checks the authored revisions, fills in the parents nobody named, and adds
 * the root revision when something points at it but nobody declared it.
 */
function resolveRevisions(
  revisions: readonly JJRevision[],
  selected: readonly string[] | undefined,
): ParentedRevision[] {
  const declared = new Set<string>();
  for (const revision of revisions) {
    if (!VALID_ID.test(revision.id)) {
      throw new Error(
        `JJGraph: revision id "${revision.id}" must match ${String(VALID_ID)}`,
      );
    }
    if (declared.has(revision.id)) {
      throw new Error(`JJGraph: duplicate revision id "${revision.id}"`);
    }
    declared.add(revision.id);
  }

  // Naming no parent means hanging off the root.
  const parented: ParentedRevision[] = revisions.map((revision) => ({
    ...revision,
    parentIds: revision.parentIds ?? [ROOT_ID],
  }));
  const pointsAtRoot = parented.some((revision) =>
    revision.parentIds.includes(ROOT_ID),
  );
  const resolved: ParentedRevision[] =
    pointsAtRoot && !declared.has(ROOT_ID)
      ? [{ id: ROOT_ID, parentIds: [], immutable: true }, ...parented]
      : parented;

  const knownIds = new Set(resolved.map((revision) => revision.id));
  for (const revision of resolved) {
    for (const parentId of revision.parentIds) {
      if (!knownIds.has(parentId)) {
        throw new Error(
          `JJGraph: revision "${revision.id}" has unknown parent "${parentId}"`,
        );
      }
    }
  }
  for (const id of selected ?? []) {
    if (!knownIds.has(id)) {
      throw new Error(`JJGraph: selected revision "${id}" does not exist`);
    }
  }
  return resolved;
}

/** Salts the seed until it lands on a change id this graph is not using. */
function unusedChangeId(seed: string, used: ReadonlySet<string>): string {
  for (let salt = 0; ; salt++) {
    const changeId = generateChangeId(
      salt === 0 ? seed : `${seed}#${String(salt)}`,
    );
    if (!used.has(changeId)) return changeId;
  }
}

/** Explicit change ids win; the rest are generated from the revision's id. */
function withChangeIds<T extends JJRevision>(
  revisions: readonly T[],
): (T & { changeId: string })[] {
  const used = new Set<string>();
  return revisions.map((revision) => {
    const changeId =
      revision.changeId ??
      (revision.id === ROOT_ID
        ? ROOT_CHANGE_ID
        : unusedChangeId(revision.id, used));
    used.add(changeId);
    return { ...revision, changeId };
  });
}

/**
 * The straight column: the longest first-parent chain, preferring one that runs
 * through the working copy. Picking a head (rather than the working copy
 * itself) keeps revisions *above* `@` in the column too.
 */
function findTrunk(
  revisions: readonly ParentedRevision[],
): ReadonlySet<string> {
  const byId = new Map(revisions.map((revision) => [revision.id, revision]));
  const firstParentChain = (startId: string): string[] => {
    const chain: string[] = [];
    let cursor: string | undefined = startId;
    // Revisiting an id means the author wrote a cycle; stop rather than spin.
    while (cursor !== undefined && !chain.includes(cursor)) {
      chain.push(cursor);
      cursor = byId.get(cursor)?.parentIds[0];
    }
    return chain;
  };

  const hasChildren = new Set(
    revisions.flatMap((revision) => revision.parentIds),
  );
  const heads = revisions.filter((revision) => !hasChildren.has(revision.id));
  // Only a cycle leaves no head at all; start somewhere rather than nowhere.
  const tips = heads.length > 0 ? heads : revisions.slice(-1);
  const chains = tips.map((revision) => firstParentChain(revision.id));

  const workingCopyId = revisions.find(
    (revision) => revision.workingCopy === true,
  )?.id;
  const throughWorkingCopy = chains.filter(
    (chain) => workingCopyId !== undefined && chain.includes(workingCopyId),
  );
  const candidates =
    throughWorkingCopy.length > 0 ? throughWorkingCopy : chains;

  return new Set(
    candidates.reduce<string[]>(
      (longest, chain) => (chain.length > longest.length ? chain : longest),
      [],
    ),
  );
}

/**
 * Orders every revision into one column, bottom row first: a walk up from the
 * roots that climbs the *shorter* side of a fork first, so the branch an edge
 * has to bend around — and with it the bend — stays as short as possible.
 * Ties keep declaration order.
 */
function columnOrder(revisions: readonly ParentedRevision[]): string[] {
  const children = new Map<string, ParentedRevision[]>(
    revisions.map((revision) => [revision.id, []]),
  );
  for (const revision of revisions) {
    for (const parentId of revision.parentIds) {
      children.get(parentId)?.push(revision);
    }
  }
  const childrenOf = (revision: ParentedRevision): ParentedRevision[] =>
    children.get(revision.id) ?? [];

  // How much of the graph sits above a revision. Paths through a merge are
  // counted once each, which only ever decides a tie.
  const sizes = new Map<string, number>();
  const sizeAbove = (revision: ParentedRevision): number => {
    const cached = sizes.get(revision.id);
    if (cached !== undefined) return cached;
    const size =
      1 +
      childrenOf(revision).reduce(
        (total, child) => total + sizeAbove(child),
        0,
      );
    sizes.set(revision.id, size);
    return size;
  };

  const order: string[] = [];
  const placed = new Set<string>();

  /** Places a revision once every parent is down, then climbs to its children. */
  const place = (revision: ParentedRevision): void => {
    if (placed.has(revision.id)) return;
    if (!revision.parentIds.every((parentId) => placed.has(parentId))) return;
    placed.add(revision.id);
    order.push(revision.id);
    const next = [...childrenOf(revision)].sort(
      (left, right) => sizeAbove(left) - sizeAbove(right),
    );
    for (const child of next) place(child);
  };

  // One pass is enough. A merge turns its first parent away and is placed by
  // whichever parent lands last, on that parent's climb — so the only
  // revisions this loop places itself are the roots it starts from.
  for (const revision of revisions) place(revision);
  return order;
}

function buildJJGraph(
  revisions: readonly JJRevision[],
  selected: readonly string[] | undefined,
  options: JJGraphOptions,
): JJGraphModel {
  const resolved = withChangeIds(resolveRevisions(revisions, selected));

  // Stacking hard puts every revision in the column, so the first-parent chain
  // is only what the column falls back to.
  const stacked = options.aggressivelyStackCommits === true;
  const column = stacked ? columnOrder(resolved) : [];
  const trunk = stacked ? null : findTrunk(resolved);

  // No `selected` at all means no revset is being illustrated, so there is
  // nothing to dim against — every revision draws at full strength.
  const highlighting = selected !== undefined;
  const selectedSet = new Set(selected ?? []);

  return {
    revisions: resolved.map((revision) => ({
      id: revision.id,
      parentIds: revision.parentIds,
      changeId: revision.changeId,
      bookmarks: revision.bookmarks ?? [],
      immutable: revision.immutable ?? false,
      workingCopy: revision.workingCopy ?? false,
      isRoot: revision.id === ROOT_ID,
      onTrunk: revision.trunk ?? (trunk === null || trunk.has(revision.id)),
      selected: !highlighting || selectedSet.has(revision.id),
      color: normalizeColor(revision.color),
    })),
    column,
    highlighting,
    selectedCount: selectedSet.size,
  };
}

/** Escapes text for a Graphviz HTML-like label. */
function escapeLabel(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Escapes text destined for an XML attribute value. */
function escapeAttribute(text: string): string {
  return escapeLabel(text).replaceAll('"', "&quot;");
}

/** Quotes a DOT identifier so ids containing `-` are legal. */
function quote(id: string): string {
  return `"${id}"`;
}

function labelNodeName(id: string): string {
  return `label__${id}`;
}

/** `zsuskuln feature-3`, with the unambiguous prefix split out. */
function labelHtml(
  revision: NormalizedRevision,
  changeIds: readonly string[],
): string {
  const split = uniquePrefixLength(revision.changeId, changeIds);
  const prefix = escapeLabel(revision.changeId.slice(0, split));
  const rest = escapeLabel(revision.changeId.slice(split));

  const parts = [
    `<font color="${SENTINEL.changeIdPrefix}"><b>${prefix}</b></font>`,
  ];
  if (rest.length > 0) {
    parts.push(`<font color="${SENTINEL.changeIdRest}">${rest}</font>`);
  }

  const tags = revision.isRoot ? ["root()"] : revision.bookmarks;
  if (tags.length > 0) {
    parts.push(
      `<font color="${SENTINEL.bookmark}">${" ".repeat(LABEL_GAP_SPACES)}` +
        `<b>${escapeLabel(tags.join(" "))}</b></font>`,
    );
  }

  return parts.join("");
}

/** The graph-wide settings, and the defaults every dot inherits. */
const DOT_PREAMBLE = [
  '  bgcolor="transparent";',
  // Bottom-to-top so the working copy sits on top, like `jj log`.
  "  rankdir=BT;",
  "  ranksep=0.30;",
  // With the label node's side margin zeroed below, `nodesep` *is* the gap
  // between a revision's glyph and its change id — so set it to the same two
  // spaces that separate the change id from the bookmarks.
  `  nodesep=${(LABEL_GAP / POINTS_PER_INCH).toFixed(4)};`,
  `  edge [arrowhead=none, color="${SENTINEL.edge}", penwidth=1.6];`,
  '  node [shape=circle, width=0.30, height=0.30, fixedsize=true, label="",' +
    " style=filled, penwidth=0];",
];

/** A dot per revision: its glyph, and the classes the stylesheet paints by. */
function dotNodes(model: JJGraphModel): string[] {
  return model.revisions.map((revision) => {
    const classes = ["jj-node", "jj-dot", `jj-rev-${revision.id}`];
    if (revision.selected) classes.push("is-selected");
    if (revision.workingCopy) classes.push("is-working-copy");
    if (revision.immutable) classes.push("is-immutable");

    const attributes = [
      `fillcolor="${SENTINEL.dot}"`,
      `class="${classes.join(" ")}"`,
    ];
    // Immutable revisions get `jj log`'s diamond glyph.
    if (revision.immutable) {
      attributes.push("shape=diamond", "width=0.36", "height=0.36");
    }
    // ...and the working copy is marked with `@` inside its circle.
    if (revision.workingCopy) {
      attributes.push(
        'label="@"',
        `fontcolor="${SENTINEL.workingCopyGlyph}"`,
        'fontname="Courier-Bold"',
        "fontsize=10",
      );
    }
    // This is what keeps a stack perfectly stacked.
    if (revision.onTrunk) attributes.push("group=trunk");

    return `  ${quote(revision.id)} [${attributes.join(", ")}];`;
  });
}

/** The change id and bookmarks printed beside each dot. */
function dotLabels(
  model: JJGraphModel,
  changeIds: readonly string[],
): string[] {
  return [
    '  node [shape=plaintext, style="", fixedsize=false, width=0, height=0,' +
      // Zero side margin: the gap to the left of the text is `nodesep` alone.
      ` margin="0,0.055", fontname="Courier", fontsize=${String(LABEL_FONT_SIZE)}];`,
    ...model.revisions.map((revision) => {
      const classes = ["jj-node", "jj-label", `jj-rev-${revision.id}`];
      if (revision.selected) classes.push("is-selected");
      return (
        `  ${quote(labelNodeName(revision.id))} ` +
        `[label=<${labelHtml(revision, changeIds)}>, class="${classes.join(" ")}"];`
      );
    }),
  ];
}

/** One edge per parent, bending around whatever rows it has to skip. */
function dotEdges(model: JJGraphModel): string[] {
  const { column } = model;
  /** An edge skips a row when something else was stacked in between. */
  const skipsRows = (parentId: string, childId: string): boolean => {
    const parentRow = column.indexOf(parentId);
    const childRow = column.indexOf(childId);
    return parentRow >= 0 && childRow >= 0 && childRow - parentRow > 1;
  };

  return model.revisions.flatMap((revision) =>
    revision.parentIds.map((parentId) => {
      const attributes = ['class="jj-edge"'];
      // Zero weight is what lets an edge bend: it stops pulling its endpoints
      // into line, so dot is free to route it around the rows it skips rather
      // than dragging them out of the column.
      if (skipsRows(parentId, revision.id)) attributes.push("weight=0");
      return (
        `  ${quote(parentId)} -> ${quote(revision.id)} ` +
        `[${attributes.join(", ")}];`
      );
    }),
  );
}

/**
 * Consecutive rows with no edge of their own — the two sides of a fork,
 * stacked — pinned by an invisible one, which is what forces the real edge
 * past them to bend.
 */
function dotColumnPins(model: JJGraphModel): string[] {
  const { column } = model;
  const parentsById = new Map(
    model.revisions.map((revision) => [revision.id, revision.parentIds]),
  );
  return column.flatMap((id, row) => {
    const below = column[row - 1];
    if (below === undefined) return [];
    if (parentsById.get(id)?.includes(below) === true) return [];
    return [`  ${quote(below)} -> ${quote(id)} [style=invis];`];
  });
}

/** Pins each label to its revision's row, to the right of the dot. */
function dotLabelPins(model: JJGraphModel): string[] {
  return model.revisions.map((revision) => {
    const dot = quote(revision.id);
    const label = quote(labelNodeName(revision.id));
    return `  { rank=same; ${dot}; ${label} } ${dot} -> ${label} [style=invis];`;
  });
}

function toDot(model: JJGraphModel, changeIds: readonly string[]): string {
  return [
    "digraph {",
    ...DOT_PREAMBLE,
    ...dotNodes(model),
    ...dotLabels(model, changeIds),
    ...dotEdges(model),
    ...dotColumnPins(model),
    ...dotLabelPins(model),
    "}",
  ].join("\n");
}

function describe(model: JJGraphModel, revset: string | undefined): string {
  const total = String(model.revisions.length);
  if (revset !== undefined) {
    return `The revset ${revset} selects ${String(model.selectedCount)} of ${total} revisions.`;
  }
  // Highlighted without a revset to name — say what is emphasised anyway.
  if (model.highlighting) {
    return `A jj revision graph of ${total} revisions, ${String(model.selectedCount)} highlighted.`;
  }
  return `A jj revision graph of ${total} revisions.`;
}

type LaidOutGraph = {
  /** Graphviz's `<svg>` contents, ready to place inside a larger drawing. */
  body: string;
  width: number;
  height: number;
};

/**
 * Rewrites Graphviz's SVG so the page's CSS owns every color — sentinel fills
 * become classes and per-revision color overrides become inline custom
 * properties — then hands back just the drawing and its size, so a caller can
 * either wrap it alone or compose several into one diagram.
 */
function processGraphSvg(rawSvg: string, model: JJGraphModel): LaidOutGraph {
  let svg = rawSvg.slice(rawSvg.indexOf("<svg"));

  // Graphviz escapes every hyphen as `&#45;`, including inside class names.
  // Decoding them keeps class selectors matchable here and readable in devtools
  // (the browser would decode them anyway, so this changes nothing on screen).
  svg = svg.replaceAll("&#45;", "-");

  // Tooltips on every node would be noise for a decorative diagram.
  svg = svg.replaceAll(/<title>[\s\S]*?<\/title>/g, "");

  // Graphviz numbers its nodes from 1 in every graph it lays out, so several
  // diagrams on one page — or two halves of one pair — would collide. Nothing
  // references these ids, so the simplest fix is to drop them.
  svg = svg.replaceAll(/ id="[^"]*"/g, "");

  // Sentinels -> CSS hooks. Each sentinel is unique to one role, so a plain
  // replacement is unambiguous; Graphviz puts no `class` on these elements.
  svg = svg
    .replaceAll(`fill="${SENTINEL.changeIdPrefix}"`, 'class="jj-change-id"')
    .replaceAll(`fill="${SENTINEL.changeIdRest}"`, 'class="jj-change-id-rest"')
    .replaceAll(`fill="${SENTINEL.bookmark}"`, 'class="jj-bookmark"')
    .replaceAll(
      `fill="${SENTINEL.workingCopyGlyph}"`,
      'class="jj-working-copy-glyph"',
    )
    .replaceAll(`fill="${SENTINEL.dot}"`, "")
    .replaceAll(`stroke="${SENTINEL.edge}"`, "")
    .replaceAll(' stroke="black"', "");

  // `reset.css` applies `* { font: inherit }`, and any author rule outranks an
  // SVG presentation attribute — so the font metrics Graphviz laid this text
  // out with would be thrown away. Promote them to inline styles, which the
  // reset cannot reach. (font-family is deliberately left to the stylesheet:
  // the site's mono face is metric-compatible with Graphviz's Courier.)
  svg = svg.replaceAll(/<text\b[^>]*>/g, (tag) => {
    const fontSize = /font-size="([\d.]+)"/.exec(tag)?.[1];
    const fontWeight = /font-weight="([^"]+)"/.exec(tag)?.[1];
    const declarations = [
      fontSize === undefined ? null : `font-size:${fontSize}px`,
      fontWeight === undefined ? null : `font-weight:${fontWeight}`,
    ].filter((declaration) => declaration !== null);
    return declarations.length === 0
      ? tag
      : `${tag.slice(0, -1)} style="${declarations.join(";")}">`;
  });

  // Per-revision color overrides ride along as custom properties on the node
  // group, where they beat the role defaults set by class. Ids are validated
  // against `VALID_ID`, so none of them can carry regex syntax in here.
  for (const revision of model.revisions) {
    if (revision.color === null) continue;
    const style =
      `--jj-dot-light:${revision.color.light};` +
      `--jj-dot-dark:${revision.color.dark}`;
    svg = svg.replace(
      new RegExp(`(<g[^>]*class="[^"]*jj-rev-${revision.id}(?=[\\s"])[^"]*")`),
      `$1 style="${style}"`,
    );
  }

  const viewBox = /viewBox="([\d.\s-]+)"/.exec(svg)?.[1]?.trim().split(/\s+/);
  return {
    body: svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>")),
    width: Number(viewBox?.[2] ?? 0),
    height: Number(viewBox?.[3] ?? 0),
  };
}

/**
 * Wraps a finished drawing in the outer `<svg>`. The intrinsic size is kept —
 * the stylesheet scales it down from there on narrow screens.
 */
function wrapSvg(graph: LaidOutGraph, ariaLabel: string): string {
  // This site prettifies its HTML responses, and reindenting an SVG rewrites
  // the whitespace inside `xml:space="preserve"` text runs — which visibly
  // shifts every glyph. Prettier honors this comment and leaves the SVG alone.
  return (
    `<!-- prettier-ignore -->` +
    `<svg width="${String(graph.width)}pt" height="${String(graph.height)}pt"` +
    ` viewBox="0 0 ${String(graph.width)} ${String(graph.height)}"` +
    ` xmlns="http://www.w3.org/2000/svg" class="jj-graph-svg" role="img"` +
    ` aria-label="${escapeAttribute(ariaLabel)}">${graph.body}</svg>`
  );
}

/** Graphviz's wasm module is expensive to instantiate; share one per build. */
let graphvizPromise: Promise<Graphviz> | null = null;
function loadGraphviz(): Promise<Graphviz> {
  graphvizPromise ??= Graphviz.load();
  return graphvizPromise;
}

/** Every change id in a diagram, which abbreviations must be unique against. */
function changeIdsOf(models: readonly JJGraphModel[]): string[] {
  return models.flatMap((model) =>
    model.revisions.map((revision) => revision.changeId),
  );
}

async function layOutModel(
  model: JJGraphModel,
  changeIds: readonly string[],
): Promise<LaidOutGraph> {
  const graphviz = await loadGraphviz();
  return processGraphSvg(
    graphviz.layout(toDot(model, changeIds), "svg", "dot"),
    model,
  );
}

export async function renderJJGraph(
  revisions: readonly JJRevision[],
  selected?: readonly string[],
  revset?: string,
  options: JJGraphOptions = {},
): Promise<string> {
  const model = buildJJGraph(revisions, selected, options);
  const graph = await layOutModel(model, changeIdsOf([model]));
  return wrapSvg(graph, describe(model, revset));
}

/* -- before/after ------------------------------------------------------- */

export type JJGraphPair = { before: string; after: string };

/**
 * Renders the two halves of a before/after diagram as two independent SVGs.
 *
 * They are deliberately *not* composed into one drawing: a combined SVG is
 * twice as wide as a single graph, so `max-width: 100%` shrinks it — and its
 * text with it — to an unreadable size on a phone. Kept separate, each half
 * keeps its intrinsic size and the stylesheet is free to rearrange them.
 */
export async function renderJJGraphPair(
  before: JJGraphSpec,
  after: JJGraphSpec,
  command: string,
  options: JJGraphOptions = {},
): Promise<JJGraphPair> {
  const beforeModel = buildJJGraph(before.revisions, before.selected, options);
  const afterModel = buildJJGraph(after.revisions, after.selected, options);
  // One pool of change ids across both halves, so a revision present in both
  // abbreviates the same way on each side of the arrow.
  const changeIds = changeIdsOf([beforeModel, afterModel]);

  const [left, right] = await Promise.all([
    layOutModel(beforeModel, changeIds),
    layOutModel(afterModel, changeIds),
  ]);

  return {
    before: wrapSvg(left, `The jj revision graph before running ${command}.`),
    after: wrapSvg(right, `The jj revision graph after running ${command}.`),
  };
}
