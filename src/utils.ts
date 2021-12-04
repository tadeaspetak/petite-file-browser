import { useEffect, useLayoutEffect, useRef } from "react";

export function getRandomString(size: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < size; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

export function useTimeout(callback: () => void, delay?: number) {
  const savedCallback = useRef(callback);

  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === "undefined") return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
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
