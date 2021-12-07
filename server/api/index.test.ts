import supertest from "supertest";

import { app } from "../server";

const unauthed = supertest(app);

it("fails to reach an endpoint due to invalid content-type header", async (done) => {
  const response = await unauthed.post("/api/auth/session");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid content type.");

  done();
});
