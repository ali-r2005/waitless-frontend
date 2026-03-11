'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * AuthLayout provides a wrapper for authentication pages (Login, Register).
 * It automatically redirects authenticated users to the profile page to prevent
 * logged-in users from accessing the auth forms again.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      router.replace("/profile");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  // Show a premium loading state while verifying authentication status
  // or while the redirect is in progress
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20 opacity-75"></div>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg"></div>
        </div>
        <p className="animate-pulse text-sm font-medium text-muted-foreground">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {children}
    </div>
  );
}
