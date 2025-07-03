"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-store";
import { tagsStore } from "@/store/Tags";
import TagPicker from "@components/TagPicker";
import { CurrentPost } from "@/store/CurrentPost";
import { CreatePost } from "@/Post/action";
import { redirect, useRouter } from "next/navigation";
import StepIndicator from "@components/StepIndicator";
import {
  clearPostFromLocalStorage,
  restorePostFromLocalStorage,
  savePostToLocalStorage,
} from "@/lib/localStorageUtils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const TagMenu = () => {
  const tags = useStore(tagsStore, (state) => state.tags);
  const Post = useStore(CurrentPost, (state) => state);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SaveTags = () => {
    CurrentPost.setState((state) => {
      return {
        ...state,
        tags: tags,
      };
    });

    // Save to localStorage
    savePostToLocalStorage();
  };

  const PublishThePost = async () => {
    setIsSubmitting(true);

    CurrentPost.setState((state) => {
      return {
        ...state,
        isPublished: true,
      };
    });

    // Final save to localStorage before submission
    savePostToLocalStorage();

    try {
      const response = await CreatePost(Post);
      if (response.success) {
        // Clear localStorage after successful post creation
        clearPostFromLocalStorage();

        toast.success("Post created successfully", {
          description: "Your post is now live",
        });

        // Redirect to home page after successful submission
        router.push("/secure/dashboard");
      } else {
        toast.error("Failed to create post", {
          description: response.error,
        });
      }
    } catch (error: unknown) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const DraftThePost = async () => {
    setIsSubmitting(true);

    CurrentPost.setState((state) => {
      return {
        ...state,
        isPublished: false,
      };
    });

    // Final save to localStorage before submission
    savePostToLocalStorage();

    try {
      const response = await CreatePost(Post);
      if (response.success) {
        // Clear localStorage after successful draft creation
        clearPostFromLocalStorage();

        toast.success("Post Drafted successfully", {
          description: "Your post is now saved as a draft",
        });

        // Redirect to home page after successful submission
        router.push("/secure/dashboard");
      } else {
        toast.error("Failed to save post as draft", {
          description: response.error,
        });
      }
    } catch (error: unknown) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Try to restore data if not already in store
    if (!Post.title || !Post.content) {
      const restored = restorePostFromLocalStorage();

      if (!restored) {
        if (!Post.content) {
          return redirect("/secure/dashboard/createpost/step-2");
        } else if (!Post.title) {
          return redirect("/secure/dashboard/createpost/step-1");
        }
      }
    }
  }, [Post.content, Post.title]);

  return (
    <div className="min-h-[90vh] py-5 overflow-y-auto">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl px-4">
          <StepIndicator currentStep={3} />

          <AlertDialog>
            <div className="relative mt-4 grid place-items-center w-full">
              <Card className="sm:w-96 w-full">
                <CardHeader>
                  <CardTitle>Add tags to your post</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagPicker />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push("/secure/dashboard/createpost/step-2")
                      }
                    >
                      Back
                    </Button>

                    <AlertDialogTrigger asChild>
                      <Button onClick={() => SaveTags()}>Publish Post</Button>
                    </AlertDialogTrigger>
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      SaveTags();
                      DraftThePost();
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving as Draft...
                      </>
                    ) : (
                      "Save as Draft"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you ready to publish?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will make your post visible to everyone. You can still
                  edit it later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={PublishThePost}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Now"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default TagMenu;
