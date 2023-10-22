"use client";

import {
  Portal,
  Tooltip as ArkTooltip,
  TooltipTrigger,
  TooltipPositioner,
  TooltipContent,
} from "@ark-ui/react";

export function Tooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <ArkTooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <Portal>
        <TooltipPositioner>
          <TooltipContent>{label}</TooltipContent>
        </TooltipPositioner>
      </Portal>
    </ArkTooltip>
  );
}
