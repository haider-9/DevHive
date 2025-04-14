import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants.js",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        "2xl": "1536px",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography"), heroui({
    addCommonColors: true,
    defaultTheme: "light",
    defaultExtendTheme: "light",
    themes: {
      default: {
        colors: {
          danger: "#f44336",
          warning: "#fbbd23",
        },
        layout: {
          inputErrorBorderColor: "#f44336",
          inputErrorTextColor: "#f44336",
        },
      },
      light: {
        colors: {
          primary: "#f0f0f0",
          secondary: "#e0e0e0",
          background: "#f5f5f5",
          foreground: "#333",
          input: {
            DEFAULT: "#333",
            background: "#a0a0a0"
          },
          danger: "#ff6b6b",
          warning: "#28666e",
          success: "#5cd85a",
          error: "#ff6b6b",
          info: "#54a0ff",
        },
        typography: {
          heading: "#333",
          body: "#666",
          link: "#28666e",
        },
        border: {
          default: "#e0e0e0",
          focus: "#28666e",
        },
        shadow: {
          default: "0 1px 3px rgba(0, 0, 0, 0.1)",
          hover: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
      dark: {
        colors: {
          primary: "#1e1e1e",
          secondary: "#2a2a2a",
          warning: "#fbbd23",
          success: "#4caf50",
          error: "#f44336",
          info: "#2196f3",
          background: "#121212",
          foreground: "#fefefe",
          input: {
            DEFAULT: "#f2f2f2",
            background: "#333"
          },
          danger: "#f44336",
        },
        typography: {
          heading: "#ffffff",
          body: "#cccccc",
          link: "#fbbd23",
        },
        border: {
          default: "#2a2a2a",
          focus: "#fbbd23",
        },
        shadow: {
          default: "0 1px 3px rgba(0, 0, 0, 0.3)",
          hover: "0 4px 6px rgba(0, 0, 0, 0.4)",
        },
      },
    },
  })],
};

