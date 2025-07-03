import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
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

    let userId: string;

    try {
      const verifiedToken = await jose.jwtVerify(token.value, secret, {
        algorithms: ["HS256"],
      });

      if (!verifiedToken.payload || !verifiedToken.payload.id) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      userId = verifiedToken.payload.id as string;
    } catch {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Get request body
    const { firstName, lastName, bio, imageURL } = await request.json();

    console.log(
      "Updating profile for user:",
      firstName,
      lastName,
      bio,
      imageURL
    );

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        bio,
        imageURL,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
        imageURL: updatedUser.imageURL,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
