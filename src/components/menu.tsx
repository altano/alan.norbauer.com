import { css, cx } from "@styled-system/css";
import { Menu as ArkMenu } from "@ark-ui/react";
import { CheckIcon } from "nextra/icons";

type MenuItem = {
  value: string;
  label: React.ReactNode;
};

interface MenuProps {
  selected: MenuItem;
  onChange: (value: string) => void;
  items: MenuItem[];
  title?: string;
  className?: string;
}

export function Menu({
  items,
  selected,
  onChange,
  title,
  className,
}: MenuProps) {
  return (
    <ArkMenu.Root
      onSelect={(item) => {
        console.log({ item }, `${item.value} selected`);
        onChange(item.value);
      }}
    >
      <ArkMenu.Trigger
        aria-label="Select light/dark theme"
        className={cx(
          css({
            outline: "none",
            height: 7,
            borderRadius: "md",
            px: 2,
            textAlign: "left",
            fontSize: "xs",
            fontWeight: "medium",
            cursor: "pointer",
            color: "text",
            bg: "bg",
            transition:
              "color var(--durations-color-scheme), background var(--durations-color-scheme)",

            _expanded: {
              color: "text.card",
              bg: "bg.card",
            },
            _hover: {
              color: "text.card",
              bg: "bg.card",
            },
          }),
          className
        )}
      >
        {selected?.label ?? title}
      </ArkMenu.Trigger>

      <ArkMenu.Positioner
        className={css({
          zIndex: 20,
          maxHeight: 64,
          overflow: "auto",
          borderRadius: "md",
          outlineWidth: "1px",
          outlineColor: "rgb(0 0 0 / 0.05)",
          bg: "white",
          py: "1",
          fontSize: "sm",
          shadow: "lg",
          _dark: {
            outlineColor: "rgb(255 255 255 / 0.2)",
            bg: "neutral.800",
          },
        })}
      >
        <ArkMenu.Content className={css({ outline: "none" })}>
          <ArkMenu.ItemGroup id="theme">
            {items.map((item) => (
              <ArkMenu.Item
                key={item.value}
                id={item.value}
                className={css({
                  color: "colors.text",
                  _hover: {
                    bg: "var(--colors-bg-selection)",
                    color: "var(--colors-text-selection)",
                  },
                  position: "relative",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  py: 1.5,
                  transition: "colors",
                  ps: "3",
                  pe: "9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                {item.label}
                {(console.log({ item, selected }), null)}
                {item.value !== selected.value ? null : (
                  <span
                    className={css({
                      position: "absolute",
                      insetY: 0,
                      display: "flex",
                      alignItems: "center",
                      insetEnd: "3",
                    })}
                  >
                    <CheckIcon />
                  </span>
                )}
              </ArkMenu.Item>
            ))}
          </ArkMenu.ItemGroup>
        </ArkMenu.Content>
      </ArkMenu.Positioner>
    </ArkMenu.Root>
  );
}
