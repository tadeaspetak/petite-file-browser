import express from "express";
import fs from "fs";
import path from "path";

import { BrowserItem } from "../../common/types";
import { getHumanSize } from "../../common/utils";
import { Logger } from "../logger";

const basePath = path.join(__dirname, "../../");
const browseApi = express.Router();

const createItem = (name: string, stats: fs.Stats, items?: BrowserItem[]): BrowserItem => {
  return stats.isDirectory()
    ? { name, type: "dir", ...(items && { items }) }
    : { name, type: "file", sizeBytes: stats.size, sizeHuman: getHumanSize(stats.size) };
};

browseApi.get("/", (req, res) => {
  const rawPath = (req.query.path as string) || "/";
  if (
    typeof rawPath !== "string" ||
    rawPath.indexOf("\0") > -1 ||
    !/^[a-zA-Z0-9-_/.]+$/.test(rawPath)
  ) {
    Logger.error("Invalid 'rawPath'.", { user: req.user, basePath, rawPath });
    return res.status(400).json({ message: "Invalid path." });
  }

  const current = path.join(basePath, path.normalize(rawPath));
  if (!current.startsWith(basePath)) {
    Logger.error("'Current' outside of 'basePath'.", { user: req.user, basePath, rawPath });
    return res.status(400).json({ message: "Invalid path." });
  }

  try {
    const items: BrowserItem[] = [];
    const children = fs.readdirSync(current);
    for (const child of children) {
      items.push(createItem(child, fs.statSync(path.join(current, child))));
    }
    res.send({ items: createItem(path.basename(current), fs.statSync(current), items) });
  } catch (e) {
    Logger.error("Cannot read path.", { user: req.user, basePath, rawPath, current });
    res.status(500).json({ message: `Cannot read the folder at '${rawPath}'.` });
  }
});

export { browseApi };
