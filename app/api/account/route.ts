import { createClientSession } from "@/lib/appwrite";
import { getSessionCookie } from "@/lib/helpers/auth";
import { AuthenticationError } from "@/lib/helpers/error";
import { handleErrorMessage } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userSession = await getSessionCookie();
    const { account } = createClientSession(userSession);
    const userInfo = await account.get();
    return NextResponse.json(userInfo);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { message: error.message },
        { statusText: error.statusText, status: error.statusCode }
      );
    } else {
      const { message, status, statusText } = handleErrorMessage(error);
      return NextResponse.json(
        { message: status === 401 ? "Unauthenticated User" : message },
        { statusText, status }
      );
    }
  }
}
