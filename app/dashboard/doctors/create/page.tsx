import { CreateDoctorForm } from "@/components/forms/create-doctor-form";
import { IntroHeading } from "@/components/health-care";

export default function CreateDoctorPage() {
  return (
    <div className="px-3 sm:px-5 md:px-8 lg:px-14 py-8 bg-darkPrimary rounded-lg flex flex-col gap-10">
      <IntroHeading
        title="Create Doctor Page"
        desc="Fill the Following Form to Create New Doctor"
      />
      <CreateDoctorForm />
    </div>
  );
}
