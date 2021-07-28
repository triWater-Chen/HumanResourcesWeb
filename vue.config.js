module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/': {
                target: process.env.VUE_APP_SERVER,
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/ws': {
                target: process.env.VUE_APP_WS_SERVER,
                ws: true
            }
        }
    }
}