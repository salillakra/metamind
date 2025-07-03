"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Post as PostType } from "@/lib/generated/prisma";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PageTransition } from "@components/PageTransition";
import AuthorPostCard from "@components/AuthorPostCard";
import { FileText, Mail, User as UserIcon } from "lucide-react";
import Spinner from "@components/Spinner";
import UserPostSkeleton from "@components/UserPostSkeleton";

const AuthorProfilePage = () => {
  const params = useParams();
  const username = params.username as string;

  // Fetch author profile
  const {
    data: author,
    isLoading: authorLoading,
    isError: authorError,
  } = useQuery<User>({
    queryKey: ["author", username],
    queryFn: async () => {
      const response = await fetch(
        `/api/author/${encodeURIComponent(username)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch author profile");
      }
      return response.json();
    },
  });

  // Fetch author posts
  const {
    data: authorPosts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery<PostType[]>({
    queryKey: ["authorPosts", username],
    queryFn: async () => {
      const response = await fetch(
        `/api/author/${encodeURIComponent(username)}/posts`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch author posts");
      }
      return response.json();
    },
    enabled: !!author,
  });

  if (authorLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Spinner />
        </div>
      </PageTransition>
    );
  }

  if (authorError || !author) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Author Not Found
          </h1>
          <p className="text-gray-500">
            The author profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800 mb-8">
          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 h-40"></div>
          <div className="px-6 py-8 relative">
            <div className="absolute -top-16 left-6 h-32 w-32 border-4 border-gray-800 rounded-full overflow-hidden">
              <Image
                src={author.imageURL || "/default-image.jpg"}
                alt={author.username || "Author"}
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
            <div className="mt-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {author.firstName
                      ? `${author.firstName} ${author.lastName || ""}`
                      : author.username}
                  </h1>
                  <p className="text-gray-400">@{author.username}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {author.bio && (
                  <p className="text-gray-300 leading-relaxed">{author.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <span>
                      Joined {new Date(author.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {author.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{author.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          Posts by {author.username}
        </h2>

        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <UserPostSkeleton key={i} />
            ))}
          </div>
        ) : postsError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <p>Failed to load posts</p>
          </div>
        ) : !authorPosts || authorPosts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400">
              This author hasn&apos;t published any posts yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorPosts.map((post) => (
              <AuthorPostCard
                key={post.id.toString()}
                title={post.title}
                description={post.description}
                category={post.category || ""}
                createdAt={post.createdAt}
                tags={post.tags}
                imageURL={post.imageURL}
                authorName={author.username}
                authorImage={author.imageURL}
                slug={post.id.toString()}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AuthorProfilePage;
