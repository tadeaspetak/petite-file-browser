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

it("fails to get path behind auth", async (done) => {
  const response = await unauthed
    .get("/api/browse/contents")
    .set("Content-Type", "application/json");

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Unauthorised.");

  done();
});

it("fetches contents", async (done) => {
  const response = await authed
    .get("/api/browse/contents?path=/design-document")
    .set("Content-Type", "application/json");

  expect(response.status).toBe(200);
  expect(response.body.contents).toBe("my-directory");

  done();
});
