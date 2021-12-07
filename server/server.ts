import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import path from "path";

import { api } from "./api";
import { Logger } from "./logger";
import { attachCsrfToken } from "./security";

const app = express();
// avoid having to manually tweak CSP, HSTS, X-Powered-By, MIME-sniffing, etc.
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: "'self'" } } }));
app.use(express.json());
app.use(cookieParser());

const client = path.resolve(__dirname, "../build");
if (fs.existsSync(client)) app.use(express.static(client));

app.get("/healthz", (_, res) => {
  res.send({ message: "We're live 🚀" });
});

app.use("/api", api);
app.use(async (req, res) => {
  if (!req.cookies["xCsrfToken"]) await attachCsrfToken(res);
  res.sendFile(path.join(client, "index.html"));
});

// keep this as the last middleware to prevent leaking error specifics
app.use(((err, req, res, next) => {
  Logger.error(err.stack);
  res.status(500).send("Something unexpected has broken, sorry for the inconvenience 💣");
}) as express.ErrorRequestHandler);

export { app };
