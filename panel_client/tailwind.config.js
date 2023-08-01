/** @type {import('tailwindcss').Config} */
export default {
  content: [
	"./index.html",
	"./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
		colors: {
			'neon-green': '#3fb980',
			'off-green': '#009489',
		},
	},
  },
  plugins: [],
}

