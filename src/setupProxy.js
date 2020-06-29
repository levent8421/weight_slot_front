const proxy = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        proxy("/api/", {
            target: "http://10.29.239.11:5601/",
            changeOrigin: true
        })
    );
};
