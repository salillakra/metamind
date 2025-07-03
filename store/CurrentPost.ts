import { Store } from "@tanstack/react-store";
import type { Post as PostSchema } from "@prisma/client";

// Create a store with the initial state
export const CurrentPost = new Store<PostSchema>({
  id: "",
  title: "",
  content: "",
  authorId: "",
  tags: [],
  description: "",
  isFeatured: false,
  isPublished: true,
  category: null,
  imageURL: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});
