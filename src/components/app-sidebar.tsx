'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Home, Users, ListOrdered, User as UserIcon, LogOut, Settings, Activity, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authApi } from "@/features/auth/services/auth.api"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Staff",
    url: "/staff",
    icon: Users,
    roles: ["business_owner"],
  },
  {
    title: "Queues",
    url: "/queue",
    icon: ListOrdered,
  },
]


export function AppSidebar() {
  const { user, business, clearAuth } = useAuthStore();
  const baseImgUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/storage`;

  const handleLogout = async () => {
    await authApi.logout();
    clearAuth();
  };

  const filteredItems = items.filter((item) => {
    if (item.roles && user?.role) {
      return item.roles.includes(user.role);
    }
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <Link href="/" className="flex items-center justify-center">
          <img 
            src="/logo2.png" 
            alt="Waitless Logo" 
            className="h-30 w-auto object-contain"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="w-full justify-start gap-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
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
                  <div className="flex flex-col items-start flex-1 overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">{user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate w-full">{user?.email}</span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 mb-2"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user?.role === "customer" ? "/customer" : "/dashboard"} className="flex w-full items-center cursor-pointer">
                    <Activity className="mr-2 h-4 w-4" />
                    <span>{user?.role === "customer" ? "My Queues" : "Dashboard"}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex w-full items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer flex w-full items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}