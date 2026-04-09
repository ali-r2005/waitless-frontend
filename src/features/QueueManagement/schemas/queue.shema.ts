import * as z from "zod";

export const queueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  scheduled_date: z.string().optional(),
  start_time: z.string().optional(),
});

export type QueueFormValues = z.infer<typeof queueSchema>;