const fs = require("fs");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  devServer: {
    https: {
      key: fs.readFileSync("./server/tls/cert.key"),
      cert: fs.readFileSync("./server/tls/cert.pem"),
    },
    port: 8081,
  },
};
