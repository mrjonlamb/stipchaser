"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authSignIn,
  authSignOut,
  getAuthUser,
  isAuthenticated,
  completeNewPassword,
  AuthUser,
} from "./auth-client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; challengeName?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  completeNewPassword: (newPassword: string) => Promise<boolean>;
  isManager: boolean;
  isStaff: boolean;
  isConsumer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const authUser = await getAuthUser();
        setUser(authUser);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    try {
      const authUser = await getAuthUser();
      setUser(authUser);
    } catch (error) {
      console.error("Refresh user error:", error);
      setUser(null);
    }
  }

  async function signIn(email: string, password: string): Promise<{ success: boolean; challengeName?: string }> {
    try {
      const result = await authSignIn(email, password);

      if (result.success) {
        const authUser = await getAuthUser();
        setUser(authUser);
        return { success: true };
      }

      if (result.challengeName) {
        return { success: false, challengeName: result.challengeName };
      }

      return { success: false };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false };
    }
  }

  async function handleCompleteNewPassword(newPassword: string): Promise<boolean> {
    try {
      const result = await completeNewPassword(newPassword);

      if (result.success) {
        const authUser = await getAuthUser();
        setUser(authUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Complete new password error:", error);
      return false;
    }
  }

  async function signOut() {
    try {
      await authSignOut();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  // Helper role checks
  const isManager =
    user?.groups?.includes("DealerManager") || user?.role === "DealerManager";
  const isStaff =
    user?.groups?.includes("DealerStaff") ||
    user?.role === "DealerStaff" ||
    isManager;
  const isConsumer =
    user?.groups?.includes("Consumer") || user?.role === "Consumer";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        refreshUser,
        completeNewPassword: handleCompleteNewPassword,
        isManager,
        isStaff,
        isConsumer,
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
