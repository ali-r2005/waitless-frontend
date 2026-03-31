"use client";

import { useState } from "react";
import { useParams } from 'next/navigation';
import CustomersQueueList from '@/features/QueueManagement/components/CustomersQueueList';
import { UserSearch } from "@/features/BusinessManagement/components/UserSearch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Loader2, BellRing, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queueApi } from "@/features/QueueManagement/services/queue.api";
import useQueueStore from "../store/useQueueStore";
import { Card, CardContent } from "@/components/ui/card";
import { formatWaitingTime } from "@/lib/utils";

export default function QueueManagement() {
  const { isServing, queue, hasCustomers } = useQueueStore();

  const params = useParams();
  const queueId = Number(params.id);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  

  const callNextMutation = useMutation({
    mutationFn: () => queueApi.callNextCustomer(queueId),
    onSuccess: () => {
      toast.success("Customer called to service");
      queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to call customer");
    }
  });

  const completeServingMutation = useMutation({
    mutationFn: () => queueApi.completeServing(queueId),
    onSuccess: () => {
      toast.success("Customer served");
      queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to serve customer");
    }
  });
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl md:text-5xl text-primary font-semibold tracking-tight max-w-2xl leading-tight">{queue?.name || "Queue Management"}</h1>
        <div className="flex items-center space-x-2">
          <Card className="min-w-[120px] shadow-sm hover:shadow-md transition-shadow py-0">
            <CardContent className="p-4 flex flex-col items-start gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                Avg Wait
              </span>
              <span className="text-3xl font-black text-primary tracking-tight tabular-nums">
                {formatWaitingTime(queue?.average_waiting_time)}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-md" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer to Queue
        </Button>
        {hasCustomers && (
          <Button onClick={() => isServing ? completeServingMutation.mutate() : callNextMutation.mutate()} className="shadow-md" size="lg">
            {callNextMutation.isPending || completeServingMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isServing ? (
              <>
                Complete Serving
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                <BellRing className="mr-2 h-4 w-4" />
                Call Next Customer
              </>
            )}
          </Button>
        )}
      </div>

      <div className="w-full">
        <CustomersQueueList queueId={queueId} />
      </div>

      {/* add customer dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create New Queue</DialogTitle>
            <DialogDescription>Fill out the details below to add a new queue to your system.</DialogDescription>
          </DialogHeader>
          <UserSearch action="add-customer" queueId={queueId} onSuccess={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

    </div>
  );
}
