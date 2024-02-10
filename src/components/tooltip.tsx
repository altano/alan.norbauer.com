"use client";

import { Tooltip as ArkTooltip } from "@ark-ui/react";

export function Tooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <ArkTooltip.Root>
      <ArkTooltip.Trigger>{children}</ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content>{label}</ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
}
