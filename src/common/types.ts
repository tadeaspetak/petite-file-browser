interface BrowserItemBase {
  createdAt: number;
  updatedAt: number;
}

export interface BrowserFile extends BrowserItemBase {
  name: string;
  type: "file";
  sizeBytes: number;
  sizeHuman: string;
}

export interface BrowserDirectory extends BrowserItemBase {
  name: string;
  type: "dir";
  items?: BrowserItem[];
}

export type BrowserItem = BrowserFile | BrowserDirectory;

export interface ApiSessionReq {
  email: string;
  password: string;
}

export interface ApiSessionRes {
  email: string;
  name: string;
}

export interface ApiBrowseRes {
  isRoot: boolean;
  path: string;
  name: string;
  items: BrowserItem[];
}
