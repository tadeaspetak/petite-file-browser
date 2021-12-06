import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { ApiSessionReq, ApiSessionRes } from "../../common/types";
import { getCookie } from "../utils";

export enum AuthResult {
  INVALID_DOUBLE_SUBMIT,
  INVALID_CREDENTIALS,
  SUCCESS,
  UNKNOWN_ERROR,
  NETWORK_ERROR,
}

type User = ApiSessionRes;

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  user?: User;
}

let AuthContext = React.createContext<AuthContextType>(null!);

const getPersistedUser = () => localStorage.getItem("user");
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | undefined>();
  const retriedDoubleSubmit = useRef(false);

  useEffect(() => {
    const user = getPersistedUser();
    if (user) setUser(JSON.parse(user));
  }, []);

  const isAuthenticated = useMemo(() => {
    return user || getPersistedUser() ? true : false; // components mount faster than the hook above evaluates
  }, [user]);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const params: ApiSessionReq = {
        email,
        password,
        doubleSubmit: getCookie("doubleSubmit") ?? "",
      };

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(params),
      });

      switch (response.status) {
        case 400:
          // implies the double submit cookie must have expired, let's try once more
          if (!retriedDoubleSubmit.current) {
            console.log("retrying double submit..."); // eslint-disable-line no-console
            retriedDoubleSubmit.current = true;
            return signIn(email, password);
          }
          console.error("Double submit unsuccessful on a retry, should be impossible?", response); // eslint-disable-line no-console
          return AuthResult.UNKNOWN_ERROR;
        case 401:
          return AuthResult.INVALID_CREDENTIALS;
        case 200:
          const json: ApiSessionRes = await response.json();

          retriedDoubleSubmit.current = false;
          localStorage.setItem("user", JSON.stringify(json));
          setUser(json);

          return AuthResult.SUCCESS;
        default:
          console.error(response); // eslint-disable-line no-console
          return AuthResult.UNKNOWN_ERROR;
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      return AuthResult.NETWORK_ERROR;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });

      localStorage.removeItem("user");
      setUser(undefined);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(AuthContext);
}
