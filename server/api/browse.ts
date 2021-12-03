import express from "express";
import fs from "fs";
import path from "path";

import { BrowserItem } from "../../common/types";
import { getHumanSize } from "../../common/utils";

const basePath = path.join(__dirname, "../../");
const browseApi = express.Router();

const createItem = (name: string, stats: fs.Stats, items?: BrowserItem[]): BrowserItem => {
  const isDirectory = stats.isDirectory();
  return {
    name,
    sizeBytes: isDirectory ? undefined : stats.size,
    sizeHuman: isDirectory ? undefined : getHumanSize(stats.size),
    type: isDirectory ? "dir" : "file",
    ...(items && { items }),
  };
};

browseApi.get("/", (req, res) => {
  const rawPath = (req.query.path as string) || "/";
  if (
    typeof rawPath !== "string" ||
    rawPath.indexOf("\0") > -1 ||
    !/^[a-zA-Z0-9-_/.]+$/.test(rawPath)
  ) {
    return res.status(400).json({ message: "Invalid path." });
  }

  const current = path.join(basePath, path.normalize(rawPath));
  if (!current.startsWith(basePath)) {
    return res.status(400).json({ message: "Invalid path." });
  }

  const items: BrowserItem[] = [];

  try {
    const children = fs.readdirSync(current);
    for (const child of children) {
      items.push(createItem(child, fs.statSync(path.join(current, child))));
    }
    res.send({ items: createItem(path.basename(current), fs.statSync(current), items) });
  } catch (e) {
    res.status(500).json({ message: `Cannot read the folder at '${rawPath}'.` });
  }
});

export { browseApi };
