import express from "express";

import { authApi } from "./auth";
import { browseApi } from "./browse";
import { isAuthed } from "./utils";

const api = express.Router();

api.get("/healthz/*", (req, res) => {
  console.log({ params: req.params });
  res.send({ message: "We're live 🚀" });
});

api.use("/auth", authApi);
api.use("/browse", isAuthed, browseApi);

export { api };
