module.exports = {
  lintOnSave: false,
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
        '/': {
            target: 'http://47.106.83.53:3000/api/',
            ws: true,
            changeOrigin: true
        }
    }
  }
}
