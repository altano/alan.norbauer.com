"use client";

import { css } from "@styled-system/css";
import { useTheme } from "next-themes";
import { useMounted } from "nextra/hooks";
import { MoonIcon, SunIcon } from "nextra/icons";
import { Select } from "@/components/select";

type ThemeSwitchProps = {
  lite?: boolean;
  className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { setTheme, resolvedTheme, theme = "" } = useTheme();
  const mounted = useMounted();

  // TODO Reconsider
  if (!mounted) {
    return null;
  }

  const IconToUse = mounted && resolvedTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <Select
      className={className}
      title="Change theme"
      options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ]}
      onChange={(option) => {
        if (!option) return;
        setTheme(option.value);
      }}
      selected={{
        value: theme,
        label: (
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 2,
              textTransform: "capitalize",
            })}
          >
            <IconToUse />
          </div>
        ),
      }}
    />
  );
}
