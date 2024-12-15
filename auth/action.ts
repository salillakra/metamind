"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { UserModel } from "@/db/user";

const secretKey = new TextEncoder().encode(process.env.SECRET);
const algorithm = "HS256";

if (!process.env.SECRET) {
  throw new Error("SECRET environment variable is not defined");
}

interface IUser extends jose.JWTPayload {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "author" | "reader" | "admin";
}

// Check if user exists and verify password
const checkUserExistence = async (
  email: string,
  password: string
): Promise<IUser | false> => {
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const typedUser = user as unknown as IUser;
      if (await bcrypt.compare(password, typedUser.password as string)) {
        return {
          _id: typedUser._id,
          email: typedUser.email,
          username: typedUser.username,
          firstName: typedUser.firstName,
          lastName: typedUser.lastName,
          role: typedUser.role,
        };
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking user existence:", error);
  }
  return false;
};

// Generate JWT token
const generateJwtToken = async (payload: IUser): Promise<string> => {
  try {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate token");
  }
};

// Main authentication function
export const authenticateUser = async (
  email: string,
  password: string
): Promise<string | false> => {
  const user = await checkUserExistence(email, password);
  if (user) {
    try {
      const jwtToken = await generateJwtToken(user);
      cookies().set("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600, // 1 hour
        path: "/", // Root path
        sameSite: "strict", // CSRF protection
      });
      return jwtToken;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  } else {
    console.warn("Authentication failed: Invalid credentials");
    return false;
  }
};
