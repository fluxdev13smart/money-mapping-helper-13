
import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check local storage and system preference for theme
  const getInitialTheme = (): Theme => {
    // Check if localStorage is available (browser environment)
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = window.localStorage.getItem("theme") as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }

      // Check for user system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light"; // Default theme
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Update theme and localStorage when theme changes
  const setTheme = (newTheme: Theme) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("theme", newTheme);
    }
    setThemeState(newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
