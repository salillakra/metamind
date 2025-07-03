"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@components/Navbar";
import PostCard from "@components/PostCard";
import PostSkeleton from "@components/PostSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Post } from "../page";
import { useRouter } from "next/navigation";

// API fetch function
const fetchAllPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/get-all-published-posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const result = await response.json();
  return result.posts;
};

const PostsPage = () => {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Using React Query for data fetching
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allPosts"],
    queryFn: fetchAllPosts,
  });

  // Get unique categories for filter
  const categories = posts
    ? Array.from(new Set(posts.map((post: Post) => post.post.category)))
    : [];

  // Filter posts by category
  const filteredPosts = filterCategory
    ? posts?.filter((post: Post) => post.post.category === filterCategory)
    : posts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Back button */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            All Articles
            {filterCategory && (
              <span className="text-indigo-400"> • {filterCategory}</span>
            )}
          </h1>

          {/* Category Filter */}
          {!isLoading && categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center text-sm text-gray-400">
                <Filter className="mr-2 h-4 w-4" />
                Filter by:
              </div>
              <Button
                onClick={() => setFilterCategory(null)}
                variant={filterCategory === null ? "default" : "outline"}
                size="sm"
                className={
                  filterCategory === null
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : ""
                }
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  variant={filterCategory === category ? "default" : "outline"}
                  size="sm"
                  className={
                    filterCategory === category
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <PostSkeleton count={12} />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-500/10 p-6 text-center text-red-500">
              <p className="text-lg font-semibold">Something went wrong</p>
              <p className="mt-2">{(error as Error).message}</p>
              <Button
                onClick={() => refetch()}
                variant="destructive"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <>
              <p className="mb-6 text-gray-400">
                Showing {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "article" : "articles"}
                {filterCategory && ` in ${filterCategory}`}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPosts.map((post: Post) => (
                  <PostCard
                    key={post.post._id}
                    link={`/view/${post.post._id}`}
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
            </>
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gray-800/50 p-8 text-center">
              <p className="text-xl font-medium text-gray-400">
                No articles found
              </p>
              <p className="mt-2 text-gray-500">
                {filterCategory
                  ? `No articles available in the ${filterCategory} category`
                  : "Check back later for new content"}
              </p>
              {filterCategory && (
                <Button
                  onClick={() => setFilterCategory(null)}
                  variant="outline"
                  className="mt-6 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                >
                  View All Categories
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostsPage;
