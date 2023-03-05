/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"gradient-start": "#B64FCD",
				"gradient-end": "#3C19A8",
			},
		},
	},
	plugins: [],
};
