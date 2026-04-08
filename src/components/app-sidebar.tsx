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
import { Home, Users, ListOrdered } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"

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
  const { user } = useAuthStore();

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
      <SidebarFooter />
    </Sidebar>
  )
}