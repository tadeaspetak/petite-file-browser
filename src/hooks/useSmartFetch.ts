import { useCallback } from "react";

import { useAuth, useToasts } from "../providers";

export const useSmartFetch = () => {
  const { signOut } = useAuth();
  const { toast } = useToasts();

  const smartFetch = useCallback(
    async (input: RequestInfo, init?: RequestInit | undefined): Promise<any> => {
      try {
        const response = await fetch(input, {
          headers: { "content-type": "application/json" },
          ...init,
        });

        switch (response.status) {
          case 200:
            return await response.json();
          case 403:
            toast("You've been signed out, please sign in again.", "error");
            await signOut();
            throw new Error("Unauthorized.");
          default:
            console.error("Unexpected status.", response); // eslint-disable-line no-console
            throw new Error("Unexpected status.");
        }
      } catch (e) {
        throw e;
      }
    },
    [signOut, toast],
  );

  return { smartFetch };
};
