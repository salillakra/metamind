"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@components/Navbar";
import PostCard from "@components/PostCard";
import FeaturedPost from "@components/FeaturedPost";
import TrendingTags from "@components/TrendingTags";
import CategorySection from "@components/CategorySection";
import Newsletter from "@components/Newsletter";
import PostSkeleton from "@components/PostSkeleton";
import FeaturedPostSkeleton from "@components/FeaturedPostSkeleton";
import Footer from "@components/Footer";
import { Button } from "@components/ui/button";
import { Search, RefreshCw, ArrowRight } from "lucide-react";

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

export type CategoryWithPosts = {
  category: string;
  posts: Post[];
};

// API fetch functions
const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/get-all-published-posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const result = await response.json();
  return result.posts;
};

const fetchFeaturedPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/get-featured-posts");
  if (!response.ok) {
    throw new Error("Failed to fetch featured posts");
  }
  const result = await response.json();
  return result.posts;
};

const fetchTrendingTags = async (): Promise<
  { tag: string; count: number }[]
> => {
  const response = await fetch("/api/get-trending-tags");
  if (!response.ok) {
    throw new Error("Failed to fetch trending tags");
  }
  const result = await response.json();
  return result.trendingTags;
};

const fetchCategoriesWithPosts = async (): Promise<CategoryWithPosts[]> => {
  const response = await fetch("/api/get-categories-with-posts");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const result = await response.json();
  return result.categories;
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Using React Query for data fetching
  const { data: featuredPosts, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchFeaturedPosts,
  });

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const { data: trendingTags, isLoading: isTagsLoading } = useQuery({
    queryKey: ["trendingTags"],
    queryFn: fetchTrendingTags,
  });

  const { data: categoriesWithPosts, isLoading: isCategoriesLoading } =
    useQuery({
      queryKey: ["categoriesWithPosts"],
      queryFn: fetchCategoriesWithPosts,
    });

  // Handle search input
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Filter posts for initial display
  const latestPosts = posts?.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100">
      <Navbar />

      {/* Hero Section with Search */}
      <div className="relative overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('/wallpaper.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/30 to-purple-800/30"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                MetaMind
              </span>
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-gray-300">
              Discover insightful articles and connect with innovative thinkers
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto mt-6 sm:mt-10 flex max-w-lg overflow-hidden rounded-full border border-gray-700/50 bg-gray-800/30 shadow-lg backdrop-blur-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all duration-300"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search articles, topics, or authors..."
                className="flex-1 border-0 bg-transparent px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-indigo-600 px-4 sm:px-6 text-white transition hover:bg-indigo-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {/* Featured Post Section */}
        <section className="my-12 sm:my-20">
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl mb-4 sm:mb-0">
              <span className="inline-block border-b-2 border-indigo-500 pb-1">
                Featured Story
              </span>
            </h2>

            {!isFeaturedLoading && (
              <Button
                onClick={() => refetchPosts()}
                variant="ghost"
                size="sm"
                className="group text-gray-400 hover:text-white self-start sm:self-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                Refresh
              </Button>
            )}
          </div>

          {isFeaturedLoading ? (
            <FeaturedPostSkeleton />
          ) : featuredPosts && featuredPosts.length > 0 ? (
            <div className="transform transition duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <FeaturedPost
                id={featuredPosts[0].post._id}
                title={featuredPosts[0].post.title}
                description={featuredPosts[0].post.description}
                imageURL={featuredPosts[0].post.imageURL}
                category={featuredPosts[0].post.category}
                tags={featuredPosts[0].post.tags}
                authorName={`${featuredPosts[0].author.firstName} ${featuredPosts[0].author.lastName}`}
                authorImage={featuredPosts[0].author.profilePic}
                createdAt={featuredPosts[0].post.createdAt}
                views={featuredPosts[0].post.views}
                likes={featuredPosts[0].post.likes}
              />
            </div>
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-8 text-center backdrop-blur-sm shadow-xl">
              <p className="text-xl font-medium text-gray-300">
                No featured stories yet
              </p>
              <p className="mt-2 text-gray-500">
                Check back later for featured content
              </p>
            </div>
          )}
        </section>

        {/* Main Content with Sidebar */}
        <div className="grid gap-6 sm:gap-10 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
          {/* Main Content Area */}
          <div className="lg:col-span-2 xl:col-span-3">
            {/* Latest Posts Section */}
            <section className="mb-12 sm:mb-20">
              <h2 className="mb-6 sm:mb-10 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                <span className="inline-block border-b-2 border-indigo-500 pb-1">
                  Latest Articles
                </span>
              </h2>

              {isPostsLoading ? (
                <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <PostSkeleton count={6} />
                </div>
              ) : postsError ? (
                <div className="rounded-lg bg-red-500/10 p-4 sm:p-8 text-center text-red-500 shadow-lg backdrop-blur-sm">
                  <p className="text-base sm:text-lg font-semibold">
                    Something went wrong
                  </p>
                  <p className="mt-2">{(postsError as Error).message}</p>
                  <Button
                    onClick={() => refetchPosts()}
                    variant="destructive"
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : latestPosts && latestPosts.length > 0 ? (
                <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {latestPosts.map((post: Post) => (
                    <div
                      key={post.post._id}
                      className="transform transition duration-300 hover:scale-[1.03] hover:shadow-xl"
                    >
                      <PostCard
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-8 text-center backdrop-blur-sm shadow-xl">
                  <p className="text-xl font-medium text-gray-300">
                    No posts found
                  </p>
                  <p className="mt-2 text-gray-500">
                    Check back later for new content
                  </p>
                </div>
              )}

              {posts && posts.length > 8 && (
                <div className="mt-8 sm:mt-12 text-center">
                  <Button
                    onClick={() => (window.location.href = "/posts")}
                    variant="outline"
                    className="group border-indigo-600 px-4 sm:px-6 py-3 sm:py-5 text-base sm:text-lg text-indigo-400 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                  >
                    View All Articles
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              )}
            </section>

            {/* Categories Sections */}
            {!isCategoriesLoading &&
              categoriesWithPosts &&
              categoriesWithPosts.slice(0, 3).map((category) => (
                <section key={category.category} className="mb-12 sm:mb-20">
                  <h2 className="mb-6 sm:mb-10 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                    <span className="inline-block border-b-2 border-indigo-500 pb-1">
                      {category.category}
                    </span>
                  </h2>
                  <CategorySection
                    title={category.category}
                    posts={category.posts}
                  />
                </section>
              ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-10">
            {/* Trending Tags Section */}
            {!isTagsLoading && trendingTags && trendingTags.length > 0 && (
              <div className="rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 p-4 sm:p-6 shadow-lg backdrop-blur-sm">
                <TrendingTags tags={trendingTags} />
              </div>
            )}

            {/* Newsletter Section */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-4 sm:p-6 shadow-lg backdrop-blur-sm">
              <Newsletter />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
