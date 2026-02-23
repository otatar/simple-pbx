import { Moon, Sun, SunMoon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { applyTheme, getCurrentTheme } from "~/utils/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useLayoutEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const toggle = () => {
    if (!theme) return;
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  if (theme === null) {
    return (
      <button type="button" aria-label="Loading theme..." onClick={toggle}>
        <SunMoon />
      </button>
    );
  }

  const isDarkTheme = theme === "dark";
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} mode`}
        onClick={toggle}
      >
        {isDarkTheme ? <Moon /> : <Sun />}
      </button>
    </div>
  );
}
