import express from "express";

import { Sessions, Users } from "../models";
import { generateToken } from "../security";

const authApi = express.Router();

authApi.post("/sign-in-token", async (req, res) => {
  const signInToken = await generateToken();
  res.cookie("signInToken", signInToken, { maxAge: 1000 * 3600, sameSite: "strict" });
  res.status(200).json({ message: "Token generated." });
});

authApi.post("/sign-in", async (req, res) => {
  const params: { email: string; password: string; signInToken: string } = req.body;

  if (!params.signInToken || params.signInToken !== req.cookies["signInToken"]) {
    return res.status(401).json({ message: "Invalid sign in token." });
  }

  const user = Users.findByEmail(params.email);
  if (!user || !Users.verifyPassword(params.password, user)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const sessionId = await generateToken();
  const csrfId = await generateToken();

  res.clearCookie("signInToken");
  res.cookie("sessionId", sessionId, { httpOnly: true, maxAge: 1000 * 3600 * 24, sameSite: "lax" });
  res.cookie("csrfId", csrfId, { httpOnly: false, maxAge: 1000 * 3600 * 24, sameSite: "strict" });
  Sessions.add({ csrfId, sessionId, userEmail: user.email });

  res.status(200).json({ message: "Signed in." });
});

authApi.post("/sign-out", async (req, res) => {
  if (req.cookies["sessionId"]) Sessions.remove(req.cookies["sessionId"]);

  res.clearCookie("sessionId");
  res.clearCookie("csrfId");

  res.status(200).json({ message: "Signed out." });
});

export { authApi };
