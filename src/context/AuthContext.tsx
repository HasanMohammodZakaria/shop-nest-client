"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Instead of 3 separate useState calls (user, token, isLoading),
  // we combine them into ONE state object. This way, the useEffect
  // below only needs ONE setState call instead of three — avoiding
  // the "cascading renders" warning.
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  // Guard against corrupted/invalid localStorage data (e.g. the literal
  // string "undefined", or malformed JSON from an older bug) — without
  // this check, JSON.parse() would crash the whole app on load.
  if (savedToken && savedUser && savedUser !== "undefined") {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthState({
        user: JSON.parse(savedUser),
        token: savedToken,
        isLoading: false,
      });
    } catch {
      // Corrupted data — clear it and fall back to logged-out state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
     
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  } else {
   
    setAuthState((prev) => ({ ...prev, isLoading: false }));
  }
}, []);

  const login = (userData: User, jwtToken: string) => {
    setAuthState({ user: userData, token: jwtToken, isLoading: false });
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuthState({ user: null, token: null, isLoading: false });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isLoading: authState.isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}