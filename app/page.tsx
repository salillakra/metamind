"use client";
import React, { useEffect, useState } from "react";
import PostCard from "./components/PostCard";
import Spinner from "./components/Spinner";

type Post = {
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
  const [data, setData] = useState({
    posts: [] as Post[],
    loading: true,
    error: null,
  });

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/getAllPosts");
      const result = await response.json();
      setData({ posts: result.posts, loading: false, error: null });
    } catch (error) {
      console.error(error);
      setData({ posts: [], loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="h-screen px-4 text-gray-100">
      <h1 className="text-4xl font-bold text-white mb-8">Latest Posts</h1>
      {data.loading && <Spinner />}
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
  );
};

export default HomePage;
