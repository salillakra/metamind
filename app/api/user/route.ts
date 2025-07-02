import { NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const GET = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    if (!process.env.SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(process.env.SECRET);

    try {
      const user = await jose.jwtVerify(token.value, secret, {
        algorithms: ["HS256"],
      });

      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const userId = user.payload.id;

      if (typeof userId !== "string") {
        return NextResponse.json(
          { error: "Invalid user ID in token" },
          { status: 400 }
        );
      }

      const userData = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userData) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ payload: userData });
    } catch (jwtError) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid token",
            details: jwtError,
          },
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: "Internal server error",
          details: error,
        },
      },
      { status: 500 }
    );
  }
};
