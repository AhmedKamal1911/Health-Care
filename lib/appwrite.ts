import {
  Account,
  Client,
  Databases,
  Messaging,
  Storage,
  Users,
} from "node-appwrite";

export const {
  API_KEY,
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
  BUCKET_ID,
  PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_ENDPOINT,
  PROJECT_ID,
} = process.env;

export function createClientSession(session: string) {
  const client = new Client();

  client
    .setEndpoint(NEXT_PUBLIC_ENDPOINT)
    .setProject(PROJECT_ID)
    .setSession(session);
  return {
    get databases() {
      return new Databases(client);
    },

    get users() {
      return new Users(client);
    },
    get account() {
      return new Account(client);
    },
  };
}

export function createAdminClient() {
  const client = new Client();

  client
    .setEndpoint(NEXT_PUBLIC_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY); // Replace with your project ID
  return {
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get messaging() {
      return new Messaging(client);
    },
    get users() {
      return new Users(client);
    },
    get accounts() {
      return new Account(client);
    },
  };
}

export { ID } from "node-appwrite";
