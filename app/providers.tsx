"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/password-reset",
    ];

    // Check if the current route requires authentication
    const requiresAuth =
      !publicRoutes.some((route) => pathname.startsWith(route)) &&
      !pathname.startsWith("/_next") &&
      pathname !== "/";

    if (!isAuthenticated && requiresAuth) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
