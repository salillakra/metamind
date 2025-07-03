import { cookies } from "next/headers";

export async function POST() {
  // Clear the "token" cookie by setting its value to an empty string and maxAge to -1, which expires the cookie immediately
  const cookieStore = await cookies();
  cookieStore.set("token", "", { maxAge: -1, path: "/" });
  return new Response("Logged out successfully", { status: 200 });
}
