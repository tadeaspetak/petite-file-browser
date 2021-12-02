import express from "express";

const validateContentType = (req: express.Request, res: express.Response) => {
  if (req.headers["Content-Type"] !== "application/json") {
    res.status(400).json({ message: "Invalid content type, please use `application/json`." });
  }
  return true;
};

const api = express.Router();
api.get("/healthz", (req, res) => {
  res.send({ message: "We're live 🚀" });
});
api.get("/contents", (req, res) => {
  res.send({ name: "my-directory" });
});

api.post("/sign-in", (req, res) => {
  if (!validateContentType(req, res)) return;

  // req.cookie['sessionId'] =
});

export { api };
