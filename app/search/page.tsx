"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Post } from "../page";
import { useRouter } from "next/navigation";

// API fetch functions
const searchPosts = async (query: string): Promise<Post[]> => {
  // In a real app, you would call a search API endpoint
  // For now, we'll get all posts and filter client-side
  const response = await fetch("/api/get-all-published-posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const result = await response.json();
  const posts = result.posts;

  if (!query) return posts;

  // Simple client-side search (would be better on the server)
  return posts.filter((post: Post) => {
    const searchableText = [
      post.post.title,
      post.post.description,
      post.post.category,
      ...post.post.tags,
      `${post.author.firstName} ${post.author.lastName}`,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query.toLowerCase());
  });
};

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const tagQuery = searchParams.get("tag") || "";
  const [inputQuery, setInputQuery] = useState(searchQuery);

  // Set the query param from URL to input field
  useEffect(() => {
    setInputQuery(searchQuery || tagQuery || "");
  }, [searchQuery, tagQuery]);

  // Using React Query for data fetching
  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["searchPosts", searchQuery, tagQuery],
    queryFn: () => searchPosts(searchQuery || tagQuery),
    enabled: !!(searchQuery || tagQuery),
  });

  // Handle search input
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputQuery)}`);
    }
  };

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

        {/* Search Header */}
        <div className="mb-12">
          <h1 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            {tagQuery ? (
              <>
                Articles tagged with{" "}
                <span className="text-indigo-400">#{tagQuery}</span>
              </>
            ) : (
              <>Search Results{searchQuery ? `: "${searchQuery}"` : ""}</>
            )}
          </h1>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex max-w-2xl overflow-hidden rounded-full border border-gray-700 bg-gray-800/30 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={handleSearchInputChange}
              placeholder="Search articles, topics, or authors..."
              className="flex-1 border-0 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-indigo-600 px-4 text-white transition hover:bg-indigo-700"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="mb-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <PostSkeleton count={8} />
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
          ) : searchResults && searchResults.length > 0 ? (
            <>
              <p className="mb-6 text-gray-400">
                Found {searchResults.length}{" "}
                {searchResults.length === 1 ? "result" : "results"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((post: Post) => (
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
                No results found
              </p>
              <p className="mt-2 text-gray-500">
                Try a different search term or browse our categories
              </p>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="mt-6 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
              >
                Browse All Articles
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
