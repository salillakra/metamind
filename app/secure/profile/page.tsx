"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { PageTransition } from "@/app/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Spinner from "@/app/components/Spinner";
import StatCard from "@/app/components/StatCard";
import AdminPostCard from "@/app/components/AdminCard";
import ProfileEditForm from "@/app/components/ProfileEditForm";
import { useRouter } from "next/navigation";
import {
  Edit,
  FileText,
  Settings,
  User as UserIcon,
  Mail,
  CalendarDays,
  ArrowRightCircle,
} from "lucide-react";
import type { Post as PostType } from "@/lib/generated/prisma";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user posts
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
    refetch: refetchPosts,
  } = useQuery<PostType[]>({
    queryKey: ["userPosts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const response = await fetch("/api/get-all-author-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: user.id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      return data.posts as PostType[];
    },
    enabled: !!user?.id,
  });

  // Stats for overview
  const totalPosts = posts?.length || 0;
  const publishedPosts = posts?.filter((post) => post.isPublished).length || 0;
  const draftPosts = totalPosts - publishedPosts;

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch("/api/delete-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post");
      }

      // Refetch posts after successful deletion
      refetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (authLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Spinner />
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-500 mb-6">
            Please sign in to view your profile.
          </p>
          <Button onClick={() => router.push("/signin")}>Sign In</Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {isEditing ? (
          <ProfileEditForm
            user={user}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800 mb-8">
            <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 h-40"></div>
            <div className="px-6 py-8 relative">
              <div className="absolute -top-16 left-6 h-32 w-32 border-4 border-gray-800 rounded-full overflow-hidden">
                <Image
                  src={user.imageURL || "/default-image.jpg"}
                  alt={user.username || "User"}
                  width={120}
                  height={120}
                  className="object-cover"
                />
              </div>
              <div className="mt-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {user.firstName
                        ? `${user.firstName} ${user.lastName || ""}`
                        : user.username}
                    </h1>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {user.bio && (
                    <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      <span>{user.role || "Author"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <>
            <Tabs
              defaultValue="overview"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-6 bg-gray-800 border border-gray-700">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  My Posts
                </TabsTrigger>
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Dashboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    title="Total Posts"
                    value={totalPosts.toString()}
                    icon={<FileText className="w-8 h-8 text-purple-400" />}
                  />
                  <StatCard
                    title="Published"
                    value={publishedPosts.toString()}
                    icon={<FileText className="w-8 h-8 text-green-400" />}
                  />
                  <StatCard
                    title="Drafts"
                    value={draftPosts.toString()}
                    icon={<FileText className="w-8 h-8 text-gray-400" />}
                  />
                </div>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Manage your content and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/secure/dashboard/myposts">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>Manage Posts</span>
                          <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/secure/dashboard/new-post">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>Create New Post</span>
                          <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/author/${user.username}`}>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>View Public Profile</span>
                          <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/secure/dashboard/dashboard">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>Go to Dashboard</span>
                          <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts" className="mt-0">
                {postsLoading ? (
                  <div className="flex justify-center items-center min-h-[40vh]">
                    <Spinner />
                  </div>
                ) : postsError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p className="font-bold">Error loading posts</p>
                    <p>Failed to load your posts. Please try again later.</p>
                  </div>
                ) : !posts || posts.length === 0 ? (
                  <div className="text-center py-20 min-h-[40vh]">
                    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        No posts yet
                      </h2>
                      <p className="text-gray-400 mb-6">
                        Start creating content to see your posts here.
                      </p>
                      <Link href="/secure/dashboard/new-post">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Create New Post
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <AdminPostCard
                        key={post.id.toString()}
                        id={post.id.toString()}
                        title={post.title}
                        createdAt={post.createdAt}
                        tags={post.tags}
                        description={post.description}
                        onDelete={handleDeletePost}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dashboard" className="mt-0">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>
                      View analytics and manage your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-10">
                    <Link href="/secure/dashboard">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
