import { userSchema } from "../types/user";

export async function getUser(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`
    );

    if (!response.ok && response.status === 404) return undefined;
    const user = await response.json();

    const result = userSchema.safeParse(user);
    if (!result.success) {
      console.error(result.error.flatten().fieldErrors);
      console.error(result.error.errors);
      throw new Error("Unexpected error happend...");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
}
