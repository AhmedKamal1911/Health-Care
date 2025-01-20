import { Models } from "node-appwrite";
import "server-only";
import { getSessionCookie } from "../helpers/auth";
export default async function getAccount() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/account`,
      { headers: { Cookie: `session=${await getSessionCookie()}` } }
    );

    if (!response.ok && response.status === 404) return null;
    const account = await response.json();

    // const result = UserDto.safeParse(appointment);
    // if (!result.success) {
    //   console.error(result.error.issues);
    //   console.log({ result });
    //   throw new Error("Unexpected error happend...");
    // }
    return account as Models.User<Models.Preferences>;
  } catch (error) {
    return null;
  }
}
