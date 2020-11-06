const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/", {
            // target: "http://10.239.239.82:5601/",
            // target: "http://127.0.0.1:5601/",
            target: "http://192.168.3.2:5601/",
            changeOrigin: true
        })
    );
};
