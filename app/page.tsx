"use client";
import React, { useEffect, useState } from "react";
import PostCard from "./components/PostCard";
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";
import { connectDB } from "@/db/connect";

export type Post = {
  post: {
    _id: string;
    title: string;
    category: string;
    imageURL: string;
    tags: string[];
    description: string;
    createdAt: Date;
    likes: number;
    views: number;
  };
  author: {
    profilePic: string;
    firstName: string;
    lastName: string;
  };
};

const HomePage = () => {
  const [data, setData] = useState<{
    posts: Post[];
    loading: boolean;
    error: string | null;
  }>({
    posts: [],
    loading: true,
    error: null,
  });

  const fetchPosts = async () => {
    try {
      await connectDB();
      console.log("Connected to the database");
      const response = await fetch("/api/get-all-published-posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      console.log("Fetching posts from API");
      const result = await response.json();
      setData({ posts: result.posts, loading: false, error: null });
    } catch (error) {
      console.error(error);
      setData({ posts: [], loading: false, error: (error as Error).message });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="px-4 text-gray-100">
      <Navbar />
      {data.loading && <Spinner />}
      {/* <h1 className="text-4xl font-bold text-white mb-8">Latest Posts</h1> */}
      <div className="flex justify-center mt-10 items-center">
        <div className="grid w-full max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.posts.map((post: Post) => (
            <PostCard
              link={`/view/${post.post._id}`}
              key={post.post._id}
              title={post.post.title}
              category={post.post.category}
              imageURL={post.post.imageURL}
              tags={post.post.tags}
              likes={post.post.likes}
              views={post.post.views}
              description={post.post.description}
              createdAt={post.post.createdAt}
              profilePic={post.author.profilePic}
              firstName={post.author.firstName}
              lastName={post.author.lastName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
