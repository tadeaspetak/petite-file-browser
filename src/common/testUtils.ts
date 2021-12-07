import { BrowserDirectory, BrowserFile, BrowserItem } from "./types";

export const createDirItem = (
  name: string,
  createdAt?: number,
  updatedAt?: number,
  items?: BrowserItem[],
): BrowserDirectory => {
  return {
    name,
    type: "dir",
    createdAt: createdAt ?? 0,
    updatedAt: updatedAt ?? 0,
    ...(items && { items }),
  };
};
export const createFileItem = (
  name: string,
  sizeBytes: number,
  sizeHuman: string,
  createdAt?: number,
  updatedAt?: number,
): BrowserFile => {
  return {
    name,
    type: "file",
    createdAt: createdAt ?? 0,
    updatedAt: updatedAt ?? 0,
    sizeBytes,
    sizeHuman,
  };
};
