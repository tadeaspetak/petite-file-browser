export const getHumanSize = (sizeInBytes: number): string => {
  const factor = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const size = Math.round(sizeInBytes / Math.pow(1024, factor));
  const units = ["B", "KB", "MB", "GB", "TB"][factor];
  return `${size} ${units}`;
};
