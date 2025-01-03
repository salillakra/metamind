import { PostModel } from "@/db/post";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ID = await request.json();

  const post = await PostModel.find({ authorId: ID.authorId });

  return NextResponse.json({
    post,
  });
}
