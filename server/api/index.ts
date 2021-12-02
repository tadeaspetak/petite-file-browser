import express from "express";

const api = express.Router();
api.get("/healthz", (req, res) => {
  res.send({ message: "We're live 🚀" });
});
api.get("/contents", (req, res) => {
  res.send({ name: "my-directory" });
});

export { api };
