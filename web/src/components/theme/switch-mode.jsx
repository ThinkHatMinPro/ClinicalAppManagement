import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  IoMoon,
  IoMoonOutline,
  IoSunny,
  IoSunnyOutline,
} from "react-icons/io5";
import { useTheme } from "./theme-provider";

export const SwitchMode = ({ width = 144, height = 72 }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ width, height }}
        className="rounded-full border-2 border-transparent"
      />
    );
  }

  const isDark = theme === "dark";
  const iconSize = height * 0.45;

  return (
    <motion.button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className="relative flex items-center rounded-full border-2 border-border bg-background transition-colors"
      style={{
        width,
        height,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-background"
        animate={{
          backgroundColor: isDark ? "var(--muted)" : "var(--background)",
        }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="absolute z-30 rounded-full border-2 border-border bg-card"
        style={{
          width: height,
          height,
          right: isDark ? -2 : undefined,
          left: isDark ? undefined : -2,
        }}
      />

      <motion.div
        className="relative z-30 flex items-center justify-center"
        style={{
          width: height,
          height,
        }}
        animate={{ rotate: isDark ? 45 : 0 }}
        transition={{ stiffness: 20 }}
      >
        {isDark ? (
          <IoSunnyOutline
            className="text-muted-foreground"
            style={{
              width: iconSize,
              height: iconSize,
            }}
          />
        ) : (
          <IoSunny
            className="text-muted-foreground"
            style={{
              width: iconSize,
              height: iconSize,
            }}
          />
        )}
      </motion.div>

      <motion.div
        className="relative z-30 flex items-center justify-center"
        style={{
          width: height,
          height,
        }}
        animate={{ rotate: isDark ? 0 : 15 }}
        transition={{
          stiffness: 20,
          damping: 14,
        }}
      >
        {isDark ? (
          <IoMoon
            className="text-foreground"
            style={{
              width: iconSize,
              height: iconSize,
            }}
          />
        ) : (
          <IoMoonOutline
            className="text-muted-foreground"
            style={{
              width: iconSize,
              height: iconSize,
            }}
          />
        )}
      </motion.div>
    </motion.button>
  );
};
