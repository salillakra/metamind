"use server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/lib/generated/prisma";

interface SignupInput {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
}

const prisma = new PrismaClient();

export const signup = async (userdata: SignupInput) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(
      userdata.password,
      Number.parseInt(process.env.SALT_ROUNDS || "10")
    );

    // Create a new user instance
    const user = await prisma.user.create({
      data: {
        username: userdata.username,
        email: userdata.email,
        gender: userdata.gender,
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        userCredential: {
          connectOrCreate: {
            where: { email: userdata.email },
            create: {
              email: userdata.email, // Create userCredential with email
              password: hashedPassword, // Store hashed password
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "User created successfully",
      id: user.id,
    };
  } catch (error) {
    // Handle any errors that occur
    console.error("Error signing up:", error);
    const typedError = error as {
      code: number;
      keyPattern?: { username?: number; email?: number };
    };
    if (typedError.code === 11000) {
      if (typedError.keyPattern?.username) {
        return { success: false, message: "Username already exists" };
      }
      if (typedError.keyPattern?.email) {
        return { success: false, message: "Email already exists" };
      }
    }
    return { success: false, message: "Failed to create user" };
  }
};

// updating in profileIMG
export const updateProfileImg = async (
  userId: string,
  profilePic: string,
  bio: string
) => {
  "use server";
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        imageURL: profilePic,
        bio: bio,
      },
    });
    return { success: true, message: "Profile picture updated" };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return { success: false, message: "Failed to update profile picture" };
  }
};
