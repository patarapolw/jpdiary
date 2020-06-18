module.exports = {
  prefix: 'tw-',
  purge: {
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}'
    ]
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
