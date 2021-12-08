import express from "express";
import fs from "fs";
import path from "path";

import { ApiBrowseRes, BrowserItem } from "../../src/common/types";
import { getHumanSize } from "../../src/common/utils";
import { Logger } from "../logger";

const basePath = path.join(__dirname, "../../");
const browseApi = express.Router();

const createItem = (name: string, stats: fs.Stats, items?: BrowserItem[]): BrowserItem => {
  const base = { createdAt: stats.birthtimeMs, updatedAt: stats.ctimeMs };
  return stats.isDirectory()
    ? { ...base, name, type: "dir", ...(items && { items }) }
    : { ...base, name, type: "file", sizeBytes: stats.size, sizeHuman: getHumanSize(stats.size) };
};

browseApi.get("/", (req, res) => {
  const raw = (req.query.path as string) || "/";
  if (typeof raw !== "string" || raw.indexOf("\0") > -1 || !/^[a-zA-Z0-9-_/.]+$/.test(raw)) {
    Logger.error("Invalid 'raw' path.", { user: req.user, basePath, rawPath: raw });
    return res.status(400).json({ message: "Invalid path." });
  }

  const normalized = path.normalize(raw).replace(/^(\/|\\)+/, "");
  const current = path.join(basePath, normalized);
  if (!current.startsWith(basePath)) {
    Logger.error("'Current' outside of 'basePath'.", { user: req.user, basePath, raw, normalized });
    return res.status(400).json({ message: "Invalid path." });
  }

  if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) {
    return res.status(404).json({ message: `Directory '${normalized}' not found.` });
  }

  try {
    const items: BrowserItem[] = [];
    const children = fs.readdirSync(current);
    for (const child of children) {
      items.push(createItem(child, fs.statSync(path.join(current, child))));
    }

    const response: ApiBrowseRes = {
      path: normalized,
      name: path.basename(current),
      items,
      isRoot: normalized === "",
    };
    res.send(response);
  } catch (e) {
    Logger.error("Cannot read path.", { user: req.user, basePath, rawPath: raw, current });
    res.status(500).json({ message: `Cannot read the folder at '${raw}'.` });
  }
});

export { browseApi };
