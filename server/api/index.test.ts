import supertest from "supertest";

import { app } from "../server";
const request = supertest(app);

it("gets the test endpoint", async (done) => {
  const response = await request.get("/api/contents");

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("pass!");
  done();
});
