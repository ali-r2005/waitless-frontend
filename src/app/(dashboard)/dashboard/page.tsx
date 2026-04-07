'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { OwnerDashboard } from '@/features/dashboard/components/OwnerDashboard';
import { StaffDashboard } from '@/features/dashboard/components/StaffDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="h-72 xl:col-span-2 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {user?.role === 'business_owner' && <OwnerDashboard />}
      {user?.role === 'staff' && <StaffDashboard />}
      {user?.role === 'customer' && (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>No dashboard available for customers.</p>
        </div>
      )}
      {!user && (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Please log in to view your dashboard.</p>
        </div>
      )}
    </div>
  );
}