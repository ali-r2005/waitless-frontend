"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import ModeToggle from "@/components/shared/mode-toggle";
import { Clock, Bell, User as UserIcon, LogOut, Settings, Activity } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import echo from "@/lib/echo";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/useNotificationStore";
import { authApi } from "@/features/auth/services/auth.api";

export default function Header() {
  const { user, business, isAuthenticated, clearAuth } = useAuthStore();
  console.log("user", user);
  console.log("business", business);
  const { notifications, clearNotifications } = useNotificationStore();
  const baseImgUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/storage`;

  const handleLogout = async () => {
    await authApi.logout();
    clearAuth();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Waitless Logo" 
              className="h-40 w-40 object-contain"
            />
            
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </>
          ) : (
            <>
              <Link
                href={user?.role === "customer" ? "/customer" : "/dashboard"}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {user?.role === "customer" ? "Explore" : "Statistics"}
              </Link>
              {user?.role !== "customer" && (
                <Link
                  href="/queue"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Management
                </Link>
              )}
              {user?.role === "business_owner" && (
                <Link
                  href="/staff"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Staff
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-in zoom-in"
                    >
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {notifications.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] h-6 px-2"
                      onClick={() => clearNotifications()}
                    >
                      Clear All
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <DropdownMenuItem key={i} className="flex flex-col items-start p-3 gap-1">
                        <p className="text-sm font-medium">{n || "New Update"}</p>
                        <p className="text-xs text-muted-foreground">{n}</p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {
            isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 md:px-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                      {business?.name ? (
                        business.logo ? (
                          <img 
                            src={`${baseImgUrl}/${business.logo}`} 
                            alt={business.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-primary">
                            {business.name.substring(0, 1).toUpperCase()}
                          </span>
                        )
                      ) : (
                        <UserIcon className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="hidden md:inline-flex text-sm font-medium">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user?.role === "customer" ? "/customer" : "/dashboard"} className="cursor-pointer">
                      <Activity className="h-4 w-4 mr-2" />
                      {user?.role === "customer" ? "My Queues" : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ):
            (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="shadow-lg shadow-primary/20">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )
          }
        </div>
      </div>
    </header>
  );
}
