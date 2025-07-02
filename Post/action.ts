"use server";

import prisma from "@/lib/prisma";
export const CreatePost = async ({
  title,
  authorId,
  category,
  isPublished,
  description,
  imageURL,
  tags,
  content,
}: {
  title: string;
  authorId: string;
  category: string | null;
  isPublished: boolean;
  description: string;
  imageURL: string | null;
  tags?: string[];
  content: string;
}) => {
  try {
    await prisma.post.create({
      data: {
        authorId: authorId,
        title: title,
        description: description,
        imageURL: imageURL,
        category: category,
        isPublished: isPublished,
        tags: tags,
        content: content,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create post" };
  }
};
