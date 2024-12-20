import { type NextRequest, NextResponse } from "next/server";
import { PostModel } from "@/db/post";
import { UserModel } from "@/db/user";
import { connectDB } from "@/db/connect";

export const GET = async (
	req: NextRequest,
	context: { params: { postId: string } },
) => {
	const { params } = context;

	await connectDB();
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
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 },
		);
	}
};
