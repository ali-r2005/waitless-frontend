"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueApi } from "../services/queue.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { AlertDialogDestructive } from "@/components/shared/destructive-confirm";

interface QueueListProps {
  onEdit: (queueId: number) => void;
}

export const QueueList = ({ onEdit }: QueueListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['queues', currentPage],
    queryFn: () => queueApi.getQueues(currentPage),
  });

  const deleteMutation = useMutation({
    mutationFn: (queueId: number) => queueApi.deleteQueue(queueId),
    onSuccess: () => {
      toast.success("Queue removed successfully");
      queryClient.invalidateQueries({ queryKey: ["queues"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove queue");
    },
  });

  const queues = data?.data || [];
  const pagination = data?.pagination;

  if (isError) {
    toast.error("Failed to load queues");
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
        <CardTitle>Manage Queues</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <ul className="divide-y border rounded-md">
              {queues.length > 0 ? (
                queues.map((queue) => (
                  <li 
                    key={queue.id} 
                    className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center group cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/queue/${queue.id}`)}
                  >
                    <div className="flex flex-col mb-2 sm:mb-0">
                      <span className="font-semibold text-base flex items-center gap-2">
                        {queue.name}
                        {queue.is_active ? 
                           <span className="h-2 w-2 rounded-full bg-green-500 inline-block" title="Active"></span> 
                         : <span className="h-2 w-2 rounded-full bg-red-500 inline-block" title="Inactive"></span>
                        }
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {queue.scheduled_date ? `Scheduled: ${queue.scheduled_date} ` : "No specific date "}
                        {queue.start_time ? `at ${queue.start_time}` : ""}
                      </span>
                    </div>
                    
                    <div 
                      className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(queue.id);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialogDestructive 
                        title="Delete Queue" 
                        description={`Are you sure you want to delete the ${queue.name} queue?`}
                        onAction={() => deleteMutation.mutate(queue.id)}
                      >
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogDestructive>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-10 text-center text-muted-foreground">No queues found.</li>
              )}
            </ul>

            {pagination && (
              <div className="flex items-center justify-between gap-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {pagination.from ?? 0} to {pagination.to ?? 0} of {pagination.total} queues
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
