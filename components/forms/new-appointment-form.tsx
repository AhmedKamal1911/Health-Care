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

import CustomTextarea from "../health-care/custom-textarea";
import CustomCommandSearch from "../health-care/custom-command-search";
import { CommandItem } from "../ui/command";

import {
  NewAppointmentSchema,
  NewAppointmentSchemaTypes,
} from "@/lib/validations/new-appointment-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarPopover from "../health-care/calendar-popover";
import { createAppointment } from "@/lib/actions/appointmentActions";

import { documentErrorMessages } from "@/lib/data";
import { useRouter } from "next/navigation";
import DoctorBadge from "../health-care/doctor-badge";
import { Doctor } from "@/lib/types/doctor";

const allowedDays = [5, 10, 15]; // Allow the 5th, 10th, and 15th of every month

type Props = {
  patientId: string;
  doctors: Doctor[];
};

export function NewAppointmentForm({ patientId, doctors }: Props) {
  const router = useRouter();
  const form = useForm<NewAppointmentSchemaTypes>({
    resolver: zodResolver(NewAppointmentSchema),
    mode: "onChange",
    defaultValues: {
      doctor: "",
      appointmentReason: "",
      additionalComments: "",
    },
  });

  async function onSubmit(values: NewAppointmentSchemaTypes) {
    try {
      const appointment = await createAppointment(values, patientId);
      if (appointment.status === "success") {
        const appointmentId = appointment.data.id;

        router.replace(
          `/patients/${patientId}/new-appointment/success?appointmentId=${appointmentId}`
        );
        return;
      }
      if (appointment.status === "NetworkError") {
        form.setError("root", {
          message:
            documentErrorMessages[appointment.error.status] ||
            "An unexpected error occurred while creating the appointment.",
        });
        return;
      }
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
          name="doctor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-tertiary">
                Primary care physician
              </FormLabel>
              <FormControl>
                <CustomCommandSearch
                  placeholder="Search for Doctors..."
                  emptyMsg="No Doctors Found..."
                  selectedValue={field.value}
                  enableMaxContent
                  filter={(value, search) => {
                    console.log({ value, search });
                    const currentDoctorItem = doctors.find(
                      (d) => d.$id === value
                    ); // object
                    return !currentDoctorItem
                      ? 0
                      : +currentDoctorItem.doctorName.includes(search);
                  }}
                >
                  {doctors.map((doctor) => (
                    <CommandItem
                      key={doctor.$id}
                      value={doctor.$id}
                      onSelect={(currentValue) => {
                        form.setValue(
                          field.name,
                          currentValue === field.value ? "" : currentValue
                        );
                      }}
                    >
                      <DoctorBadge doctorName={doctor.doctorName} />
                    </CommandItem>
                  ))}
                </CustomCommandSearch>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex max-md:flex-col items-center justify-between gap-4">
          <FormField
            control={form.control}
            name="appointmentReason"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-tertiary">
                  Reason for appointment
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
          <FormField
            control={form.control}
            name="additionalComments"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-tertiary">
                  Additional comments/notes
                </FormLabel>
                <FormControl>
                  <CustomTextarea
                    placeholder="ex: Prefer afternoon appointments, if possible"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Calendar */}
        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-[8px] block text-tertiary w-fit">
                Expected appointment date
              </FormLabel>
              <CalendarPopover
                calendarProps={{
                  mode: "single",
                  selected: field.value,
                  onSelect: field.onChange,
                  disabled: (date) =>
                    date < new Date() || !allowedDays.includes(date.getDate()),
                  initialFocus: true,
                }}
                trigger={
                  <FormControl>
                    <Button
                      className="w-full justify-start ps-4 gap-5"
                      variant="gradient"
                      size="xl"
                    >
                      <CalendarIcon className="!w-[20px] !h-[25px] text-tertiary" />
                      <span className="text-tertiary">
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select your appointment date"}
                      </span>
                    </Button>
                  </FormControl>
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avaliable time must be get from the database */}
        <Button
          disabled={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
          className="w-full font-semibold"
          size={"lg"}
          type="submit"
        >
          {form.formState.isSubmitting || form.formState.isSubmitSuccessful
            ? "Loading..."
            : "Submit and continue"}
        </Button>
      </form>
    </Form>
  );
}
