import { useCallback, useRef } from "react";

import { useAuth, useToasts } from "../providers";
import { getCookie } from "../utils";

interface ErrorNetwork {
  status: "network";
  error: any;
}

interface ErrorGeneral {
  status: "unauthorized" | "forbidden" | "network" | "stale" | "unknown";
  response: Response;
}

interface Success<T> {
  status: "ok";
  response: Response;
  parsed: T;
}

export type SmartFetchResult<T> = ErrorGeneral | ErrorNetwork | Success<T>;

export const useSmartFetch = () => {
  return useSmartFetchUnauthed(useAuth().signOut);
};

export const useSmartFetchUnauthed = (signOut?: () => Promise<SmartFetchResult<void>>) => {
  const { toast } = useToasts();
  const retriedCsrfToken = useRef(false);

  const request = useRef<Promise<any>>();

  const notifyUnknown = useCallback(() => {
    toast("There has been an unexpected error. Please, try again in a short while.", "error");
  }, [toast]);

  const smartFetch = useCallback(
    async <T>(
      input: RequestInfo,
      init?: RequestInit,
      {
        handleNetwork = true,
        handleUnknown = true,
      }: { handleNetwork?: boolean; handleUnknown?: boolean } = {},
    ): Promise<SmartFetchResult<T>> => {
      try {
        const fetching = fetch(input, {
          headers: {
            "content-type": "application/json",
            "x-csrf-token": getCookie("xCsrfToken") ?? "",
          },
          ...init,
        });
        request.current = fetching;
        const response = await fetching;

        if (request.current !== fetching) {
          console.log("throwing away a stale request"); // eslint-disable-line no-console
          return { status: "stale", response };
        }

        switch (response.status) {
          case 200:
            return { status: "ok", response, parsed: (await response.json()) as T };
          case 400:
            // often, this implies the CSRF cookie must has expired, let's try once more
            if (!retriedCsrfToken.current) {
              console.log("retrying CSRF..."); // eslint-disable-line no-console
              retriedCsrfToken.current = true;
              return smartFetch(input, init);
            }
            console.error("CSRF token unsuccessful on a retry, should be impossible?", response); // eslint-disable-line no-console
            return { status: "unknown", response };
          case 401:
            return { status: "unauthorized", response };
          case 403:
            if (signOut) {
              toast("You've been signed out, please sign in again.", "error", { id: "sign-in" });
              await signOut();
            }
            return { status: "forbidden", response };
          default:
            console.error("Unexpected status.", response); // eslint-disable-line no-console
            if (handleUnknown) notifyUnknown();
            return { status: "unknown", response };
        }
      } catch (e) {
        if (handleNetwork) {
          toast(
            "We couldn't connect to the server. Please, check your connection, or try again in a short while.",
            "error",
          );
        }
        return { status: "network", error: e };
      }
    },
    [signOut, toast, notifyUnknown],
  );

  return { smartFetch, notifyUnknown };
};
