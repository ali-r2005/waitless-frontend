"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../services/staff.api";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types";
import { queueApi } from "@/features/QueueManagement/services/queue.api";

export const UserSearch = ({ action, queueId, onSuccess }:{ action : 'add-user'| 'add-customer', queueId?: number, onSuccess?: () => void}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    ...(action === "add-user"
      ? {
          mutationFn: (userId: number) =>
            staffApi.addUserToStaff(userId.toString()),
        }
      : {
          mutationFn: (userId: number) =>
            queueApi.addCustomerToQueue(queueId!, userId),
        }),
    onSuccess: () => {
      toast.success("User added successfully");
      setSearchTerm("");
      action === "add-user" && queryClient.invalidateQueries({ queryKey: ["staffs"] });
      action === "add-customer" && queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
      action === "add-customer" && onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add user");
    },
  });

  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["userSearch", debouncedSearch],
    queryFn: () => staffApi.searchUser(debouncedSearch),
    enabled: debouncedSearch.length >= 2, // Only search if at least 2 characters
  });

  if(isError){
    toast.error("Failed to load users");
    return (
      <Card className="w-full">
        <CardContent className="py-10 text-center text-red-500">
          Error: {(error as any)?.message || "Something went wrong"}
        </CardContent>
      </Card>
    );
  }

  const searchResults = data?.data as User[] || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          Find Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
          {(isLoading || isFetching) && searchTerm.length >= 2 && (
            <div className="absolute right-3 top-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          {debouncedSearch.length < 2 ? (
            <p className="text-sm text-center py-6 text-muted-foreground">
              Type at least 2 characters to search...
            </p>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y border rounded-md">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  className="p-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => addUserMutation.mutate(user.id)}
                    disabled={addUserMutation.isPending}
                  >
                    { user.id == addUserMutation.variables &&  addUserMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          ) : !isLoading && !isFetching ? (
            <p className="text-sm text-center py-6 text-muted-foreground">
              No users found matching "{debouncedSearch}"
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
