import React, { ReactNode, useCallback, useContext, useState } from "react";

import { getRandomString } from "../utils";

export type ToastType = "info" | "success" | "error";
export interface Toast {
  id: string;
  body: string;
  type: ToastType;
  hideIn: number;
}
interface ToastOptions {
  id?: string;
  hideIn?: number;
}

type ToastContextType = {
  toasts: Toast[];
  toast: (body: string, type: ToastType, options?: ToastOptions) => void;
  untoast: (id: string) => void;
};

export const ToastContext = React.createContext<ToastContextType>(null!);

const rm = (toasts: Toast[], id: string) => {
  const index = toasts.findIndex((n) => n.id === id);
  if (index < 0) return toasts;

  const next = [...toasts];
  next.splice(index, 1);
  return next;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const untoast = useCallback((id: string) => setToasts(rm(toasts, id)), [toasts]);

  const toast = useCallback(
    (body: string, type: ToastType, { id, hideIn = 5000 }: ToastOptions = {}) => {
      const next = id ? rm(toasts, id) : toasts;
      setToasts([...next, { id: id || getRandomString(6), body, type, hideIn }]);
    },
    [toasts],
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, untoast }}>{children}</ToastContext.Provider>
  );
};

export function useToasts() {
  return useContext(ToastContext);
}
