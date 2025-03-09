"use client";

import { handleErrorMessage } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

import CustomTextarea from "./custom-textarea";

import { zodResolver } from "@hookform/resolvers/zod";

import { documentErrorMessages } from "@/lib/data";

import { adminCancelAppointment } from "@/lib/actions/appointmentActions";
import {
  CancellationSchema,
  cancellationSchema,
} from "@/lib/validations/admin-actions-schema";

export function CancelAppointmentForm({
  appointmentId,
  patientId,
  onSuccess,
}: {
  appointmentId: string;
  onSuccess: () => void;
  patientId: string;
}) {
  const form = useForm<CancellationSchema>({
    resolver: zodResolver(cancellationSchema),
    mode: "onChange",
    defaultValues: {
      cancellationReason: "",
    },
  });

  async function onSubmit(values: { cancellationReason: string }) {
    try {
      const result = await adminCancelAppointment(
        values.cancellationReason,
        patientId,
        appointmentId
      );
      if (result.status === "success") {
        onSuccess();

        return;
      }

      if (result.status === "NetworkError") {
        form.setError("root", {
          message:
            documentErrorMessages[result.error.status] ||
            "An unexpected error occurred while creating the appointment.",
        });
        return;
      }

      if (result.status === "validationError") {
        form.setError("root", {
          message:
            "You should fill the cancellation reason first before confirmation!",
        });
      }

      console.log("equal");
    } catch (error) {
      const { message, status } = handleErrorMessage(error);
      console.log("Unexpected error:", { error: message, status });
      form.setError("root", {
        message:
          documentErrorMessages[status] ||
          message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root?.message && (
          <span className="text-red-500">
            {form.formState.errors.root.message}
          </span>
        )}

        <FormField
          control={form.control}
          name="cancellationReason"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-tertiary">
                Reason for Cancellation
              </FormLabel>
              <FormControl>
                <CustomTextarea
                  placeholder="ex: Annual montly check-up"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avaliable time must be get from the database */}
        <Button
          disabled={form.formState.isSubmitting}
          className="w-full font-semibold"
          size={"lg"}
          type="submit"
        >
          {form.formState.isSubmitting ? "Loading..." : "Confirm Cancellation"}
        </Button>
      </form>
    </Form>
  );
}
