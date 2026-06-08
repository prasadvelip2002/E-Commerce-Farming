import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        agri: {
          green: "#4A7C59",
          brown: "#6D4C41",
          cream: "#F9F6F0"
        }
      }
    },
  },
  plugins: [],
};
export default config;
