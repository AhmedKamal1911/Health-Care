"use client";

import { getFileUrl, handleErrorMessage } from "@/lib/utils";
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
import CustomCommandSearch from "./custom-command-search";
import { CommandItem } from "../ui/command";

import {
  PatientScheduleAppointmentSchema,
  PatientScheduleAppointmentTypes,
} from "@/lib/validations/new-appointment-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarPopover from "./calendar-popover";

import { documentErrorMessages } from "@/lib/data";

import UserBadge from "./user-badge";
import { Appointment } from "@/lib/types/appointment";
import { updatePatientAppointment } from "@/lib/actions/patientActions";
import { Doctor } from "@/lib/types/doctor";

export const frameworks = [
  { value: "next.js", label: "Next.js", id: 1 },
  { value: "sveltekit", label: "SvelteKit", id: 2 },
  { value: "nuxt.js", label: "Nuxt.js", id: 3 },
  { value: "remix", label: "Remix", id: 4 },
  { value: "astro", label: "Astro", id: 5 },
];

const allowedDays = [5, 10, 15]; // Allow the 5th, 10th, and 15th of every month

export function UpdateAppointmentForm({
  appointment,
  onSuccess,
  doctors,
}: {
  appointment: Appointment;
  onSuccess: () => void;
  doctors: Doctor[];
}) {
  const form = useForm<PatientScheduleAppointmentTypes>({
    resolver: zodResolver(PatientScheduleAppointmentSchema),
    mode: "onChange",
    defaultValues: {
      doctor: appointment?.doctor.$id,
      appointmentReason: appointment?.appointmentReason,
      appointmentDate: new Date(appointment?.appointmentDate),
    },
  });

  async function onSubmit(values: PatientScheduleAppointmentTypes) {
    try {
      const isDoctorNameUpdated = appointment.doctor.$id !== values.doctor;
      const isAppointmentReasonUpdated =
        appointment.appointmentReason !== values.appointmentReason;
      const isAppointmentDateUpdated =
        format(new Date(appointment.appointmentDate), "PPP") !==
        format(values.appointmentDate, "PPP");
      if (
        isDoctorNameUpdated ||
        isAppointmentReasonUpdated ||
        isAppointmentDateUpdated
      ) {
        const result = await updatePatientAppointment(values, appointment.$id);
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
      } else {
        form.setError("root", {
          message:
            "You should update the appointment first before updating it!",
        });
        console.log("equal");
      }
    } catch (error) {
      const { message, status } = handleErrorMessage(error);

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
                  filter={(value, search) => {
                    console.log({ value, search });
                    const currentDoctorItem = doctors.find(
                      (d) => d.$id === value
                    ); // object
                    return !currentDoctorItem
                      ? 0
                      : +currentDoctorItem.doctorName.includes(search);
                  }}
                  enableMaxContent
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
                      <UserBadge
                        userName={doctor.doctorName}
                        src={getFileUrl(doctor.avatarImage)}
                      />
                    </CommandItem>
                  ))}
                </CustomCommandSearch>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                          ? (format(field.value, "PPP") as string)
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
          disabled={form.formState.isSubmitting}
          className="w-full font-semibold"
          size={"lg"}
          type="submit"
        >
          {form.formState.isSubmitting ? "Loading..." : "Update appointment"}
        </Button>
      </form>
    </Form>
  );
}
