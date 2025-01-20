import { createAdminClient } from "@/lib/appwrite";
import { UserDTO } from "@/lib/types/user";
import { handleErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { Models } from "node-appwrite";

function toDTOMapper(user: Models.User<Models.Preferences>): UserDTO {
  return {
    id: user.$id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    emailVerification: user.emailVerification,
    phoneVerification: user.phoneVerification,
    registrationDate: new Date(user.registration),
    createdAt: new Date(user.$createdAt),
    updatedAt: new Date(user.$updatedAt),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId)
    return new NextResponse(
      JSON.stringify({
        error: "Invalid user id",
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );

  try {
    const { users } = createAdminClient();
    const user = await users.get(userId);

    return NextResponse.json(toDTOMapper(user));
  } catch (error) {
    const { status, message, statusText } = handleErrorMessage(error);
    return NextResponse.json(
      {
        message,
      },
      { status, statusText }
    );
  }
}
