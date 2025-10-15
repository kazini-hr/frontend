"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";

export interface User {
  id: string;
  email: string;
  username: string;
  company: {
    id: string;
    name: string;
    alias: string;
    country_of_incorporation: string;
    date_of_incorporation: string;
    employee_count: number;
  };
  company_id: string;
  user: {
    id: string;
    email: string;
    username: string;
    roles: ("COMPANY_ADMIN" | "SUPER_ADMIN" | "EMPLOYEE")[]; // Add more role types if needed
    is_active: boolean;
    is_verified: boolean;
    phone_number: string;
    has_2fa: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated by calling a protected endpoint. The endpoint checks the session cookie and returns user data if authenticated.
      const response = await api.get("/api/auth/me");
      console.log("Auth check response:", response.data);
      if (response.data && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
      router.push("/login");
    }
  };

  useEffect(() => {
    // Skip auth check on authentication and public website pages
    const isAuthPage =
      pathname === "/" || // Landing page
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password" ||
      pathname === "/change-password";

    if (!isAuthPage) {
      checkAuth();
    } else {
      // Just set loading to false without making the API call
      setIsLoading(false);
    }
  }, [pathname]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Modified HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Don't redirect on auth pages
    const isAuthPage =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/password-reset";

    useEffect(() => {
      if (!isLoading && !isAuthenticated && !isAuthPage) {
        router.push("/login");
      }
    }, [isAuthenticated, isLoading, router, isAuthPage]);

    if (isLoading && !isAuthPage) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaziniBlue"></div>
        </div>
      );
    }

    if (!isAuthenticated && !isAuthPage) {
      return null;
    }

    return <Component {...props} />;
  };
}
