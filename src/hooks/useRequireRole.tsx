"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { Role } from "@/types";

export function useRequireRole(requiredRole: Role | Role[]) {
  const { isAuthenticated, user, isLoading } = useAuth(); // already handles unauthenticated redirect
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user?.role as Role)) {
      router.replace("/unauthorized");
    }
  }, [user, isLoading]);

  return { user, isLoading };
}