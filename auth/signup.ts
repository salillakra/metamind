"use server";

import { connectDB } from "@/db/connect";
import { UserModel } from "@/db/user";
import bcrypt from "bcryptjs";

interface SignupInput {
	username: string;
	firstName: string;
	lastName: string;
	gender: string;
	email: string;
	password: string;
}

export const signup = async (userdata: SignupInput) => {
	try {
		// Ensure the database is connected
		await connectDB();

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(
			userdata.password,
			Number.parseInt(process.env.SALT_ROUNDS || "10"),
		);

		// Create a new user instance
		const user = new UserModel({
			username: userdata.username,
			email: userdata.email,
			gender: userdata.gender,
			password: hashedPassword,
			firstName: userdata.firstName,
			lastName: userdata.lastName,
		});

		// Save the user to the database
		const res = await user.save();

		return {
			success: true,
			message: "User created successfully",
			_id: res._id.toString(),
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
	bio: string,
) => {
	"use server";
	try {
		await connectDB();
		await UserModel.findByIdAndUpdate(userId, {
			profilePic: profilePic,
			bio: bio,
		});
		return { success: true, message: "Profile picture updated" };
	} catch (error) {
		console.error("Error updating profile picture:", error);
		return { success: false, message: "Failed to update profile picture" };
	}
};
