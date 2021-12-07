import crypto from "crypto";
import express from "express";

import { ApiSessionReq, ApiSessionRes } from "../../common/types";
import { Sessions, Users } from "../models";
import { attachCsrfToken, generateToken } from "../security";

const authApi = express.Router();

authApi.post("/session", async (req, res) => {
  const params: ApiSessionReq = req.body;

  if (!req.headers["x-csrf-token"] || req.headers["x-csrf-token"] !== req.cookies["xCsrfToken"]) {
    await attachCsrfToken(res); // reattach since the only reasonable explanation is that the CSRF cookie has expired
    return res.status(400).json({ message: "Invalid CSRF token." });
  }

  const user = Users.findByEmail(params.email);
  if (!user || !Users.verifyPassword(params.password, user)) {
    await new Promise((resolve) => setTimeout(resolve, crypto.randomInt(11, 111))); // mitigate timing attacks
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const sessionId = await generateToken();

  res.cookie("sessionId", sessionId, { httpOnly: true, maxAge: 1000 * 3600 * 24, sameSite: "lax" });
  Sessions.add({ sessionId, userEmail: user.email });

  const response: ApiSessionRes = { email: user.email, name: user.name };
  res.status(200).json(response);
});

authApi.delete("/session", async (req, res) => {
  if (req.cookies["sessionId"]) Sessions.remove(req.cookies["sessionId"]);

  res.clearCookie("sessionId");

  res.status(200).json({ message: "Signed out." });
});

export { authApi };
