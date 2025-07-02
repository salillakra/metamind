"use server";

import prisma from "@/lib/prisma";

export const deletePost = async (postId: string) => {
  try {
    // Delete related comments first to avoid foreign key constraints
    await prisma.commentReply.deleteMany({
      where: {
        comment: {
          postId: postId,
        },
      },
    });

    await prisma.comment.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Delete post stats
    await prisma.postStats.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
};
