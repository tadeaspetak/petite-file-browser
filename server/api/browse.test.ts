import supertest from "supertest";

import { BrowserDirectory, BrowserFile, BrowserItem } from "../../common/types";
import { app } from "../server";
import { seedUsers, signIn } from "../testUtils";

const unauthed = supertest(app);
const authed = supertest.agent(app);

const createDirItem = (name: string, items?: BrowserItem[]): BrowserDirectory => {
  return { name, type: "dir", ...(items && { items }) };
};
const createFileItem = (name: string, sizeBytes: number, sizeHuman: string): BrowserFile => {
  return { name, type: "file", sizeBytes, sizeHuman };
};

beforeAll(async (done) => {
  await seedUsers();
  await signIn(authed);
  done();
});

it("fails to get path behind auth when unauthed", async (done) => {
  const response = await unauthed.get("/api/browse").set("Content-Type", "application/json");

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Unauthorized.");

  done();
});

it("fetches contents", async (done) => {
  const response = await authed
    .get("/api/browse?path=/design-document")
    .set("Content-Type", "application/json");

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual({
    path: "design-document",
    name: "design-document",
    items: [createDirItem("assets"), createFileItem("design-document.md", 8834, "8.63 KB")],
  });

  done();
});

it("fails to fetch contents of an invalid path", async (done) => {
  const response = await authed
    .get("/api/browse?path=../evil-stuff")
    .set("Content-Type", "application/json");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid path.");

  done();
});

it("fails to fetch contents of a non-existing path", async (done) => {
  const response = await authed
    .get("/api/browse?path=/asdf")
    .set("Content-Type", "application/json");

  expect(response.status).toBe(500);
  expect(response.body.message).toBe("Cannot read the folder at '/asdf'.");

  done();
});
