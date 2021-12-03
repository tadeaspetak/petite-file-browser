export const getHumanSize = (sizeInBytes: number): string => {
  const factor = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const size = (sizeInBytes / Math.pow(1024, factor)).toFixed(2);
  const units = ["B", "KB", "MB", "GB", "TB"][factor];
  return `${size} ${units}`;
};
