export interface BrowserFile {
  name: string;
  type: "file";
  sizeBytes: number;
  sizeHuman: string;
}

export interface BrowserDirectory {
  name: string;
  type: "dir";
  items?: BrowserItem[];
}

export type BrowserItem = BrowserFile | BrowserDirectory;
