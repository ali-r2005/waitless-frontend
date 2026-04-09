import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queueSchema, QueueFormValues } from "../schemas/queue.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queueApi } from "../services/queue.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateQueueProps {
  onSuccess?: () => void;
}

export const CreateQueue = ({ onSuccess }: CreateQueueProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueSchema),
    defaultValues: {
      name: "",
      scheduled_date: "",
      start_time: "",
    },
  });

  const mutation = useMutation({
    mutationFn: queueApi.createQueue,
    onSuccess: () => {
      toast.success("Queue created successfully");
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create queue");
    },
  });

  const onSubmit = (data: QueueFormValues) => {
    mutation.mutate(data);
  };

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

        <Button type="submit" className="w-full mt-4" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Queue
        </Button>
      </form>
    </Form>
  );
};
