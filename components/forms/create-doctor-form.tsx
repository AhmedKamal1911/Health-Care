"use client";

import { handleErrorMessage, uploadFileWithProgress } from "@/lib/utils";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarPopover from "../health-care/calendar-popover";

import { documentErrorMessages } from "@/lib/data";

import { CustomFormField } from "../health-care";
import { useEffect, useRef, useState } from "react";
import CustomDropzone from "../health-care/custom-dropzone";

import {
  createDoctorSchema,
  createDoctorType,
  ImageValidTypes,
} from "@/lib/validations/create-doctor-schema";
import { SelectedImageViewer } from "../health-care/selected-image-viewer";
import { createNewDoctor } from "@/lib/actions/doctorActions";
import { useFileUploadBox } from "../contexts/file-upload-box";
import { DocumentResponse } from "@/app/api/upload/document/route";
import { useRouter } from "next/navigation";

export function CreateDoctorForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const uploadedImageIdRef = useRef<string | null>(null);
  const form = useForm<createDoctorType>({
    resolver: zodResolver(createDoctorSchema),
    mode: "onChange",
    defaultValues: {
      doctorName: "",
      email: "",
      experience: "",
      phoneNumber: "",
      specialty: "",
      startWorkingDate: new Date(),
    },
  });
  const avatarImageValue = form.watch("avatarImage");

  useEffect(() => {
    if (!avatarImageValue) return;
    const url = URL.createObjectURL(avatarImageValue);
    setImageUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setImageUrl("");
    };
  }, [avatarImageValue]);

  const {
    open: openUploadBox,
    setProgress,
    setUploadError,
  } = useFileUploadBox();
  async function onSubmit(values: createDoctorType) {
    try {
      if (!uploadedImageIdRef.current) {
        openUploadBox({ file: values.avatarImage });
        const { document: image } =
          await uploadFileWithProgress<DocumentResponse>(
            "http://localhost:3000/api/upload/document",
            values.avatarImage,
            (progress) => {
              setProgress(progress.percentage);
            }
          );
        uploadedImageIdRef.current = image.$id;
      }

      const result = await createNewDoctor(values, uploadedImageIdRef.current);

      if (result.status === "success") {
        router.replace("/dashboard/doctors");
        return;
      }

      if (result.status === "NetworkError") {
        console.log("Unexpected error:", { error: result.error });
        form.setError("root", {
          message:
            documentErrorMessages[result.error.status] ||
            "An unexpected error occurred while creating the appointment.",
        });
        return;
      }
    } catch (error) {
      if (!uploadedImageIdRef.current) {
        setUploadError(true);
      }
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
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/user.svg"
                  iconAlt="user Icon"
                  placeholder="Doctor Name"
                  label="Fullname"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/user.svg"
                  iconAlt="user Icon"
                  placeholder="Enter The Doctor Specialty"
                  label="Specialty"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/phone.svg"
                  iconAlt="phone Icon"
                  placeholder="Phone number"
                  label="Phone number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/phone.svg"
                  iconAlt="phone Icon"
                  placeholder="Enter Experience Years"
                  label="Experience"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/phone.svg"
                  iconAlt="phone Icon"
                  placeholder="Enter Email Address"
                  label="Email"
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
          name="startWorkingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-[8px] block text-tertiary w-fit">
                Start Working Date
              </FormLabel>
              <CalendarPopover
                calendarProps={{
                  mode: "single",
                  selected: field.value,
                  onSelect: field.onChange,
                  disabled: (date) => date <= new Date(),
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

        <FormField
          control={form.control}
          name="avatarImage"
          render={({ field }) => (
            <FormItem
              className={`${
                imageUrl && !form.formState.errors.avatarImage ? "hidden" : ""
              }`}
            >
              <FormLabel className="text-tertiary">
                Scanned Copy of Identification Document
              </FormLabel>
              <FormControl>
                <CustomDropzone
                  accept={ImageValidTypes.join(", ")}
                  setValue={(files) =>
                    form.setValue(field.name, files?.[0], {
                      shouldValidate: true,
                    })
                  }
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {imageUrl && !form.formState.errors.avatarImage && (
          <SelectedImageViewer
            onClose={() => {
              form.resetField("avatarImage");
              form.trigger("avatarImage");
            }}
            url={imageUrl}
            className="h-[200px] max-w-[250px] mx-auto"
          />
        )}
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
            ? "Creating..."
            : "Create"}
        </Button>
      </form>
    </Form>
  );
}
