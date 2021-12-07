import supertest from "supertest";

import { app } from "../server";
import { fakeUserPassword, parseCookies, seedUsers, signIn } from "../testUtils";

const unauthed = supertest(app);
const authed = supertest.agent(app);

beforeAll(async (done) => {
  await seedUsers();
  await signIn(authed);
  done();
});

it("receives an csrf token", async (done) => {
  const response = await unauthed.get("/browse");

  const xCsrfToken = parseCookies(response).find((c) => c.name === "xCsrfToken");
  expect(xCsrfToken?.value.length).toBe(64);
  expect(xCsrfToken?.sameSite?.toLowerCase()).toBe("strict");

  done();
});

it("fails to sign in without a CSRF token", async (done) => {
  const response = await unauthed
    .post("/api/auth/session")
    .send({ email: "john@petite.com", password: fakeUserPassword })
    .set("Content-Type", "application/json");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid CSRF token.");

  done();
});

it("fails to sign in with an invalid CSRF token", async (done) => {
  const response = await unauthed
    .post("/api/auth/session")
    .send({ email: "john@petite.com", password: fakeUserPassword })
    .set({ "Content-Type": "application/json", "x-csrf-token": "something" })
    .set("Cookie", [`xCsrfToken=somethingelse`]);

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid CSRF token.");

  done();
});

it("fails to sign in with an incorrect password", async (done) => {
  const response = await signIn(unauthed, "an incorrect one");

  expect(response.status).toBe(401);
  expect(response.body.message).toBe("Invalid credentials.");

  done();
});

it("successfully signs in", async (done) => {
  const response = await signIn(unauthed);

  expect(response.status).toBe(200);

  const cookies = parseCookies(response);
  const sessionId = cookies.find((c) => c.name === "sessionId");
  expect(sessionId?.value.length).toBe(64);
  expect(sessionId?.maxAge).toBe(86400);
  expect(sessionId?.httpOnly).toBe(true);
  expect(sessionId?.sameSite?.toLowerCase()).toBe("lax");

  done();
});

it("signs out", async (done) => {
  const localAgent = supertest.agent(app);
  const stillAuthed = await signIn(localAgent);
  expect(parseCookies(stillAuthed).find((c) => c.name === "sessionId")).toBeDefined();

  const nowUnauthed = await localAgent
    .delete("/api/auth/session")
    .set("Content-Type", "application/json");
  expect(parseCookies(nowUnauthed).length).toBe(0);
  expect(nowUnauthed.status).toBe(200);

  done();
});
