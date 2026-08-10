/**
 * Node-only tests for the jj revision graph renderer.
 *
 * The module's whole job is to turn a list of revisions into an SVG, so these
 * assert against that SVG rather than any intermediate: what the module exports
 * is `renderJJGraph`/`renderJJGraphPair`, and everything between them and
 * Graphviz is free to change.
 *
 * Two layers, deliberately:
 *
 *  - Named tests pin the contract — the straight column, the abbreviation
 *    rules, the sentinel-to-CSS-class rewrite, the errors. When one fails it
 *    says which promise broke.
 *  - A single snapshot of the whole corpus catches *unintended* changes
 *    anywhere in the pipeline, including inside Graphviz's layout, which no
 *    reasonable assertion would cover. When it fails alone, the question is
 *    whether the new drawing is better, not whether it is different.
 */
import { test, expect } from "@playwright/test";
import {
  renderJJGraph,
  renderJJGraphPair,
  type JJGraphSpec,
  type JJRevision,
} from "../../src/utilities/jj-graph.js";

/* -- corpus --------------------------------------------------------------- */

/** The stack the article draws: a straight line, working copy in the middle. */
const STACK: JJRevision[] = [
  { id: "main", bookmarks: ["main"], immutable: true },
  { id: "a", bookmarks: ["feature-1"], parentIds: ["main"] },
  { id: "b", bookmarks: ["feature-2"], parentIds: ["a"] },
  { id: "c", bookmarks: ["feature-3"], parentIds: ["b"], workingCopy: true },
  { id: "d", bookmarks: ["feature-4"], parentIds: ["c"] },
];

/** The same stack forked above `b`, so it has two heads. */
const FORKED: JJRevision[] = [
  ...STACK,
  { id: "e", bookmarks: ["feature-5"], parentIds: ["b"] },
];

/** A merge, whose second parent is only reachable the long way round. */
const MERGED: JJRevision[] = [
  { id: "main", bookmarks: ["main"], immutable: true },
  { id: "a", parentIds: ["main"] },
  { id: "b", parentIds: ["a"] },
  { id: "c", parentIds: ["a"] },
  { id: "m", bookmarks: ["merge"], parentIds: ["b", "c"], workingCopy: true },
  { id: "z", parentIds: ["m"] },
];

const withWorkingCopyAt = (id: string): JJRevision[] =>
  STACK.map((revision) => ({ ...revision, workingCopy: revision.id === id }));

const withNewCommitAbove = (parentId: string): JJRevision[] => [
  ...STACK.map((revision) => ({ ...revision, workingCopy: false })),
  { id: "new", parentIds: [parentId], workingCopy: true },
];

const STACKED = { aggressivelyStackCommits: true };

/* -- reading the drawing back --------------------------------------------- */

/**
 * One `<g>` Graphviz emitted for a revision. Every revision produces two: the
 * dot (`jj-dot`) and the change id beside it (`jj-label`).
 */
type RenderedNode = {
  classes: readonly string[];
  /** Per-revision color overrides ride in here as custom properties. */
  style: string | undefined;
  markup: string;
};

function attribute(markup: string, name: string): string | undefined {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(markup)?.[1];
}

/**
 * Node groups are leaves in Graphviz's output, so a lazy match to the next
 * `</g>` is exact — but only if the outer `<g class="graph">` wrapper is
 * excluded first, or it would swallow whichever node comes first.
 */
function renderedNodes(svg: string): RenderedNode[] {
  return [
    ...svg.matchAll(/<g class="([^"]*\bjj-[^"]*)"([^>]*)>([\s\S]*?)<\/g>/g),
  ].map(([, classes = "", rest = "", markup = ""]) => ({
    classes: classes.split(" "),
    style: attribute(rest, "style"),
    markup,
  }));
}

function nodeFor(
  svg: string,
  id: string,
  kind: "jj-dot" | "jj-label",
): RenderedNode {
  const node = renderedNodes(svg).find(
    (candidate) =>
      candidate.classes.includes(kind) &&
      candidate.classes.includes(`jj-rev-${id}`),
  );
  if (node === undefined) {
    throw new Error(`no ${kind} was drawn for revision "${id}"`);
  }
  return node;
}

/** Mean of a polygon's points is its centre, and a circle states it outright. */
function centre(markup: string, axis: "x" | "y"): number {
  const stated = attribute(markup, axis === "x" ? "cx" : "cy");
  if (stated !== undefined) return Number(stated);
  const points = attribute(markup, "points");
  if (points === undefined) {
    throw new Error("node is neither a circle nor a polygon");
  }
  const values = points
    .trim()
    .split(/\s+/)
    .map((point) => Number(point.split(",")[axis === "x" ? 0 : 1]));
  const mean =
    values.reduce((total, value) => total + value, 0) / values.length;
  // Graphviz emits two decimals; averaging reintroduces float error that
  // would otherwise read as a second column a hundredth of a point away.
  return Number(mean.toFixed(2));
}

const dotX = (svg: string, id: string): number =>
  centre(nodeFor(svg, id, "jj-dot").markup, "x");
const dotY = (svg: string, id: string): number =>
  centre(nodeFor(svg, id, "jj-dot").markup, "y");

function decode(text: string): string {
  return text
    .replaceAll("&#160;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&");
}

/** The text of a label's runs, by the CSS class the sentinel rewrite gave it. */
function runs(svg: string, id: string, className: string): string {
  return [
    ...nodeFor(svg, id, "jj-label").markup.matchAll(
      /<text\b([^>]*)>([\s\S]*?)<\/text>/g,
    ),
  ]
    .filter(([, tag = ""]) => attribute(tag, "class") === className)
    .map(([, , text = ""]) => decode(text))
    .join("");
}

/** `zsuskuln` — the abbreviated prefix and the dimmed remainder, rejoined. */
const changeId = (svg: string, id: string): string =>
  runs(svg, id, "jj-change-id") + runs(svg, id, "jj-change-id-rest");

/** Just the abbreviated part, which is what `jj log` would actually print. */
const abbreviation = (svg: string, id: string): string =>
  runs(svg, id, "jj-change-id");

/** Every revision the drawing contains, including any inferred root. */
function drawnRevisions(svg: string): string[] {
  return renderedNodes(svg)
    .filter((node) => node.classes.includes("jj-dot"))
    .map((node) => {
      const id = node.classes.find((name) => name.startsWith("jj-rev-"));
      return (id ?? "").slice("jj-rev-".length);
    });
}

const ariaLabel = (svg: string): string =>
  decode(attribute(svg, "aria-label") ?? "");

/* -- structure ------------------------------------------------------------ */

test.describe("structure", () => {
  test("draws a dot and a label for every revision", async () => {
    const svg = await renderJJGraph(STACK);
    for (const { id } of STACK) {
      expect(nodeFor(svg, id, "jj-dot").classes).toContain("jj-node");
      expect(nodeFor(svg, id, "jj-label").classes).toContain("jj-node");
    }
    // `main` names no parent, so it hangs off the root jj always has.
    expect(drawnRevisions(svg).toSorted()).toEqual(
      ["root", ...STACK.map(({ id }) => id)].toSorted(),
    );
  });

  test("marks the working copy with `@` inside its dot", async () => {
    const svg = await renderJJGraph(STACK);
    const workingCopy = nodeFor(svg, "c", "jj-dot");
    expect(workingCopy.classes).toContain("is-working-copy");
    expect(workingCopy.markup).toContain(">@<");
    expect(workingCopy.markup).toContain('class="jj-working-copy-glyph"');
    expect(nodeFor(svg, "b", "jj-dot").classes).not.toContain(
      "is-working-copy",
    );
  });

  test("draws immutable revisions as a diamond, the rest as circles", async () => {
    const svg = await renderJJGraph(STACK);
    const immutable = nodeFor(svg, "main", "jj-dot");
    expect(immutable.classes).toContain("is-immutable");
    expect(immutable.markup).toContain("<polygon");
    expect(nodeFor(svg, "a", "jj-dot").markup).toContain("<ellipse");
  });

  test("prints bookmarks beside the change id", async () => {
    const svg = await renderJJGraph(STACK);
    expect(runs(svg, "a", "jj-bookmark")).toBe("  feature-1");
    expect(runs(svg, "d", "jj-bookmark")).toBe("  feature-4");
  });

  test("escapes markup in bookmarks", async () => {
    const svg = await renderJJGraph([{ id: "a", bookmarks: ["x<y>&z"] }]);
    expect(runs(svg, "a", "jj-bookmark")).toBe("  x<y>&z");
    expect(svg).not.toContain("x<y>");
  });
});

/* -- the inferred root ---------------------------------------------------- */

test.describe("the root revision", () => {
  test("is created, and labelled `root()`, when something points at it", async () => {
    const svg = await renderJJGraph([{ id: "a" }]);
    expect(runs(svg, "root", "jj-bookmark")).toBe("  root()");
    expect(nodeFor(svg, "root", "jj-dot").classes).toContain("is-immutable");
    // jj's root is all-zero, which in reverse hex is all-z.
    expect(changeId(svg, "root")).toBe("zzzzzzzz");
  });

  test("is not invented when no revision points at it", async () => {
    const svg = await renderJJGraph([
      { id: "a", parentIds: [] },
      { id: "b", parentIds: ["a"] },
    ]);
    expect(svg).not.toContain("jj-rev-root");
    expect(ariaLabel(svg)).toContain("2 revisions");
  });

  test("is not duplicated when the author declares it", async () => {
    const svg = await renderJJGraph([
      { id: "root", parentIds: [], immutable: true },
      { id: "a", parentIds: ["root"] },
    ]);
    expect(drawnRevisions(svg)).toEqual(["root", "a"]);
    // Still the root: `root()` for a label and jj's all-zero change id, which
    // in reverse hex is all-z. Declaring it is how you reach it, not how you
    // rename it.
    expect(runs(svg, "root", "jj-bookmark")).toBe("  root()");
    expect(changeId(svg, "root")).toBe("zzzzzzzz");
  });
});

/* -- change ids ----------------------------------------------------------- */

test.describe("change ids", () => {
  test("look like jj's: eight digits of reverse hex", async () => {
    const svg = await renderJJGraph(FORKED);
    for (const id of drawnRevisions(svg)) {
      expect(changeId(svg, id)).toMatch(/^[k-z]{8}$/);
    }
  });

  test("are stable across renders, so rebuilds do not churn", async () => {
    expect(await renderJJGraph(STACK)).toBe(await renderJJGraph(STACK));
  });

  test("are taken from the author when given", async () => {
    const svg = await renderJJGraph([{ id: "a", changeId: "qpvuntsm" }]);
    expect(changeId(svg, "a")).toBe("qpvuntsm");
  });

  test("abbreviate to the shortest unambiguous prefix", async () => {
    const svg = await renderJJGraph(FORKED);
    const drawn = drawnRevisions(svg);
    const all = drawn.map((id) => changeId(svg, id));

    for (const id of drawn) {
      const short = abbreviation(svg, id);
      const full = changeId(svg, id);
      expect(full.startsWith(short)).toBe(true);

      // Unambiguous: nothing else in the graph shares the prefix...
      const shares = (prefix: string) =>
        all.filter((other) => other.startsWith(prefix)).length;
      expect(shares(short)).toBe(1);
      // ...and shortest: one digit less and something would.
      if (short.length > 1) {
        expect(shares(short.slice(0, -1))).toBeGreaterThan(1);
      }
    }
  });

  test("abbreviate against a contrived collision", async () => {
    const svg = await renderJJGraph([
      { id: "a", changeId: "zzaaaaaa" },
      { id: "b", changeId: "zzbbbbbb", parentIds: ["a"] },
      { id: "c", changeId: "kkkkkkkk", parentIds: ["b"] },
    ]);
    expect(abbreviation(svg, "a")).toBe("zza");
    expect(abbreviation(svg, "b")).toBe("zzb");
    expect(abbreviation(svg, "c")).toBe("k");
  });
});

/* -- selection ------------------------------------------------------------ */

test.describe("selection", () => {
  test("dims everything the revset misses", async () => {
    const svg = await renderJJGraph(FORKED, ["d", "e"], "stack_heads()");
    for (const { id } of FORKED) {
      const selected = ["d", "e"].includes(id);
      expect(nodeFor(svg, id, "jj-dot").classes.includes("is-selected")).toBe(
        selected,
      );
      expect(nodeFor(svg, id, "jj-label").classes.includes("is-selected")).toBe(
        selected,
      );
    }
    expect(ariaLabel(svg)).toBe(
      "The revset stack_heads() selects 2 of 7 revisions.",
    );
  });

  test("draws every revision at full strength when no revset is illustrated", async () => {
    const svg = await renderJJGraph(FORKED);
    for (const { id } of FORKED) {
      expect(nodeFor(svg, id, "jj-dot").classes).toContain("is-selected");
    }
    expect(ariaLabel(svg)).toBe("A jj revision graph of 7 revisions.");
  });

  test("dims everything when the revset selects nothing", async () => {
    const svg = await renderJJGraph(FORKED, [], "stack_top()");
    for (const { id } of FORKED) {
      expect(nodeFor(svg, id, "jj-dot").classes).not.toContain("is-selected");
    }
    expect(ariaLabel(svg)).toBe(
      "The revset stack_top() selects 0 of 7 revisions.",
    );
  });

  test("says what is emphasised even with no revset to name", async () => {
    const svg = await renderJJGraph(STACK, ["a"]);
    expect(ariaLabel(svg)).toBe(
      "A jj revision graph of 6 revisions, 1 highlighted.",
    );
  });

  test("escapes the revset in the description", async () => {
    const svg = await renderJJGraph(STACK, ["a"], 'x & "y" <z>');
    expect(ariaLabel(svg)).toContain('x & "y" <z>');
    expect(svg).toContain("&amp;");
    expect(svg).not.toContain('"y"');
  });
});

/* -- layout --------------------------------------------------------------- */

test.describe("layout", () => {
  test("pins the working copy's ancestry into one straight column", async () => {
    const svg = await renderJJGraph(FORKED);
    // The longest first-parent chain running through the working copy, which
    // here reaches past `@` to the head above it.
    const column = ["root", "main", "a", "b", "c", "d"].map((id) =>
      dotX(svg, id),
    );
    expect(new Set(column).size).toBe(1);
    // The fork is what the column is straight *at the expense of*.
    expect(dotX(svg, "e")).not.toBe(column[0]);
  });

  test("stacks the fork into the column when asked", async () => {
    const svg = await renderJJGraph(FORKED, undefined, undefined, STACKED);
    const xs = FORKED.map(({ id }) => dotX(svg, id));
    expect(new Set(xs).size).toBe(1);
    // One revision per row, which is what makes it read as a single stack.
    expect(new Set(FORKED.map(({ id }) => dotY(svg, id))).size).toBe(
      FORKED.length,
    );
  });

  test("orders the column bottom-up, oldest first", async () => {
    const svg = await renderJJGraph(STACK, undefined, undefined, STACKED);
    // Graphviz's y grows downward, so an ancestor sits at a *larger* y.
    const ys = ["main", "a", "b", "c", "d"].map((id) => dotY(svg, id));
    expect(ys).toEqual([...ys].sort((left, right) => right - left));
  });

  test("keeps a merge's second parent out of the column", async () => {
    const svg = await renderJJGraph(MERGED);
    expect(dotX(svg, "m")).toBe(dotX(svg, "b"));
    expect(dotX(svg, "c")).not.toBe(dotX(svg, "m"));
  });

  test("stacks a merge one revision per row", async () => {
    const svg = await renderJJGraph(MERGED, undefined, undefined, STACKED);
    expect(new Set(MERGED.map(({ id }) => dotX(svg, id))).size).toBe(1);
    expect(new Set(MERGED.map(({ id }) => dotY(svg, id))).size).toBe(
      MERGED.length,
    );
  });

  test("honours an explicit `trunk`", async () => {
    const off = await renderJJGraph([
      { id: "a" },
      { id: "b", parentIds: ["a"] },
      { id: "c", parentIds: ["a"] },
    ]);
    const on = await renderJJGraph([
      { id: "a" },
      { id: "b", parentIds: ["a"], trunk: false },
      { id: "c", parentIds: ["a"], trunk: true },
    ]);
    // Left to itself the column follows the first child; forcing `trunk` onto
    // the other one moves it, which is the whole point of the override.
    expect(dotX(off, "b")).toBe(dotX(off, "a"));
    expect(dotX(on, "c")).toBe(dotX(on, "a"));
    expect(dotX(on, "b")).not.toBe(dotX(on, "a"));
  });

  test("puts the label to the right of its dot, on the same row", async () => {
    const svg = await renderJJGraph(STACK);
    for (const { id } of STACK) {
      const label = nodeFor(svg, id, "jj-label");
      expect(Number(attribute(label.markup, "x"))).toBeGreaterThan(
        dotX(svg, id),
      );
      // The text's baseline, not its centre, so it sits a few points below
      // the dot's — but nowhere near the next row, 33pt away.
      const offset = Number(attribute(label.markup, "y")) - dotY(svg, id);
      expect(Math.abs(offset)).toBeLessThan(8);
    }
  });
});

/* -- theming -------------------------------------------------------------- */

test.describe("theming", () => {
  test("bakes no color into the SVG", async () => {
    const svg = await renderJJGraph(FORKED, ["d"], "stack_top()");
    // Every sentinel is rewritten, and Graphviz's own defaults are stripped,
    // so light/dark theming is left entirely to the stylesheet. Character
    // references are dropped first — `&#160;` is not a color.
    expect(svg.replaceAll(/&#\d+;/g, "")).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(svg).not.toContain('stroke="black"');
    expect(svg).not.toContain('fill="black"');
  });

  test("passes a revision's color through as custom properties", async () => {
    const svg = await renderJJGraph([
      { id: "a", color: "#ff0000" },
      {
        id: "b",
        parentIds: ["a"],
        color: { light: "#111111", dark: "#eeeeee" },
      },
    ]);
    // A single color applies to both schemes; a pair is used as given.
    expect(nodeFor(svg, "a", "jj-dot").style).toBe(
      "--jj-dot-light:#ff0000;--jj-dot-dark:#ff0000",
    );
    expect(nodeFor(svg, "b", "jj-dot").style).toBe(
      "--jj-dot-light:#111111;--jj-dot-dark:#eeeeee",
    );
    expect(nodeFor(svg, "root", "jj-dot").style).toBeUndefined();
  });

  test("promotes font metrics to inline styles", async () => {
    const svg = await renderJJGraph(STACK);
    // `reset.css` sets `* { font: inherit }`, which outranks an SVG
    // presentation attribute but not an inline style — so the metrics
    // Graphviz laid the text out with have to be promoted or the columns
    // stop lining up.
    for (const [, tag = ""] of svg.matchAll(/<text\b([^>]*)>/g)) {
      const size = attribute(tag, "font-size");
      expect(size).toBeDefined();
      expect(attribute(tag, "style")).toContain(`font-size:${String(size)}px`);
    }
  });
});

/* -- embedding several graphs in one page --------------------------------- */

test.describe("page safety", () => {
  test("emits no ids, which would collide between graphs", async () => {
    // Graphviz numbers its nodes from 1 in every graph it lays out, so two
    // diagrams on one page would otherwise share ids.
    expect(await renderJJGraph(STACK)).not.toMatch(/\sid="/);
  });

  test("emits no tooltips", async () => {
    expect(await renderJJGraph(STACK)).not.toContain("<title>");
  });

  test("keeps class names readable rather than entity-encoded", async () => {
    const svg = await renderJJGraph([{ id: "my-rev" }]);
    expect(svg).toContain("jj-rev-my-rev");
    expect(svg).not.toContain("&#45;");
  });

  test("states its intrinsic size and describes itself", async () => {
    const svg = await renderJJGraph(STACK);
    expect(svg).toMatch(/^<!-- prettier-ignore --><svg width="\d+pt"/);
    expect(svg).toContain('role="img"');
    expect(attribute(svg, "class")).toBe("jj-graph-svg");
  });
});

/* -- before/after pairs --------------------------------------------------- */

test.describe("before/after pairs", () => {
  test("abbreviates a shared revision identically on both sides", async () => {
    const before: JJGraphSpec = { revisions: withWorkingCopyAt("d") };
    const after: JJGraphSpec = { revisions: withNewCommitAbove("b") };
    const pair = await renderJJGraphPair(before, after, "jj move-to w");

    // The right half has an extra revision, so on its own it could need a
    // longer prefix than the left — and the same revision would then read
    // differently across the arrow.
    for (const { id } of STACK) {
      expect(abbreviation(pair.before, id)).toBe(abbreviation(pair.after, id));
      expect(changeId(pair.before, id)).toBe(changeId(pair.after, id));
    }
  });

  test("describes each half by the command between them", async () => {
    const pair = await renderJJGraphPair(
      { revisions: STACK },
      { revisions: withNewCommitAbove("d") },
      "jj top",
    );
    expect(ariaLabel(pair.before)).toBe(
      "The jj revision graph before running jj top.",
    );
    expect(ariaLabel(pair.after)).toBe(
      "The jj revision graph after running jj top.",
    );
  });

  test("keeps each half a separate drawing at its own size", async () => {
    const pair = await renderJJGraphPair(
      { revisions: STACK },
      { revisions: withNewCommitAbove("d") },
      "jj top",
    );
    // Composed into one SVG the pair would be twice as wide as a graph, and
    // `max-width: 100%` would shrink its text to nothing on a phone.
    for (const half of [pair.before, pair.after]) {
      expect(half).toContain('class="jj-graph-svg"');
    }
    expect(attribute(pair.after, "height")).not.toBe(
      attribute(pair.before, "height"),
    );
  });

  test("applies a revset to each half independently", async () => {
    const pair = await renderJJGraphPair(
      { revisions: STACK, selected: ["a"] },
      { revisions: STACK, selected: [] },
      "jj abandon",
    );
    expect(nodeFor(pair.before, "a", "jj-dot").classes).toContain(
      "is-selected",
    );
    expect(nodeFor(pair.after, "a", "jj-dot").classes).not.toContain(
      "is-selected",
    );
  });
});

/* -- input validation ----------------------------------------------------- */

test.describe("rejects", () => {
  const cases: [string, () => Promise<string>][] = [
    [
      'JJGraph: revision id "has space" must match /^[A-Za-z0-9_-]+$/',
      () => renderJJGraph([{ id: "has space" }]),
    ],
    [
      'JJGraph: duplicate revision id "a"',
      () => renderJJGraph([{ id: "a" }, { id: "a" }]),
    ],
    [
      'JJGraph: revision "a" has unknown parent "nope"',
      () => renderJJGraph([{ id: "a", parentIds: ["nope"] }]),
    ],
    [
      'JJGraph: selected revision "nope" does not exist',
      () => renderJJGraph([{ id: "a" }], ["nope"]),
    ],
  ];

  for (const [message, render] of cases) {
    test(message, async () => {
      await expect(render()).rejects.toThrow(message);
    });
  }
});

/* -- the whole corpus ----------------------------------------------------- */

test("draws the article's diagrams as expected", async () => {
  const drawings: string[] = [];
  const draw = async (name: string, svg: Promise<string>) => {
    drawings.push(`### ${name}\n${await svg}`);
  };

  await draw("heads", renderJJGraph(FORKED, ["d", "e"], "stack_heads()"));
  await draw("top", renderJJGraph(STACK, ["d"], "stack_top()"));
  await draw("top-ambiguous", renderJJGraph(FORKED, [], "stack_top()"));
  await draw(
    "tree",
    renderJJGraph(FORKED, ["a", "b", "c", "d", "e"], "tree()"),
  );
  await draw("bottom", renderJJGraph(STACK, ["a"], "stack_bottom()", STACKED));
  await draw(
    "stack",
    renderJJGraph(STACK, ["a", "b", "c", "d"], "stack()", STACKED),
  );
  await draw(
    "substack",
    renderJJGraph(STACK, ["a", "b", "c"], "substack()", STACKED),
  );
  await draw("plain", renderJJGraph(STACK, undefined, undefined, STACKED));
  await draw("fork", renderJJGraph(FORKED));
  await draw("merge", renderJJGraph(MERGED));
  await draw(
    "merge-stacked",
    renderJJGraph(MERGED, undefined, undefined, STACKED),
  );

  for (const [name, before, after, command] of [
    [
      "move-to",
      withWorkingCopyAt("d"),
      withNewCommitAbove("b"),
      "jj move-to w",
    ],
    [
      "move-to-edit",
      withWorkingCopyAt("d"),
      withWorkingCopyAt("b"),
      "jj move-to w --edit",
    ],
    ["top", withWorkingCopyAt("b"), withNewCommitAbove("d"), "jj top"],
    [
      "top-edit",
      withWorkingCopyAt("b"),
      withWorkingCopyAt("d"),
      "jj top --edit",
    ],
  ] as const) {
    const pair = await renderJJGraphPair(
      { revisions: before },
      { revisions: after },
      command,
      STACKED,
    );
    drawings.push(`### pair:${name}\n${pair.before}\n${pair.after}`);
  }

  expect(drawings.join("\n\n")).toMatchSnapshot("graphs.svg");
});
