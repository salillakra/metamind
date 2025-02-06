import { type NextRequest, NextResponse } from "next/server";
import { PostModel } from "@/db/post";
import { UserModel } from "@/db/user";

/*
Dear Developer, I tried here connecting with the db but if it's disconnected it's not connecting again. If we see pratically, we don't need because when ever the app is running it will connect to the db. But if you want to connect it here, you can do it by importing the connectDB function from "@/db/connect" and calling it before the PostModel.findById function.
*/


export const GET = async (
	req: NextRequest,
	context: { params: { postId: string } },
) => {
	// Destructure the postId from the context
	const { params } = context;

	try {
		const post = await PostModel.findById(params.postId);
		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}
		const author = await UserModel.findById(post.authorId);
		return NextResponse.json({
			post: post,
			author: author,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		} else {
			return NextResponse.json(
				{ success: false, error: "An unknown error occurred" },
				{ status: 500 },
			);
		}
	}
};
