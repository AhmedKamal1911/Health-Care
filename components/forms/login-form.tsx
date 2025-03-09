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

import { CustomFormField, OTPDialog } from "../health-care";
import { useRouter } from "next/navigation";

import {
  LoginFormSchema,
  LoginFormSchemaInputs,
} from "@/lib/validations/login-form-schema";
import { createOTPChallenge, userLogin } from "@/lib/actions/authActions";
import { useState } from "react";

export default function LoginForm() {
  const [openOTPDialog, setOpenOTPDialog] = useState(false);
  const [challengeId, setChallengeId] = useState("");

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<LoginFormSchemaInputs>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginFormSchemaInputs) {
    try {
      const res = await userLogin(values);
      if (res.status === "validationError") return;
      if (res.status === "success") {
        router.replace(`/dashboard/patient`);
        return;
      }
      console.log(res.error);
      if (res.error.statusText !== "user_more_factors_required") {
        form.setError("root", {
          message: res.error.message,
        });
        return;
      }

      console.log("from challenge");
      const challengeResponse = await createOTPChallenge();
      if (challengeResponse.status === "success") {
        const challengeId = challengeResponse.response.$id;
        setChallengeId(challengeId);
        setOpenOTPDialog(true);

        return;
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root?.message && (
            <span className="text-red-500">
              {form.formState.errors.root.message}
            </span>
          )}

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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomFormField
                    icon="/assets/icons/lock.svg"
                    type="password"
                    iconAlt="password Icon"
                    placeholder="Password"
                    label="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={
              form.formState.isSubmitting || form.formState.isSubmitSuccessful
            }
            className="w-full"
            size={"lg"}
            type="submit"
          >
            {form.formState.isSubmitting || form.formState.isSubmitSuccessful
              ? "Loading..."
              : "Sign in"}
          </Button>
        </form>
      </Form>
      {challengeId && (
        <OTPDialog
          open={openOTPDialog}
          setOpen={setOpenOTPDialog}
          challengeId={challengeId}
          title="Verify OTP"
          submitBtnTitle="Verify"
          desc="Please enter the OTP sent to your registered mobile number."
        />
      )}
    </>
  );
}
