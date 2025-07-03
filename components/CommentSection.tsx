"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CldImage } from "next-cloudinary";

const FormSchema = z.object({
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }),
});

type CommentServer = {
  author: {
    firstName: string | null;
    lastName: string | null;
    imageURL: string | null;
  } | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  authorId: string | null;
  postId: string;
  likes: number;
  dislikes: number;
  replies: Array<{
    author: {
      firstName: string | null;
      lastName: string | null;
      imageURL: string | null;
    } | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    authorId: string | null;
    likes: number;
    dislikes: number;
    commentId: string;
  }>;
};

const CommentSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<CommentServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-all-comments/${postId}`);
        const data = await response.json();

        if (data.success) {
          setComments(data.comments);
        } else {
          toast("Error fetching comments", {
            description: data.error || "Failed to load comments",
          });
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast("Error", {
          description: "Failed to load comments. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to comment on this post.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data.comment,
          postId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast("Comment posted", {
          description: "Your comment has been posted successfully.",
        });

        // Add the new comment to the list
        setComments((prev) => [{ ...result.comment, replies: [] }, ...prev]);

        // Reset the form
        form.reset();
      } else {
        toast("Error", {
          description: result.error || "Failed to post comment",
        });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast("Error", {
        description: "Failed to post your comment. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="pb-32">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {!user && !loading ? (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-gray-700">
            Please{" "}
            <Link
              href={`/signin?redirect=${encodeURIComponent(
                window.location.href
              )}`}
              className="text-blue-600 hover:underline"
            >
              sign in
            </Link>{" "}
            to comment on this post.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write your comment here..."
                      className="resize-y min-h-32"
                      {...field}
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting ? "Posting..." : "Submit"}
            </Button>
          </form>
        </Form>
      )}

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center my-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface UserType {
  id?: string;
  _id?: string; // Supporting both formats
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  username: string;
  profilePic?: string;
  imageURL?: string | null; // Alternative to profilePic
  bio?: string | null;
  gender?: string | null;
  isAdmin?: boolean;
  role?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown; // For any other properties from the auth system
}

interface CommentItemProps {
  comment: CommentServer;
  postId: string;
  currentUser: UserType | null;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUser }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes);

  const handleLikeComment = async () => {
    if (!currentUser) {
      toast("Authentication required", {
        description: "Please sign in to like this comment.",
      });
      return;
    }

    try {
      const response = await fetch("/api/like-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: comment.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLocalLikes(result.likes);
      } else {
        toast("Error", {
          description: result.error || "Failed to like comment",
        });
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast("Authentication required", {
        description: "Please sign in to reply to this comment.",
      });
      return;
    }

    if (replyContent.trim().length < 5) {
      toast("Reply too short", {
        description: "Reply must be at least 5 characters long.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comment-replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent,
          commentId: comment.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast("Reply posted", {
          description: "Your reply has been posted successfully.",
        });

        // Add the reply locally (would be better to refetch, but this is simpler for now)
        comment.replies.push(result.reply);

        // Reset state
        setReplyContent("");
        setShowReplyForm(false);
        setShowReplies(true);
      } else {
        toast("Error", {
          description: result.error || "Failed to post reply",
        });
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast("Error", {
        description: "Failed to post your reply. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const authorName = comment.author
    ? `${comment.author.firstName || ""} ${
        comment.author.lastName || ""
      }`.trim()
    : "Anonymous";

  const profilePic =
    comment.author?.imageURL || "https://avatar.iran.liara.run/public";
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-start space-x-4 mb-6">
      <CldImage
        height={40}
        width={40}
        src={profilePic}
        alt={`${authorName}'s profile`}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{authorName}</span>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <div className="mt-1">{comment.content}</div>
        <div className="flex items-center space-x-4 mt-2">
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-gray-500 hover:text-blue-600 focus:outline-none p-0 h-auto"
            onClick={handleLikeComment}
            disabled={!currentUser}
          >
            👍 {localLikes > 0 ? localLikes : "Like"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-gray-500 hover:text-blue-600 focus:outline-none p-0 h-auto"
            onClick={() => setShowReplyForm(!showReplyForm)}
            disabled={!currentUser}
          >
            💬 Reply
          </Button>
          {comment.replies.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-500 hover:text-blue-600 focus:outline-none p-0 h-auto"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? "Hide replies"
                : `Show ${comment.replies.length} replies`}
            </Button>
          )}
        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Reply"}
            </Button>
          </form>
        )}

        {showReplies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ReplyItemProps {
  reply: CommentServer["replies"][0];
  currentUser: UserType | null;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, currentUser }) => {
  const [replyLikes, setReplyLikes] = useState(reply.likes);

  const replyAuthorName = reply.author
    ? `${reply.author.firstName || ""} ${reply.author.lastName || ""}`.trim()
    : "Anonymous";
  const replyProfilePic =
    reply.author?.imageURL || "https://avatar.iran.liara.run/public";
  const replyTimeAgo = formatDistanceToNow(new Date(reply.createdAt), {
    addSuffix: true,
  });

  const handleLikeReply = async () => {
    if (!currentUser) {
      toast("Authentication required", {
        description: "Please sign in to like this reply.",
      });
      return;
    }

    try {
      const response = await fetch("/api/like-comment-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replyId: reply.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setReplyLikes(result.likes);
      } else {
        toast("Error", {
          description: result.error || "Failed to like reply",
        });
      }
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <Image
        height={32}
        width={32}
        src={replyProfilePic}
        alt={`${replyAuthorName}'s profile`}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{replyAuthorName}</span>
          <span className="text-xs text-gray-500">{replyTimeAgo}</span>
        </div>
        <div className="mt-1 text-sm">{reply.content}</div>
        <div className="flex items-center space-x-4 mt-1">
          <Button
            type="button"
            variant="ghost"
            className="text-xs text-gray-500 hover:text-blue-600 focus:outline-none p-0 h-auto"
            onClick={handleLikeReply}
            disabled={!currentUser}
          >
            👍 {replyLikes > 0 ? replyLikes : "Like"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
