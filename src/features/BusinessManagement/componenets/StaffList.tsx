"use client";

import { useState } from "react";
import { staffApi } from "../services/staff.api";
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const StaffList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['staff', currentPage],
    queryFn: () => staffApi.getStaff(currentPage),
  });

  const staff = data?.data || [];
  const pagination = data?.pagination;


  if (isError) {
    toast.error("Failed to load staff members");
    return (
      <Card className="w-full">
        <CardContent className="py-10 text-center text-red-500">
          Error: {(error as any)?.message || "Something went wrong"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Staff Table/List */}
            <ul className="divide-y border rounded-md">
              {staff.length > 0 ? (
                staff.map((member) => (
                  <li key={member.id} className="p-3 flex justify-between">
                    <span>{member.name}</span>
                    <span className="text-muted-foreground">{member.email}</span>
                  </li>
                ))
              ) : (
                <li className="p-10 text-center text-muted-foreground">No staff members found.</li>
              )}
            </ul>

            {/* Pagination Controls */}
            {pagination && (
              <div className="flex items-center justify-between gap-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} staff
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  
                  <span className="flex items-center px-4 text-sm font-medium">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <Button
                    variant="outline"
                    disabled={currentPage === pagination.last_page || isLoading}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

