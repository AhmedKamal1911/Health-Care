"use server";

import { AuthenticationFactor, Models } from "node-appwrite";

import { AuthDTO } from "../types/auth";
import { NetworkError, Response } from "../types/types";
import { LoginFormSchemaInputs } from "../validations/login-form-schema";
import { handleErrorMessage } from "../utils";
import { cookies } from "next/headers";
import { createAdminClient, createClientSession } from "../appwrite";
import { createLoginSession, getSessionCookie } from "../helpers/auth";
import { redirect, RedirectType } from "next/navigation";

type LoginResponse = Response<AuthDTO, LoginFormSchemaInputs>;

function toDTOMapper(logginRes: Models.Session): AuthDTO {
  return {
    createdAt: new Date(logginRes.$createdAt),
    email: logginRes.providerUid,
    jwt: logginRes.secret,
    userId: logginRes.userId,
  };
}
export async function userLogin(
  userInfo: LoginFormSchemaInputs
): LoginResponse {
  try {
    const { accounts } = createAdminClient();
    const user = await accounts.createEmailPasswordSession(
      userInfo.email,
      userInfo.password
    );
    const { account } = createClientSession(user.secret);
    await createLoginSession(user.secret, user.expire);
    await account.get();
    // store session secret inside browser cookie jar

    return { data: toDTOMapper(user), status: "success" };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);
    if (statusText === `user_more_factors_required`) {
      // Save the challenge ID to complete the challenge later
    }
    return { error: { status, message, statusText }, status: "NetworkError" };
  }
}

export async function userLogout(currentState: undefined): Promise<undefined> {
  try {
    const sessionCookie = await getSessionCookie();
    const { account } = createClientSession(sessionCookie);

    account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
  (await cookies()).delete("session");
  redirect("/login", RedirectType.replace);
}
type CreateOTPChallengeResponse = Promise<
  { status: "success"; response: Models.MfaChallenge } | NetworkError
>;
export async function createOTPChallenge(): CreateOTPChallengeResponse {
  const session = await getSessionCookie();
  const { account } = createClientSession(session);
  try {
    const response = await account.createMfaChallenge(
      AuthenticationFactor.Phone
    );
    return { status: "success", response };
  } catch (error) {
    const { message, status, statusText } = handleErrorMessage(error);

    return { status: "NetworkError", error: { status, message, statusText } };
  }
}
export async function completeOTPChallenge(
  prevState: unknown,
  formData: FormData
): Promise<{ status: string } | undefined> {
  const challengeId = formData.get("challengeId") as string;
  const otpValue = formData.get("OTP") as string;
  try {
    console.log({ challengeId, otpValue });
    const session = await getSessionCookie();
    const { account } = createClientSession(session);
    const response = await account.updateMfaChallenge(challengeId, otpValue);
    console.log({ response, session, account });

    redirect("/dashboard/admin", RedirectType.replace);
  } catch (error) {
    console.log(error);
    return { status: "failed" };
  }
}
