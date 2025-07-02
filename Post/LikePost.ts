"use server";

import prisma from "@/lib/prisma";

export const toggleLike = async (
  postId: string,
  userId: string | null = null
) => {
  try {
    if (!userId) {
      // If no user ID is provided, we'll use an anonymous like counter
      // Simply increment the likes in the post stats
      const existingStats = await prisma.postStats.findFirst({
        where: {
          postId: postId,
        },
      });

      if (existingStats) {
        await prisma.postStats.update({
          where: {
            id: existingStats.id,
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        });
      } else {
        await prisma.postStats.create({
          data: {
            postId: postId,
            likes: 1,
          },
        });
      }

      // Return the updated likes count
      const updatedStats = await prisma.postStats.findFirst({
        where: {
          postId: postId,
        },
      });

      return { success: true, likes: updatedStats?.likes || 0 };
    } else {
      // For future implementation with authenticated users
      // You can track who liked what with a UserLike model
      // For now, just use the same logic as anonymous
      const existingStats = await prisma.postStats.findFirst({
        where: {
          postId: postId,
        },
      });

      if (existingStats) {
        await prisma.postStats.update({
          where: {
            id: existingStats.id,
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        });
      } else {
        await prisma.postStats.create({
          data: {
            postId: postId,
            likes: 1,
          },
        });
      }

      const updatedStats = await prisma.postStats.findFirst({
        where: {
          postId: postId,
        },
      });

      return { success: true, likes: updatedStats?.likes || 0 };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to update like" };
  }
};
