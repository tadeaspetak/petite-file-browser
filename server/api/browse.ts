import express from "express";
import fs from "fs";
import path from "path";

import { validateContentType } from "./utils";

interface Item {
  name: string;
  sizeKb: number | undefined;
  type: "file" | "folder";
  items?: undefined | Item[];
}

const root = path.join(__dirname, "../../");
const browseApi = express.Router();

browseApi.get("/contents", (req, res) => {
  if (!validateContentType(req, res)) return;

  if (req.query.path && typeof req.query.path !== "string") {
    return res.status(400).json({ message: "Invalid path." });
  }

  const rawPath = (req.query.path as string) || "/";
  const normalizedPath = path.normalize(rawPath);

  if (normalizedPath.startsWith(".")) {
    return res.status(400).json({ message: "Invalid path." });
  }

  const items: Item[] = [];

  const parent = path.join(root, normalizedPath);
  const parentStats = fs.statSync(parent);

  const children = fs.readdirSync(parent);
  for (const child of children) {
    const stats = fs.statSync(path.join(parent, child));
    items.push({
      name: child,
      sizeKb: stats.size, // TODO: make into Kb
      type: stats.size === 0 ? "folder" : "file", // TODO there's gotta be a better way;
    });
  }
  res.send({
    contents: {
      name: path.basename(parent),
      sizeKb: parentStats.size, // TODO kb,
      type: parentStats.size === 0 ? "folder" : "file", // TODO there's gotta be a better way;
      items,
    },
  });
});

export { browseApi };
