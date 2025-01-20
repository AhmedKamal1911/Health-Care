/* eslint-disable @typescript-eslint/no-unused-vars */

namespace NodeJS {
  interface ProcessEnv {
    PROJECT_ID: string;
    API_KEY: string;
    DATABASE_ID: string;
    PATIENT_COLLECTION_ID: string;
    DOCTOR_COLLECTION_ID: string;
    APPOINTMENT_COLLECTION_ID: string;
    BUCKET_ID: string;
    NEXT_PUBLIC_ENDPOINT: string;
    NEXT_PUBLIC_BASE_URL: string;
  }
}
