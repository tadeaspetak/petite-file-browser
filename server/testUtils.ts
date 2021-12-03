import setCookieParser from "set-cookie-parser";
import supertest from "supertest";

import { Users } from "./models";

export const fakeUserPassword = "a crazy one";
export const parseCookies = (response: supertest.Response) => {
  return setCookieParser
    .parse(response.headers["set-cookie"])
    .filter((c) => (c.expires?.getTime() ?? 0) !== 0); // instead of clearing cookies, `res.clearCookies` sometimes just expires them (https://github.com/expressjs/express/issues/691#issuecomment-385054381)
};

export const seedUsers = () =>
  Users.seed([{ name: "John Doe", email: "john@petite.com", password: fakeUserPassword }]);

export const signIn = async (
  request: supertest.SuperTest<supertest.Test> | supertest.SuperAgentTest,
  password = fakeUserPassword,
) => {
  const response = await request
    .post("/api/auth/sign-in-token")
    .set("Content-Type", "application/json");

  const signInToken = parseCookies(response).find((c) => c.name === "signInToken")?.value;
  expect(signInToken).toBeDefined();

  return request
    .post("/api/auth/sign-in")
    .send({ email: "john@petite.com", password, signInToken })
    .set("Cookie", `signInToken=${signInToken}`)
    .set("Content-Type", "application/json");
};
