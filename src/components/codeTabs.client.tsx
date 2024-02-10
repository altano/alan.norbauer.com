"use client";

import { Tabs } from "@ark-ui/react";
import React from "react";

export function CodeTabsRoot(
  props: Pick<
    React.ComponentProps<typeof Tabs.Root>,
    "children" | "defaultValue"
  >
) {
  return <Tabs.Root {...props} />;
}

export function CodeTabsList({
  titles,
  children,
}: {
  children: React.ComponentProps<typeof Tabs.Trigger>["children"][];
  titles: React.ComponentProps<typeof Tabs.Trigger>["value"][];
}) {
  const tabs = React.Children.toArray(children);
  return (
    <Tabs.List style={{ display: "flex" }}>
      {titles.map((title, i) => (
        <Tabs.Trigger asChild key={title} value={title}>
          {tabs[i]}
        </Tabs.Trigger>
      ))}
      <Tabs.Indicator />
    </Tabs.List>
  );
}

export function CodeTabContent(
  props: React.ComponentProps<typeof Tabs.Content>
) {
  return <Tabs.Content {...props} />;
}
