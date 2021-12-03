export interface BrowserItem {
  name: string;
  sizeBytes?: number;
  sizeHuman?: string;
  type: "file" | "dir";
  items?: BrowserItem[];
}
