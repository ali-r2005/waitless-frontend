"use client";

import { useState } from "react";
import { useParams } from 'next/navigation';
import CustomersQueueList from '@/features/QueueManagement/components/CustomersQueueList';
import { UserSearch } from "@/features/BusinessManagement/componenets/UserSearch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function QueuePage() {
  const params = useParams();
  const queueId = params.id;
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useRequireRole(["staff", "business_owner"]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Queue Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateOpen(true)} className="shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer to Queue
          </Button>
        </div>
      </div>

      <div className="w-full">
        <CustomersQueueList queueId={Number(queueId)} />
      </div>

      {/* add customer dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create New Queue</DialogTitle>
            <DialogDescription>Fill out the details below to add a new queue to your system.</DialogDescription>
          </DialogHeader>
          <UserSearch action="add-customer" queueId={Number(queueId)} onSuccess={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

    </div>
  );
}
