"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemoMode: !isFirebaseConfigured,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isFirebaseConfigured;

  useEffect(() => {
    // If real Firebase auth is initialized and configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // In local demo mode, check localStorage for simulated admin session
      const savedSession = typeof window !== "undefined" ? localStorage.getItem("admin_session") : null;
      if (savedSession) {
        try {
          setUser(JSON.parse(savedSession));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, [isDemo]);

  const login = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
      });
    } else {
      // Demo / Local development login fallback (accepts admin@betbuzz.com / admin123 or any valid credentials)
      if (email.trim() && pass.length >= 6) {
        const dummyUser: AuthUser = {
          uid: "admin_demo_id_12345",
          email: email.trim(),
          displayName: "System Administrator",
        };
        setUser(dummyUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_session", JSON.stringify(dummyUser));
        }
      } else {
        throw new Error("Password must be at least 6 characters");
      }
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_session");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode: isDemo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
