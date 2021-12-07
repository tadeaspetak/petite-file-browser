import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { ApiSessionReq, ApiSessionRes } from "../../src/common/types";
import { SmartFetchResult, useSmartFetchUnauthed } from "../hooks";

type User = ApiSessionRes;

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<SmartFetchResult<User>>;
  signOut: () => Promise<SmartFetchResult<void>>;
  user?: User;
}

const AuthContext = React.createContext<AuthContextType>(null!);

const getPersistedUser = () => localStorage.getItem("user");
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | undefined>();
  const retriedCsrfToken = useRef(false);

  const { smartFetch } = useSmartFetchUnauthed();

  useEffect(() => {
    const user = getPersistedUser();
    if (user) setUser(JSON.parse(user));
  }, []);

  const isAuthenticated = useMemo(() => {
    return user || getPersistedUser() ? true : false; // components mount faster than the hook above evaluates
  }, [user]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SmartFetchResult<User>> => {
      const params: ApiSessionReq = { email, password };

      const result = await smartFetch<ApiSessionRes>("/api/auth/session", {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (result.status === "ok") {
        retriedCsrfToken.current = false;
        localStorage.setItem("user", JSON.stringify(result.parsed));
        setUser(result.parsed);
      }

      return result;
    },
    [smartFetch],
  );

  const signOut = useCallback(async () => {
    const response = await smartFetch<void>("/api/auth/session", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });

    if (response.status === "ok") {
      localStorage.removeItem("user");
      setUser(undefined);
    }

    return response;
  }, [smartFetch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(AuthContext);
}
