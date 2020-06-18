module.exports = {
  prefix: 'tw-',
  purge: [
    './components/**/*.tsx',
    './components/**/*.jsx',
    './pages/**/*.tsx',
    './pages/**/*.jsx'
  ],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
