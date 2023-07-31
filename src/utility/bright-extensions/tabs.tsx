// TODO remove nocheck below
// @ts-nocheck

// Stolen from https://github.com/code-hike/bright/blob/main/web/app/recipes/tabs/extension.js

import { Code } from "bright";
import {
  CodeTabsRoot,
  CodeTabContent,
  CodeTabsList,
} from "../../components/codeTabs.client";

import type { BrightProps, Extension } from "bright";

function TitleBarComponent(brightProps: BrightProps["TitleBarContent"]) {
  const { subProps, title, Tab } = brightProps;
  const titles = subProps?.length
    ? subProps.map((subProp) => subProp.title)
    : [title];
  const childProps = subProps?.length ? subProps : [brightProps];
  return (
    <CodeTabsList titles={titles}>
      {titles.map((title, i) => (
        <Tab key={title} {...childProps[i]} />
      ))}
    </CodeTabsList>
  );
}

function Root(brightProps: BrightProps["Root"]) {
  const { subProps, title } = brightProps;

  const titles = subProps?.length
    ? subProps.map((subProp) => subProp.title)
    : [title];

  return (
    <CodeTabsRoot defaultValue={titles[0]}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
[data-bright-tab][aria-selected="false"]{ 
  --tab-background: var(--inactive-tab-background);
  --tab-color: var(--inactive-tab-color);; 
  --tab-bottom-border: transparent;
  --tab-top-border: transparent;
}`,
        }}
      />
      <Code.Root {...brightProps} />
    </CodeTabsRoot>
  );
}

function Content(brightProps: BrightProps["Pre"]) {
  const { subProps } = brightProps;
  const propsList = subProps?.length ? subProps : [brightProps];
  return (
    <>
      {propsList.map((props) => (
        <CodeTabContent key={props.title} value={props.title}>
          <Code.Pre {...props} />
        </CodeTabContent>
      ))}
    </>
  );
}

export const tabs: Extension = {
  name: "tabs",
  Root,
  TitleBarContent: TitleBarComponent,
  Pre: Content,
};
