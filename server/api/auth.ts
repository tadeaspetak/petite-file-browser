import express from "express";

import { Sessions, Users } from "../data";
import { generateToken } from "../security";
import { validateContentType } from "./utils";

const authApi = express.Router();

authApi.post("/sign-in", async (req, res) => {
  if (!validateContentType(req, res)) return;

  const params: { email: string; password: string } = req.body;
  if (!params.email || !params.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = Users.findByEmail(params.email);
  if (!user || !Users.verifyPassword(params.password, user)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const sessionId = await generateToken();
  const csrfId = await generateToken();

  res.cookie("sessionId", sessionId, { httpOnly: true, maxAge: 1000 * 3600 * 24, sameSite: "lax" });
  res.cookie("csrfId", csrfId, { httpOnly: false, maxAge: 1000 * 3600 * 24, sameSite: "lax" });
  Sessions.add({ csrfId, sessionId, userEmail: user.email });

  res.status(200).json({ message: "Signed in." });
});

authApi.post("/sign-out", async (req, res) => {
  if (!validateContentType(req, res)) return;

  const sessionId = req.cookies["sessionId"];
  if (sessionId) Sessions.remove(sessionId);

  res.status(200).json({ message: "Signed out." });
});

export { authApi };
