"use client";

import {
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  TabIndicator,
} from "@ark-ui/react";
import React from "react";

export function CodeTabsRoot(
  props: Pick<React.ComponentProps<typeof Tabs>, "children" | "defaultValue">
) {
  return <Tabs {...props} />;
}

export function CodeTabsList({
  titles,
  children,
}: {
  children: React.ComponentProps<typeof TabTrigger>["children"][];
  titles: React.ComponentProps<typeof TabTrigger>["value"][];
}) {
  const tabs = React.Children.toArray(children);
  return (
    <TabList style={{ display: "flex" }}>
      {titles.map((title, i) => (
        <TabTrigger asChild key={title} value={title}>
          {tabs[i]}
        </TabTrigger>
      ))}
      <TabIndicator />
    </TabList>
  );
}

export function CodeTabContent(props: React.ComponentProps<typeof TabContent>) {
  return <TabContent {...props} />;
}
