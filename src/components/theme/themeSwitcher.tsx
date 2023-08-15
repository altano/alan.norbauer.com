"use client";

import { css } from "@styled-system/css";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "nextra/icons";
import { Select } from "@/components/select";
import { useEffect, useState } from "react";

type ThemeSwitchProps = {
  lite?: boolean;
  className?: string;
};

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { setTheme, resolvedTheme, theme = "" } = useTheme();
  const mounted = useIsMounted();

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
