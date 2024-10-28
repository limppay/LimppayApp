const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|avatar|calendar|date-input|progress|select|popover|divider|button|ripple|spinner|listbox|scroll-shadow).js"
  ],
  theme: {
    extend: {},
    colors: {
      prim: "#777777",
      sec: "#53B852",
      ter: "#555555",
      des: "#F58634",
      desSec: "#00AFEF",
      bord: "#CCCCCC",
      trans: "transparent",
      white: "white",
      error: "red"
    },
  },
  plugins: [nextui()]}