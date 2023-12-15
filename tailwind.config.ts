import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "gradient-start": "#B64FCD",
        "gradient-end": "#3C19A8",
      },
    },
  },
  plugins: [],
} satisfies Config;
