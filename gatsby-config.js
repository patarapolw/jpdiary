const themeConfig = require('./theme-config.json')

module.exports = {
  siteMetadata: themeConfig,
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion'
  ]
}
