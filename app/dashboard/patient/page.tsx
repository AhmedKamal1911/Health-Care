import { PatientAppointmentsTable } from "@/components/tables/patient-table/patient-appointments-table";

import {
  APPOINTMENT_COLLECTION_ID,
  createAdminClient,
  createClientSession,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
} from "@/lib/appwrite";
import { getSessionCookie } from "@/lib/helpers/auth";
import { Appointment } from "@/lib/types/appointment";
import { Doctor } from "@/lib/types/doctor";

export default async function PatientPage() {
  const session = await getSessionCookie();
  const { databases } = createClientSession(session);
  const { databases: adminDatabases } = createAdminClient();
  const userAppointments = await databases.listDocuments<Appointment>(
    DATABASE_ID, // databaseId
    APPOINTMENT_COLLECTION_ID // collectionId
  );

  const { documents: doctors } = await adminDatabases.listDocuments<Doctor>(
    DATABASE_ID, // databaseId
    DOCTOR_COLLECTION_ID // collectionId
  );
  console.log({ doctor: userAppointments.documents });
  const { documents } = userAppointments;

  return (
    <main className="flex flex-col flex-1">
      <PatientAppointmentsTable doctors={doctors} documents={documents} />
    </main>
  );
}
