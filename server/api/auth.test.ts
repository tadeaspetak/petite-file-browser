import setCookieParser from "set-cookie-parser";
import supertest from "supertest";

import { Users } from "../data";
import { app } from "../server";
import { signIn } from "./testUtils";

const unauthed = supertest(app);
const authed = supertest.agent(app);

// TODO: move into global setup
beforeAll(async (done) => {
  await Users.seed([{ name: "John Doe", email: "john@petite.com", password: "a crazy one" }]);
  await signIn(authed);
  done();
});

it("fails to sign in", async (done) => {
  const response = await signIn(unauthed, "a wrong one");

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Invalid credentials.");

  done();
});

it("successfully signs in", async (done) => {
  const response = await signIn(unauthed);

  expect(response.status).toBe(200);

  const cookies = setCookieParser.parse(response.headers["set-cookie"]);
  const sessionId = cookies.find((c) => c.name === "sessionId");
  expect(sessionId?.value.length).toBe(64);
  expect(sessionId?.maxAge).toBe(86400);
  expect(sessionId?.httpOnly).toBe(true);
  const csrfId = cookies.find((c) => c.name === "csrfId");
  expect(csrfId?.value.length).toBe(64);
  expect(csrfId?.maxAge).toBe(86400);
  expect(csrfId?.httpOnly).toBe(undefined);

  done();
});

it("signs out", async (done) => {
  const localAgent = supertest.agent(app);

  const stillAuthed = await signIn(localAgent);
  expect(setCookieParser.parse(stillAuthed.headers["set-cookie"]).length).toBe(2);

  const nowUnauthed = await localAgent
    .post("/api/auth/sign-out")
    .set("Content-Type", "application/json");
  expect(setCookieParser.parse(nowUnauthed.headers["set-cookie"]).length).toBe(0);
  expect(nowUnauthed.status).toBe(200);

  done();
});
