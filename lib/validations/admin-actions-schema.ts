import { z } from "zod";

export const cancellationSchema = z.object({
  cancellationReason: z
    .string()
    .min(1, "You Must write the reason for cancellation"),
});

export type CancellationSchema = z.infer<typeof cancellationSchema>;
