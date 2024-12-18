"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { UserModel } from "@/db/user";
import { connectDB } from "@/db/connect";

const secretKey = new TextEncoder().encode(process.env.SECRET || "");
const algorithm = "HS256";

// Ensure SECRET environment variable is defined at the very start
if (!process.env.SECRET) {
  throw new Error("SECRET environment variable is not defined");
}

interface IUser extends jose.JWTPayload {
  _id: string;
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
    // Ensure the database is connected
    await connectDB();

    const user = await UserModel.findOne({ email });

    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Return the user with proper typing
        const typedUser: IUser = {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
        return typedUser;
      }
    }
    return false; // User not found or password invalid
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Failed to check user existence"); // More descriptive error
  }
};

// Generate JWT token
const generateJwtToken = async (payload: IUser): Promise<string> => {
  try {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime("1h") // Expiry set to 1 hour
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
      const jwtToken = await generateJwtToken(user);
      cookies().set("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        maxAge: 3600, // 1 hour
        path: "/",
        sameSite: "strict", // CSRF protection
      });
      return true; // Authentication success
    } else {
      console.warn("Authentication failed: Invalid credentials");
      return false; // Invalid credentials
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return false; // Catch any other error
  }
};
