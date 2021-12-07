export function getRandomString(size: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < size; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

export function setCookie(name: string, value: string, expires: number) {
  document.cookie = `${name}=${value}; expires=${new Date(
    new Date().getTime() + expires,
  ).toUTCString()}; path=/`;
}

export function getCookie(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(`${name}=`) === 0) return cookie.substring(`${name}=`.length, cookie.length);
  }
  return null;
}

export const joinUrl = (...parts: string[]) => {
  return parts.join("/").replace(/\/+/gi, "/").replace(":/", "://").replace(/\/$/, "");
};

export const setOrDeleteParam = (params: URLSearchParams, name: string, value?: string) => {
  if (value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
  return params;
};

export const isMac = () => navigator.userAgent.toLowerCase().indexOf("mac") !== -1;

// a super simple replacement for the standard `classnames`
export const classNames = (...args: Array<string | { [key: string]: boolean }>): string =>
  args
    .reduce<string>((acc, arg) => {
      if (typeof arg === "object") {
        const [name, applicable] = Object.entries(arg)[0];
        if (applicable) acc += " " + name;
      } else {
        acc += " " + arg;
      }
      return acc;
    }, "")
    .replaceAll(/\s+/g, " ")
    .trim();
