import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        sidebar: "#0E1C33",
        // GH Pvt Ltd brand tokens ("Oxford")
        navy: "#0E1C33",
        brass: { DEFAULT: "#A8812F", light: "#C9A24B" },
        ivory: "#FAF9F6",
        ink: "#4A5568", // Slate — body text on ivory
        hairline: "#DDDCD7",
        mist: "#AEB7C4", // body text on navy
        rule: "#2A3A52", // dividers on navy
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
      },
    },
  },
  plugins: [animate],
};

export default config;
