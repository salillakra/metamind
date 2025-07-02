import type { Post as PostSchema } from "@/lib/generated/prisma";
import { CurrentPost } from "@/store/CurrentPost";

const LOCAL_STORAGE_KEY = "metamind_draft_post";

/**
 * Saves the current post state to localStorage
 */
export const savePostToLocalStorage = () => {
  if (typeof window !== "undefined") {
    const currentState = CurrentPost.state;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
  }
};

/**
 * Loads the post state from localStorage
 * @returns The post data from localStorage or null if not found
 */
export const loadPostFromLocalStorage = (): PostSchema | null => {
  if (typeof window !== "undefined") {
    const savedPost = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPost) {
      try {
        const postData = JSON.parse(savedPost);
        // Convert string dates back to Date objects
        if (postData.createdAt)
          postData.createdAt = new Date(postData.createdAt);
        if (postData.updatedAt)
          postData.updatedAt = new Date(postData.updatedAt);
        return postData;
      } catch (error) {
        console.error("Failed to parse post data from localStorage:", error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Restores post state from localStorage into the CurrentPost store
 * @returns true if post was restored, false otherwise
 */
export const restorePostFromLocalStorage = (): boolean => {
  const savedPost = loadPostFromLocalStorage();
  if (savedPost) {
    CurrentPost.setState(() => savedPost);
    return true;
  }
  return false;
};

/**
 * Clears the post data from localStorage
 */
export const clearPostFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};
