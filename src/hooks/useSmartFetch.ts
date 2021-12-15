import { useCallback, useRef } from "react";

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
  const retriedCsrfToken = useRef(false);

  const request = useRef<Promise<any>>();

  // keep `useCallback`, used in other hooks
  const smartFetch = useCallback(
    async <T>(input: RequestInfo, init?: RequestInit): Promise<SmartFetchResult<T>> => {
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
          // eslint-disable-next-line no-console
          console.log("throwing away response to a stale request", {
            fetching,
            req: request.current,
            res: response,
          });
          return { status: "stale", response };
        }

        switch (response.status) {
          case 200:
            return { status: "ok", response, parsed: (await response.json()) as T };
          case 400:
            // often, this implies the CSRF cookie must have expired, let's try once more
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
            return { status: "forbidden", response };
          default:
            console.log("Unexpected status.", response); // eslint-disable-line no-console
            return { status: "unknown", response };
        }
      } catch (e) {
        return { status: "network", error: e };
      }
    },
    [],
  );

  return { smartFetch };
};
