"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CustomFormField } from "../health-care";

import { registerPatient } from "@/lib/actions/patientActions";
import SectionWrapper from "../health-care/section-wrapper";

import { format } from "date-fns";

import {
  documentValidTypes,
  PatientRegisterFormInputs,
  patientRegisterFormSchema,
} from "@/lib/validations/patient-register-form-schema";

import { CalendarIcon } from "lucide-react";
import CalendarPopover from "../health-care/calendar-popover";
import { RadioGroupItem } from "../ui/radio-group";
import CustomRadioGroup from "../health-care/custom-radio-group";
import {
  consents,
  documentErrorMessages,
  GENDER_LIST,
  IdentificationTypes,
} from "@/lib/data";

import { SelectItem } from "../ui/select";
import CustomSelect from "../health-care/custom-select";

import CustomTextarea from "../health-care/custom-textarea";
import CustomDropzone from "../health-care/custom-dropzone";

import { useEffect, useState } from "react";
import { SelectedImageViewer } from "../health-care/selected-image-viewer";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { handleErrorMessage, uploadFileWithProgress } from "@/lib/utils";
import { DocumentResponse } from "@/app/api/upload/document/route";

import { useFileUploadBox } from "../contexts/file-upload-box";
import { useRouter } from "next/navigation";

import { UserDTO } from "@/lib/types/user";
import UserBadge from "../health-care/user-badge";

export default function PatientRegisterForm({ user }: { user: UserDTO }) {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<PatientRegisterFormInputs>({
    resolver: zodResolver(patientRegisterFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      identificationNumber: "",
      emergencyContactName: "",
      identificationType: "",
      address: "",
      pastMedicalHistory: "",
      primaryPhyisician: "",
      familyMedicalHistory: "",
      currentMedications: "",
      allergies: "",
      occupation: "",
      privacyConsent: false,
    },
  });

  const [imageUrl, setImageUrl] = useState("");
  const [consentState, setConsentState] = useState([false, false, false]);

  const identificationDocumentValue = form.watch("identificationDocument");

  useEffect(() => {
    if (!identificationDocumentValue) return;
    const url = URL.createObjectURL(identificationDocumentValue);
    setImageUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setImageUrl("");
    };
  }, [identificationDocumentValue]);

  const { open, setProgress, setUploadError } = useFileUploadBox();
  // 2. Define a submit handler.
  async function onSubmit(values: PatientRegisterFormInputs) {
    try {
      open({ file: values.identificationDocument });
      const uploadResponse = await uploadFileWithProgress<DocumentResponse>(
        "http://localhost:3000/api/upload/document",
        values.identificationDocument,
        (progress) => {
          setProgress(progress.percentage);
        }
      );

      const res = await registerPatient(
        {
          ...values,
          identificationDocument: uploadResponse.document.$id,
        },
        user.id
      );

      if (res.status === "success") {
        router.replace(`/patients/${res.data.$id}/new-appointment`);
        return;
      }

      if (res.status === "NetworkError") {
        console.log({ error: res.error.message });
        if (typeof res.status === "string") {
          form.setError("root", {
            message: res.error.message,
          });
        }
      }
    } catch (error) {
      const { message, status } = handleErrorMessage(error);

      setUploadError(true);

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
        <div className="space-y-[60px] mb-[60px]">
          <SectionWrapper text="Personal Information">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomFormField
                        placeholder="ex: Adam"
                        label="Full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex max-lg:flex-col gap-6">
                <div className="flex flex-col gap-6 flex-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            icon="/assets/icons/mail.svg"
                            iconAlt="mail icon"
                            placeholder="ex: ahmed@gmail.com"
                            label="Email address"
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
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-[8px] block text-tertiary w-fit">
                          Date of birth
                        </FormLabel>
                        <CalendarPopover
                          calendarProps={{
                            mode: "single",
                            selected: field.value,
                            onSelect: field.onChange,
                            disabled: (date) =>
                              date > new Date() ||
                              date < new Date("1900-01-01"),
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
                                    : "Please Select date of birth "}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            placeholder="ex: 14 street,New York,NY - 5101"
                            label="Address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            placeholder="Guardian's name"
                            label="Emergency contact name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            icon="/assets/icons/phone.svg"
                            iconAlt="phone Icon"
                            placeholder="ex: +1 (868) 579-9831"
                            label="Phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* RADIO INPUTS */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tertiary">
                          Insurance policy number
                        </FormLabel>
                        <FormControl>
                          <CustomRadioGroup
                            onChange={field.onChange}
                            value={field.value}
                          >
                            {GENDER_LIST.map((gender, i) => (
                              <FormItem key={i} className="w-full">
                                <FormLabel
                                  className={`${
                                    field.value === gender && "bg-[#1A1D21]"
                                  } cursor-pointer flex  items-center space-x-3 space-y-0 border-2 border-dashed border-[#363A3D] p-4 py-3 rounded-[5px] font-medium capitalize `}
                                >
                                  <FormControl>
                                    <RadioGroupItem value={gender} />
                                  </FormControl>
                                  <span>{gender}</span>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </CustomRadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            placeholder="Software Engineer"
                            label="Occupation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper text="Medical Information">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="primaryPhyisician"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-tertiary">
                      Primary care physician
                    </FormLabel>
                    <CustomSelect
                      withFormControl
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Select Doctor"
                    >
                      <SelectItem value="ms@example.com">
                        <UserBadge userName={"mohamed"} />
                      </SelectItem>
                      <SelectItem value="mss@example.com">
                        <UserBadge userName={"ahmed"} />
                      </SelectItem>
                      <SelectItem value="mvagfs@example.com">
                        <UserBadge userName={"ali"} />
                      </SelectItem>
                    </CustomSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex max-lg:flex-col gap-6">
                <div className="flex flex-col gap-6 flex-1">
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            placeholder="ex: Peanuts, Penicilin, Pollen"
                            label="Allergies (if any)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyMedicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tertiary">
                          Family medical history (if relevant)
                        </FormLabel>
                        <FormControl>
                          <CustomTextarea
                            placeholder="ex: Mother had breast cancer"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  <FormField
                    control={form.control}
                    name="currentMedications"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomFormField
                            placeholder="ex: Ibuprofen 200mg, Levothroxine 50mcg"
                            label="Current medications"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pastMedicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-tertiary">
                          Past medical history
                        </FormLabel>
                        <FormControl>
                          <CustomTextarea
                            placeholder="ex: Asthma diagnosis in childhood"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper text="Identification and Verfication">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="identificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-tertiary">
                      Identification type
                    </FormLabel>
                    <CustomSelect
                      withFormControl
                      onChange={field.onChange}
                      value={field.value ?? ""}
                      placeholder="Select Identification Type"
                    >
                      {IdentificationTypes.map((type, i) => (
                        <SelectItem key={i} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </CustomSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomFormField
                        placeholder="ex 1234567"
                        label="Identification Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identificationDocument"
                render={({ field }) => (
                  <FormItem
                    className={`${
                      imageUrl && !form.formState.errors.identificationDocument
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <FormLabel className="text-tertiary">
                      Scanned Copy of Identification Document
                    </FormLabel>
                    <FormControl>
                      <CustomDropzone
                        accept={documentValidTypes.join(", ")}
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
              {imageUrl && !form.formState.errors.identificationDocument && (
                <SelectedImageViewer
                  onClose={() => {
                    form.resetField("identificationDocument");
                    form.trigger("identificationDocument");
                  }}
                  url={imageUrl}
                />
              )}
            </div>
          </SectionWrapper>

          <SectionWrapper text="Consent and Privacy">
            <div className="space-y-6">
              {consents.map((item, i) => (
                <div
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <Checkbox
                    id={item.id}
                    checked={consentState[i]}
                    onCheckedChange={() => {
                      const newState = consentState.map((value, idx) =>
                        i === idx ? !value : value
                      );
                      setConsentState(newState);

                      form.setValue("privacyConsent", newState.every(Boolean), {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  />

                  <Label
                    htmlFor={item.id}
                    className="font-normal text-tertiary text-[14px] lg:text-[18px] "
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
              <FormField
                control={form.control}
                name="privacyConsent"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Checkbox className={"hidden"} checked={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </SectionWrapper>
        </div>

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
