import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

import { api } from "./api";

const env = process.env.NODE_ENV || "dev";

const app = express();
app.use(express.json());
app.use("/api", api);

const client = path.resolve(__dirname, "../build");
if (fs.existsSync(client)) app.use(express.static(client));

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "./tls/cert.key")),
  cert: fs.readFileSync(path.join(__dirname, "./tls/cert.pem")),
};

const portHttps = process.env.PORT_HTTPS || 8080;
https.createServer(httpsOptions, app).listen(portHttps, () => {
  console.log(`HTTPS server listening at ${portHttps}`); // eslint-disable-line no-console
});

// hot reload doesn't seem to work with `HTTPS=true` enabled, let's create an HTTP server for dev purposes
if (env === "dev") {
  const portHttp = process.env.PORT_HTTP || 3001;
  http.createServer(app).listen(portHttp, () => {
    console.log(`HTTP server listening at ${portHttp}`); // eslint-disable-line no-console
  });
}
