import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export const GET = async (req: NextRequest) => {
  const cookieStore = req.cookies;
  const token = cookieStore.get("token");

  const secret = new TextEncoder().encode(process.env.SECRET!);

  const user = await jose.jwtVerify(token!.value, secret, {
    algorithms: ["HS256"],
  });

  if (!user) {
    return NextResponse.json({
      error: "Invalid token",
    });
  }
  return NextResponse.json(user.payload);
};
