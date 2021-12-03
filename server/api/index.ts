import express from "express";

import { Sessions, Users } from "../models";
import { authApi } from "./auth";
import { browseApi } from "./browse";

const api = express.Router();

// enforce `application/json` content type on all api endpoints
api.use((req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).json({ message: "Invalid content type." });
  } else {
    next();
  }
});

api.use("/auth", authApi);
api.use(
  "/browse",
  // make sure the user is authenticated
  (req, res, next) => {
    const sessionId = req.cookies["sessionId"];
    const session = sessionId ? Sessions.findBySessionId(sessionId) : undefined;
    if (!session) return res.status(403).json({ message: "Unauthorized." });

    req.user = Users.findByEmail(session.userEmail);
    next();
  },
  browseApi,
);

export { api };
