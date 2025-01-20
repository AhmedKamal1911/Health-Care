"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  PatientFormInputs,
  PatientFormSchema,
} from "@/lib/validations/patient-form-schema";
import { CustomFormField } from "../health-care";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patientActions";

export default function PatientForm() {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<PatientFormInputs>({
    resolver: zodResolver(PatientFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: PatientFormInputs) {
    try {
      const res = await createUser(values);

      if (res.status === "success") {
        router.replace(`/patients/${res.data.id}/register`);
        return;
      }

      if (res.status === "NetworkError") {
        form.setError("root", {
          message: res.error.message,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error.message);
        form.setError("root", {
          message: error.message,
        });
      }
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/user.svg"
                  iconAlt="user Icon"
                  placeholder="Full name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  icon="/assets/icons/mail.svg"
                  iconAlt="mail Icon"
                  placeholder="Email Address"
                  label="Email address"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  type="password"
                  icon="/assets/icons/lock.svg"
                  // iconAlt="user Icon"
                  placeholder="Enter Password"
                  label="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CustomFormField
                  type="password"
                  icon="/assets/icons/lock.svg"
                  // iconAlt="user Icon"
                  placeholder="Enter Password Confirm"
                  label="Password Confirm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          className="w-full"
          size={"lg"}
          type="submit"
        >
          {form.formState.isSubmitting ? "Loading..." : "Get Started"}
        </Button>
      </form>
    </Form>
  );
}
