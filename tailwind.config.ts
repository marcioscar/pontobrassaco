import type { Config } from "tailwindcss";

export default {
//   content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
