import fs from "fs";
import path from "path";
import supertest from "supertest";

import { createDirItem, createFileItem } from "../../src/common/testUtils";
import { app } from "../server";
import { seedUsers, signIn } from "../testUtils";

const unauthed = supertest(app);
const authed = supertest.agent(app);

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
  const documentStats = fs.statSync(
    path.join(__dirname, "../../design-document/design-document.md"),
  );
  const assetsStats = fs.statSync(path.join(__dirname, "../../design-document/assets"));

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual({
    isRoot: false,
    path: "design-document",
    name: "design-document",
    items: [
      createDirItem("assets", assetsStats.birthtimeMs, assetsStats.ctimeMs),
      createFileItem(
        "design-document.md",
        8834,
        "9 KB",
        documentStats.birthtimeMs,
        documentStats.ctimeMs,
      ),
    ],
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

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("Directory 'asdf' not found.");

  done();
});

it("fails to fetch contents of a file", async (done) => {
  const file = "design-document/design-document.md";
  const response = await authed
    .get(`/api/browse?path=/${file}`)
    .set("Content-Type", "application/json");

  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Directory '${path.normalize(file)}' not found.`);

  done();
});
