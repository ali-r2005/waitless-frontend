"use client";
import { StaffList } from "@/features/BusinessManagement/componenets/StaffList";
import { UserSearch } from "@/features/BusinessManagement/componenets/UserSearch";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function StaffPage() {
  useRequireRole(['business_owner']);
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">Manage your team members and search for new users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StaffList />
        </div>
        <div>
          <UserSearch action="add-user"/>
        </div>
      </div>
    </div>
  );
}
