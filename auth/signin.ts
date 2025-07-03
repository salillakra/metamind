"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/lib/generated/prisma";
import { User } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

const secretKey = new TextEncoder().encode(process.env.SECRET || "");
const algorithm = "HS256";

// Ensure SECRET environment variable is defined at the very start
if (!process.env.SECRET) {
  throw new Error("SECRET environment variable is not defined");
}

// Check if user exists and verify password
const checkUserExistence = async (email: string, password: string) => {
  try {
    // Ensure the database is connected

    const userCredential = await prisma.userCredential.findUnique({
      where: { email },
      select: { password: true, id: true },
    });

    if (userCredential) {
      const isPasswordValid = await bcrypt.compare(
        password,
        userCredential.password
      );
      if (isPasswordValid) {
        const user = await prisma.user.findFirst({
          where: {
            userCredential: {
              id: userCredential.id,
            },
          },
        });
        return user;
      }
    }
    return false; // User not found or password invalid
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Failed to check user existence");
  }
};

// Generate JWT token
const generateJwtToken = async (payload: User): Promise<string> => {
  try {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime("1w")
      .sign(secretKey);
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate token"); // More descriptive error
  }
};

// Main authentication function
export const authenticateUser = async (
  email: string,
  password: string
): Promise<true | false> => {
  try {
    const user = await checkUserExistence(email, password);
    if (user) {
      // Generate JWT token and set it as a cookie
      const jwtToken = await generateJwtToken(user);
      (await cookies()).set("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        maxAge: 604800, // 1 week
        path: "/",
        sameSite: "strict", // CSRF protection
      });
      return true; // Authentication success
    }
    console.warn("Authentication failed: Invalid credentials");
    return false; // Invalid credentials
  } catch (error) {
    console.error("Authentication error:", error);
    return false; // Catch any other error
  }
};
