"use client";
import React, { useEffect, useState } from "react";
import { type IPost } from "@/db/post";
import AdminPostCard from "@/app/components/AdminCard";
import { useAuth } from "@/hooks/useAuth";

const MyPostsPage = () => {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    console.log("User in useEffect:", user);
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/get-all-author-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorId: user?._id }),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data:", data.post);
      setPosts(data.post);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center">
        {posts ? (
          posts.map((post) => (
            <AdminPostCard
              className="m-5"
              title={post.title}
              createdAt={post.createdAt}
              tags={post.tags}
              description={post.description}
              key={post._id.toString()}
            />
          ))
        ) : (
          <div className="text-center">No posts found {user?._id}</div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
