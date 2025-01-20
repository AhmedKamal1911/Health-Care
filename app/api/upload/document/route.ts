import { BUCKET_ID, createAdminClient } from "@/lib/appwrite";
import { documentFileSchema } from "@/lib/validations/patient-register-form-schema";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException, ID, Models } from "node-appwrite";
export type DocumentResponse = {
  document: Models.File;
};
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const documentParseResult = documentFileSchema.safeParse(
    formData.get("identificationDocument")
  );
  if (!documentParseResult.success) {
    return NextResponse.json(
      { message: documentParseResult.error.errors[0].message },
      { status: 400, statusText: "Bad Request" }
    );
  }
  try {
    const { storage } = createAdminClient();
    const file = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      documentParseResult.data
    );
    return NextResponse.json<DocumentResponse>(
      { document: file },
      { status: 201, statusText: "Created" }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof AppwriteException || error instanceof Error
            ? error.message
            : "Something went wrong!",
      },
      {
        status: error instanceof AppwriteException ? error.code : 500,
        statusText:
          error instanceof AppwriteException ? error.type : "Internal Error",
      }
    );
  }
}
