import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queueSchema, QueueFormValues } from "../schemas/queue.shema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueApi } from "../services/queue.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UpdateQueueProps {
  queueId: number;
  onSuccess?: () => void;
}

export const UpdateQueue = ({ queueId, onSuccess }: UpdateQueueProps) => {
  const queryClient = useQueryClient();

  const { data: queueResponse, isLoading: isFetching } = useQuery({
    queryKey: ['queue', queueId],
    queryFn: () => queueApi.getQueueById(queueId),
    enabled: !!queueId,
  });

  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueSchema),
    defaultValues: {
      name: "",
      scheduled_date: "",
      start_time: "",
    },
  });

  useEffect(() => {
    if (queueResponse?.data) {
      form.reset({
        name: queueResponse.data.name || "",
        scheduled_date: queueResponse.data.scheduled_date || "",
        start_time: queueResponse.data.start_time || "",
      });
    }
  }, [queueResponse, form]);

  const updateMutation = useMutation({
    mutationFn: (data: QueueFormValues) => queueApi.updateQueue(queueId, data),
    onSuccess: () => {
      toast.success("Queue updated successfully");
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["queue", queueId] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update queue");
    },
  });

  const onSubmit = (data: QueueFormValues) => {
    updateMutation.mutate(data);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
             <FormItem>
               <FormLabel>Queue Name</FormLabel>
               <FormControl>
                 <Input placeholder="e.g. General Consultation" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduled_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Date</FormLabel>
                <FormControl>
                   <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Queue
        </Button>
      </form>
    </Form>
  );
};
