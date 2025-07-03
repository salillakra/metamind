"use client";
import React, { useState } from "react";
import AdminPostCard from "@components/AdminCard";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
import type { Post as PostType } from "@prisma/client";
import { PageTransition } from "@components/PageTransition";

const MyPostsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    if (!user?.id) return [];

    const response = await fetch("/api/get-all-author-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authorId: user.id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    console.log("Fetched posts:", response);
    const data = await response.json();
    return data.posts as PostType[];
  };

  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PostType[]>({
    queryKey: ["myPosts", user?.id],
    queryFn: fetchPosts,
    enabled: !!user?.id,
  });

  const handleDeletePost = async (postId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post");
      }

      // Refetch posts after successful deletion
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      // You can add toast notification here if you have it
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner />
        </div>
      </PageTransition>
    );
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-4 border-t-purple-600 border-r-transparent animate-spin"></div>
        </div>
      </PageTransition>
    );
  }

  if (isError) {
    return (
      <PageTransition>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4 mx-auto max-w-2xl">
          <p className="font-bold">Error loading posts</p>
          <p>{(error as Error)?.message || "Something went wrong"}</p>
        </div>
      </PageTransition>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <PageTransition>
        <div className="text-center py-20 min-h-[60vh]">
          <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">No posts yet</h2>
            <p className="text-gray-400 mb-6">
              Start creating content to see your posts here.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Create New Post
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">My Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <AdminPostCard
              title={post.title}
              createdAt={post.createdAt}
              tags={post.tags}
              description={post.description}
              key={post.id.toString()}
              id={post.id.toString()}
              onDelete={handleDeletePost}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default MyPostsPage;
