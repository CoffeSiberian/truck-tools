// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./node_modules/@heroui/theme/dist/components/(alert|avatar|button|card|checkbox|chip|divider|dropdown|image|input|modal|progress|radio|select|skeleton|slider|spinner|toggle|tabs|ripple|form|menu|popover|listbox|scroll-shadow).js",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [heroui()],
};
