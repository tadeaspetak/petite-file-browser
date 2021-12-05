import fs from "fs";
import https from "https";
import path from "path";

import { Users } from "./models";
import { app } from "./server";

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "./tls/cert.key")),
  cert: fs.readFileSync(path.join(__dirname, "./tls/cert.pem")),
};

const portHttps = process.env.PORT_HTTPS || 8080;
https.createServer(httpsOptions, app).listen(portHttps, async () => {
  await Users.seed([{ name: "Jane Doe", email: "jane@petite.com", password: "supersafe" }]);
  console.log(`HTTPS server listening at ${portHttps}`); // eslint-disable-line no-console
});
