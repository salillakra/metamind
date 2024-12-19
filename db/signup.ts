"use server";

import { connectDB } from "./connect";
import { UserModel } from "./user";
import bcrypt from "bcryptjs";

interface SignupInput {
	username: string;
	firstName: string;
	lastName: string;
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
			password: hashedPassword,
			firstName: userdata.firstName,
			lastName: userdata.lastName,
		});

		// Save the user to the database
		await user.save();
	} catch (error) {
		// Handle any errors that occur
		console.error("Error signing up:", error);
		const typedError = error as {
			code: number;
			keyPattern?: { username?: number; email?: number };
		};
		if (typedError.code === 11000) {
			if (typedError.keyPattern?.username) {
				return "Username already exists";
			}
			if (typedError.keyPattern?.email) {
				return "Email already exists";
			}
		}
		return "An error occurred";
	}
};
