const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/", {
            // target: "http://192.168.0.2:5601/",
            // target: "http://10.29.239.11:5601/",
            target: "http://127.0.0.1:5601/",
            changeOrigin: true
        })
    );
};
