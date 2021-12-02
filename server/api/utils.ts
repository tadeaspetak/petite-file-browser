import express from "express";

import { Sessions } from "../data";

export const validateContentType = (req: express.Request, res: express.Response) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).json({ message: "Invalid content type, please use `application/json`." });
    return false;
  }
  return true;
};

export const isAuthed = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const sessionId = req.cookies["sessionId"];

  if (!sessionId || !Sessions.findBySessionId(sessionId)) {
    res.status(403).json({ message: "Unauthorised." });
    return;
  }

  next();
};
