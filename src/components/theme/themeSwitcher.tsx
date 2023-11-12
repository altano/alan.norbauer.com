"use client";

import { css } from "@styled-system/css";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "nextra/icons";
import { Menu } from "@/components/menu";
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
    <Menu
      className={className}
      title="Change theme"
      items={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ]}
      onChange={(value) => {
        if (!value) return;
        setTheme(value);
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
