const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://localhost:3000' // Assuming your Node server runs on port 3000
  }
})