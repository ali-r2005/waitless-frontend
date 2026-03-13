"use client";

import { useState } from "react";
import { QueueList } from "@/features/QueueManagement/components/QueueList";
import { CreateQueue } from "@/features/QueueManagement/components/CreateQueue";
import { UpdateQueue } from "@/features/QueueManagement/components/UpdateQueue";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function QueueManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editQueueId, setEditQueueId] = useState<number | null>(null);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Queue Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateOpen(true)} className="shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add Queue
          </Button>
        </div>
      </div>

      <div className="w-full">
         <QueueList onEdit={(id) => setEditQueueId(id)} />
      </div>

      {/* Create Queue Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create New Queue</DialogTitle>
            <DialogDescription>Fill out the details below to add a new queue to your system.</DialogDescription>
          </DialogHeader>
          <CreateQueue onSuccess={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Queue Dialog */}
      <Dialog open={!!editQueueId} onOpenChange={(open) => !open && setEditQueueId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Queue Details</DialogTitle>
            <DialogDescription>Modify the current settings for this queue.</DialogDescription>
          </DialogHeader>
          {editQueueId && (
            <UpdateQueue 
              queueId={editQueueId} 
              onSuccess={() => setEditQueueId(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
