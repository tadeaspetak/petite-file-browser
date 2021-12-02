// note: would love for the `req` to be typed, but `supertest` doesn't expose its types 🤦
export const signIn = async (request: any, password = "a crazy one") =>
  request
    .post("/api/auth/sign-in")
    .send({ email: "john@petite.com", password })
    .set("Content-Type", "application/json");
