"use client";
import { useParams } from "next/navigation";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Spinner from "@components/Spinner";
import { Eye, Heart, Calendar, Tag, MessageSquare, Share2 } from "lucide-react";
import { updateViews } from "@/Post/UpdateViews";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Navbar from "@components/Navbar";
import { toast } from "sonner";

// Import custom styles for the post content
import "../post-styles.css";
import CommentSection from "@components/CommentSection";
import { useShareDialog, ShareDialogProvider } from "@components/ShareDialog";

interface Author {
  profilePic: string;
  firstName: string;
  lastName: string;
  imageURL?: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  authorId: string;
  likes: number;
  views: number;
  status: string;
  createdAt: Date;
  tags: string[];
  content: string;
  imageURL: string;
  PostStats?: {
    likes: number;
    views: number;
  }[];
}

// Define the fetch function outside the component
const fetchPost = async (
  slug: string
): Promise<{ post: Post; author: Author }> => {
  // Fetch post data
  const response = await fetch(`/api/getpost/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  const data = await response.json();

  // Also fetch post stats - using Promise.all to fetch in parallel
  try {
    const statsResponse = await fetch(`/api/post-stats/${data.post._id}`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData && statsData.stats) {
        data.post.likes = statsData.stats.likes || 0;
        data.post.views = statsData.stats.views || 0;
      }
    }
  } catch (error) {
    console.error("Failed to fetch post stats:", error);
    // Set default values if stats can't be fetched
    data.post.likes = data.post.likes || 0;
    data.post.views = data.post.views || 0;
  }

  return data;
};

const PostPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Use React Query to fetch the post data
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
  });

  // Update views when the post is loaded
  React.useEffect(() => {
    if (slug && !isLoading && data) {
      // Update views
      updateViews(slug);

      // Refresh post stats after updating views
      const refreshStats = async () => {
        try {
          const statsResponse = await fetch(`/api/post-stats/${data.post._id}`);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData && statsData.stats) {
              // Only update views from server if no likes have been made yet
              if (likeCount === null) {
                setLikeCount(statsData.stats.likes || 0);
              }
            }
          }
        } catch (error) {
          console.error("Failed to refresh post stats:", error);
        }
      };

      refreshStats();
    }
  }, [slug, isLoading, data, likeCount]);

  // Handle scroll to show/hide floating stats bar
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 300; // Show after scrolling 300px

      if (scrollPosition > threshold) {
        setShowFloatingBar(true);
      } else {
        setShowFloatingBar(false);
      }

      // Update parallax effect
      if (heroRef.current) {
        setParallaxOffset(scrollPosition * 0.4); // Adjust speed as needed
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle post likes
  const handleLike = async () => {
    if (!data?.post?._id || isLiking) return;

    setIsLiking(true);

    try {
      const response = await fetch("/api/like-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: data.post._id,
          // You can include userId if the user is logged in
          // userId: currentUser.id
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLikeCount(result.likes);
        toast.success("Post liked!", {
          description: "Thank you from Author!",
        });
      }
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Error", {
        description: "Failed to like post. Please try again.",
      });
    } finally {
      setIsLiking(false);
    }
  };

  // Function to handle share
  const { showShareDialog } = useShareDialog();

  const handleShare = () => {
    showShareDialog(`${window.location.origin}/view/${data?.post?._id}`);
  };

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Average reading speed
    const textOnly = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const wordCount = textOnly.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime === 0 ? 1 : readingTime; // Minimum 1 minute
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <Spinner />
      </div>
    );
  }

  // Handle error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Error Loading Post
        </h1>
        <p className="text-gray-300 mb-6">
          {(error as Error)?.message || "Failed to load the post"}
        </p>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  const { author } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            src={data.post?.imageURL || "https://avatar.iran.liara.run/public"}
            alt="Post Cover"
            fill
            className="absolute object-cover opacity-80 transform-gpu"
            priority
            style={{
              objectPosition: "center top",
              transform: `scale(1.2)`,
              filter: "brightness(0.8) contrast(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900/40 to-black/70 mix-blend-overlay"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900" />

        {/* Post Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 max-w-screen-lg mx-auto">
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide hover:bg-indigo-500 transition-colors cursor-pointer">
                {data.post.category}
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(data.post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-1"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {calculateReadingTime(data.post.content)} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              <span className="text-shimmer">{data.post.title}</span>
            </h1>

            {/* Stats Section */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2 hover:bg-gray-800/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-rose-500/20 group focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isLiking
                      ? "animate-pulse"
                      : "group-hover:scale-110 group-hover:animate-pulse"
                  } text-rose-500 fill-rose-500 transition-all duration-300`}
                  fill={likeCount !== null ? "currentColor" : "none"}
                />
                <span className="font-medium">
                  {likeCount !== null ? likeCount : data.post.likes}
                </span>
              </button>
              <div className="flex items-center gap-2 bg-gray-800/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-gray-800/60 transition-all duration-300 transform hover:scale-105">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="font-medium">{data.post.views}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="font-medium">0</span>
              </div>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 bg-indigo-600/80 hover:bg-indigo-500/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-lg mx-auto px-4  relative z-10">
        {/* Author Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl mb-8 flex flex-wrap items-center shadow-xl border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
          <Avatar className="h-16 w-16 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20">
            <AvatarImage
              className="object-cover"
              src={author?.imageURL || ""}
              alt={`${author?.firstName || "Author"}`}
            />
            <AvatarFallback className="bg-indigo-700/50 text-lg">
              {author?.firstName?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-grow">
            <p className="text-gray-400 text-sm">Written by</p>
            <h3 className="text-xl font-medium text-white">
              {`${author?.firstName || ""} ${author?.lastName || ""}`}
            </h3>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-indigo-600 hover:bg-indigo-500"
            >
              Follow
            </Button>
          </div>
        </div>

        {/* Tags */}
        {data.post.tags && data.post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {data.post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-sm font-medium bg-gray-800/70 hover:bg-indigo-600/40 px-3 py-1.5 rounded-full text-gray-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <Tag className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-20">
          <div
            dangerouslySetInnerHTML={{ __html: data.post.content }}
            className="text-gray-200 leading-relaxed"
          />
        </div>

        {/* Comments Section */}
        <CommentSection postId={data.post._id} />
      </div>

      {/* Floating Stats Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-md py-2 sm:py-3 border-t border-gray-800 transform transition-all duration-300 z-50 ${
          showFloatingBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-screen-lg mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1 sm:gap-2 hover:text-rose-400 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-gray-800/50 group"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isLiking ? "animate-pulse" : "group-hover:scale-110"
                } text-rose-500 fill-rose-500 transition-all duration-300`}
                fill={likeCount !== null ? "currentColor" : "none"}
              />
              <span className="font-medium text-sm sm:text-base">
                {likeCount !== null ? likeCount : data.post.likes}
              </span>
            </button>
            <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-800/50 transition-all duration-300">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span className="font-medium text-sm sm:text-base">
                {data.post.views}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-800/50 transition-all duration-300">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="font-medium text-sm sm:text-base">0</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs sm:text-sm p-1 sm:p-2 h-auto focus:ring-2 focus:ring-gray-300/50"
              onClick={handleShare}
            >
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm p-1 sm:p-2 h-auto focus:ring-2 focus:ring-indigo-500/50"
            >
              <span className="hidden sm:inline">Follow</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-20 right-6 p-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 z-50 ${
          showFloatingBar
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  );
};

// Wrap the main component with the ShareDialogProvider
const PostPageWithShareDialog = () => {
  return (
    <ShareDialogProvider>
      <PostPage />
    </ShareDialogProvider>
  );
};

export default PostPageWithShareDialog;
