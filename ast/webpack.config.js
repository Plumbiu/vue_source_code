const path = require('path')

module.exports = {
  mode: 'development',
  entry: '/src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './www'),
    },
    devMiddleware: {
      publicPath: '/xuni/'
    },
    compress: false,
    port: 9000,
  }
}