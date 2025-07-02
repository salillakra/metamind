"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import StatCard from "@/app/components/StatCard";
import UserPostCard from "@/app/components/UserPostCard";
import UserPostSkeleton from "@/app/components/UserPostSkeleton";
import DeleteConfirmDialog from "@/app/components/DeleteConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FilePenLine, Eye, Heart, ListFilter, Plus } from "lucide-react";
import { deletePost } from "@/Post/delete";
import { toast } from "@/app/components/simple-toast";

interface Post {
  id: string;
  title: string;
  description: string;
  category: string | null;
  imageURL: string | null;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  stats: {
    views: number;
    likes: number;
  };
}

// API fetch functions
const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  if (!userId) return [];

  const response = await fetch("/api/get-all-author-posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ authorId: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();
  return data.posts || [];
};

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Fetch user posts
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userPosts", user?.id],
    queryFn: () => fetchUserPosts(user?.id || ""),
    enabled: !!user?.id,
  });

  // Filter posts based on active tab
  const filteredPosts = posts?.filter((post) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return post.isPublished;
    if (activeTab === "drafts") return !post.isPublished;
    if (activeTab === "featured") return post.isFeatured;
    return true;
  });

  // Calculate stats
  const totalPosts = posts?.length || 0;
  const publishedPosts = posts?.filter((post) => post.isPublished).length || 0;
  const draftPosts = posts?.filter((post) => !post.isPublished).length || 0;
  const totalViews =
    posts?.reduce((sum, post) => sum + (post.stats.views || 0), 0) || 0;
  const totalLikes =
    posts?.reduce((sum, post) => sum + (post.stats.likes || 0), 0) || 0;

  const handleCreatePost = () => {
    router.push("/secure/create-post");
  };

  const handleEditPost = (postId: string) => {
    router.push(`/secure/edit-post/${postId}`);
  };

  const handlePreviewPost = (postId: string) => {
    router.push(`/view/${postId}`);
  };

  const handleDeleteClick = (postId: string, postTitle: string) => {
    setPostToDelete({ id: postId, title: postTitle });
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      const result = await deletePost(postToDelete.id);

      if (result.success) {
        toast({
          title: "Post Deleted",
          description: "Your post has been successfully deleted.",
          variant: "default",
        });

        // Refetch posts to update the UI
        refetch();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-400">
          Please sign in to access your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-gray-400">
            Manage your blog posts and track performance
          </p>
        </div>

        <Button
          onClick={handleCreatePost}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={<Book className="h-5 w-5" />}
          description="All your posts"
        />
        <StatCard
          title="Published"
          value={publishedPosts}
          icon={<FilePenLine className="h-5 w-5" />}
          description={`${
            totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0
          }% of your posts`}
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          icon={<Eye className="h-5 w-5" />}
          description="Across all posts"
        />
        <StatCard
          title="Total Likes"
          value={totalLikes}
          icon={<Heart className="h-5 w-5" />}
          description="Across all posts"
        />
      </div>

      {/* Posts Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-800 text-gray-400">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              All Posts
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Drafts
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Featured
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center text-sm text-gray-400">
            <ListFilter className="mr-2 h-4 w-4" />
            {filteredPosts ? filteredPosts.length : 0} posts
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <PostsGrid />
        </TabsContent>
        <TabsContent value="published" className="mt-6">
          <PostsGrid />
        </TabsContent>
        <TabsContent value="drafts" className="mt-6">
          <PostsGrid />
        </TabsContent>
        <TabsContent value="featured" className="mt-6">
          <PostsGrid />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      {postToDelete && (
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          title={postToDelete.title}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );

  // Helper component for the posts grid
  function PostsGrid() {
    if (isLoading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <UserPostSkeleton count={8} />
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }

    if (!filteredPosts || filteredPosts.length === 0) {
      return (
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg bg-gray-800/50 p-8 text-center">
          <p className="text-xl font-medium text-gray-400">No posts found</p>
          <p className="mt-2 text-gray-500">
            {activeTab === "all"
              ? "You haven't created any posts yet"
              : activeTab === "published"
              ? "You don't have any published posts"
              : activeTab === "drafts"
              ? "You don't have any draft posts"
              : "You don't have any featured posts"}
          </p>
          <Button
            onClick={handleCreatePost}
            variant="outline"
            className="mt-6 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPosts.map((post) => (
          <UserPostCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            category={post.category}
            imageURL={post.imageURL}
            tags={post.tags}
            isPublished={post.isPublished}
            isFeatured={post.isFeatured}
            createdAt={post.createdAt}
            stats={post.stats}
            onDelete={(id) => handleDeleteClick(id, post.title)}
            onPreview={handlePreviewPost}
            onEdit={handleEditPost}
          />
        ))}
      </div>
    );
  }
};

export default Dashboard;
