"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShieldAlert, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 px-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-destructive/10 blur-2xl animate-pulse"></div>
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-background border shadow-2xl">
          <ShieldAlert className="h-16 w-16 text-destructive" />
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Access Denied
        </h1>
        <p className="text-muted-foreground text-lg">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="px-8 shadow-lg shadow-primary/20">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="px-8"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>

      <div className="pt-12">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/50">
          Security Protocol 403 • Restricted Area
        </div>
      </div>
    </div>
  );
}
