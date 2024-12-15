import { cookies } from "next/headers";

export async function POST() {
  cookies().set("token", "", { maxAge: -1, path: "/" }); // Clear cookie
  return new Response("Logged out successfully", { status: 200 });
}
