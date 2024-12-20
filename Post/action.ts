"use server";

import { connectDB } from "@/db/connect";
import { PostModel } from "@/db/post";

interface IPost {
	title: string;
	category: string;
	authorId: string;
	status: "draft" | "published";
	tags: string[];
	content: string;
	imageURL: string;
}
export const CreatePost = async ({
	title,
	authorId,
	category,
	status,
	imageURL,
	tags,
	content,
}: IPost) => {
	try {
		await connectDB();
		const post = new PostModel({
			authorId: authorId,
			title: title,
			imageURL: imageURL,
			category: category,
			status: status,
			tags: tags,
			content: content,
		});

		// Save the post to the database
		await post.save();
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, error: "Failed to create post" };
	}
};
