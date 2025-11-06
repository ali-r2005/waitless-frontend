// src/hooks/useRequireAuth.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function useRequireAuth() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  useEffect(() => {
    if (!token) router.push("auth/login");
  }, [token, router]);
}
