import React, { useEffect, useMemo } from "react";

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
  let [user, setUser] = React.useState<User | undefined>();

  useEffect(() => {
    const user = getPersistedUser();
    if (user) setUser(JSON.parse(user));
  }, []);

  const isAuthenticated = useMemo(() => {
    return user || getPersistedUser() ? true : false; // components mount faster than the hook above evaluates
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const doubleSubmit = getCookie("doubleSubmit") ?? "";

      // // fake in dev
      // if (!doubleSubmit) {
      //   doubleSubmit = "fakeDoubleSubmit";
      //   setCookie("doubleSubmit", doubleSubmit + "d", 60 * 60 * 1000);
      // }

      const params: ApiSessionReq = { email, password, doubleSubmit };

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(params),
      });

      switch (response.status) {
        case 400:
          return AuthResult.INVALID_DOUBLE_SUBMIT;
        case 401:
          return AuthResult.INVALID_CREDENTIALS;
        case 200:
          const json: ApiSessionRes = await response.json();

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
  };

  const signOut = async () => {
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
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(AuthContext);
}
