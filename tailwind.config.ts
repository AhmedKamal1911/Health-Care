import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: "#131619",
        darkPrimary: "#0D0F10",
        secondary: "#24AE7C",
        primaryGray: "#212328",
        danger: "#F24E43",
        tertiary: "#ABB8C4",
        neutral: "#76828D",
      },
      animation: {
        "caret-blink": "blink 1s  infinite",
        "smooth-slide-in": "slideUp 0.6s 1 ease-in-out forwards",
        "smooth-slide-out": "slideDown 0.6s 1 ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(110%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0%)",
          },
        },
        slideDown: {
          "0%": {
            opacity: "1",
            transform: "translateY(0%)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(110%)",
          },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
