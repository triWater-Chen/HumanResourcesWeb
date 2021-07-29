module.exports = {
    // 配置路径的统一前缀
    // 如 https://localhost: 8080/admin/，则设置 baseUrl 为 /admin/
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    //
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/': {
                target: 'http://localhost:7000',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/ws': {
                target: 'ws://localhost:7000',
                ws: true
            }
        }
    }
}