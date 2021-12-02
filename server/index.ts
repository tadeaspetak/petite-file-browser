import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

import { Users } from "./data";
import { app } from "./server";

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "./tls/cert.key")),
  cert: fs.readFileSync(path.join(__dirname, "./tls/cert.pem")),
};

const portHttps = process.env.PORT_HTTPS || 8080;
https.createServer(httpsOptions, app).listen(portHttps, async () => {
  await Users.seed([{ name: "Jane Doe", email: "jane@petite.com", password: "a safe one" }]);
  console.log({ users: Users.findAll() });
  console.log(`HTTPS server listening at ${portHttps}`); // eslint-disable-line no-console
});

// hot reload doesn't seem to work with `HTTPS=true` enabled, let's create an HTTP server for dev purposes
if ((process.env.NODE_ENV || "development") === "development") {
  const portHttp = process.env.PORT_HTTP || 3001;
  http.createServer(app).listen(portHttp, () => {
    console.log(`HTTP server listening at ${portHttp}`); // eslint-disable-line no-console
  });
}
