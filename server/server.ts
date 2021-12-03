import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import path from "path";

import { api } from "./api";
import { generateToken } from "./security";

const app = express();
app.disable("x-powered-by"); // hide info about what's powering the backend
app.use(express.json());
app.use(cookieParser());

const client = path.resolve(__dirname, "../build");
if (fs.existsSync(client))
  app.use(async (req, res, next) => {
    if (req.url === "/index.html" && !req.cookies["doubleSubmit"]) {
      const doubleSubmit = await generateToken();
      res.cookie("doubleSubmit", doubleSubmit, { maxAge: 1000 * 3600, sameSite: "strict" });
    }
    next();
  }, express.static(client));

app.get("/healthz", (_, res) => {
  res.send({ message: "We're live 🚀" });
});

app.use("/api", api);

// keep this as the last middleware to prevent leaking error specifics
app.use(((err, req, res, next) => {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).send("Something unexpected has broken, sorry for the inconvenience 💣");
}) as express.ErrorRequestHandler);

export { app };
