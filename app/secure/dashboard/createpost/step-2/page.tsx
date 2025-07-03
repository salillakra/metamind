"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon, MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Editor from "@components/tiptap-editor/Editor";
import { CurrentPost } from "@/store/CurrentPost";
import StepIndicator from "@components/StepIndicator";
import {
  restorePostFromLocalStorage,
  savePostToLocalStorage,
} from "@/lib/localStorageUtils";
import { toast } from "sonner";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [HTMLProp, setHTMLProp] = useState("");
  const router = useRouter();
  const post = CurrentPost.state;

  // Save content to store and localStorage when user clicks continue
  function submitHandler_Content() {
    setLoading(true);

    // Update the content in the store
    CurrentPost.setState((state) => ({
      ...state,
      content: HTMLProp,
    }));

    // Save to localStorage
    savePostToLocalStorage();

    toast.success("Content Saved", {
      description: "Moving to the final step",
    });

    router.push("/secure/dashboard/createpost/step-3");
  }

  // Autosave content every 10 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (HTMLProp) {
        CurrentPost.setState((state) => ({
          ...state,
          content: HTMLProp,
        }));
        savePostToLocalStorage();
      }
    }, 3000);

    return () => clearInterval(autoSaveInterval);
  }, [HTMLProp]);

  useEffect(() => {
    // Try to restore data if not already in store
    if (!post.title) {
      const restored = restorePostFromLocalStorage();

      if (!restored || !CurrentPost.state.title) {
        return redirect("/secure/dashboard/createpost/step-1");
      } else {
        toast.success("Draft Restored", {
          description: "Your previous post draft has been restored",
        });
      }
    }

    // Update the HTMLProp with the current content
    setHTMLProp(post.content);
  }, [post.content, post.title]);

  return (
    <div className="min-h-[90vh] flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 pt-5">
        <StepIndicator currentStep={2} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Editor setHTMLProp={setHTMLProp} initialContent={post.content} />

        <div className="w-full bg-card border-t p-4 flex justify-between items-center">
          <Button
            onClick={() => router.push("/secure/dashboard/createpost/step-1")}
            variant="outline"
            size="default"
          >
            Back
          </Button>

          <Button
            onClick={submitHandler_Content}
            className="flex items-center gap-2"
            size="default"
          >
            {loading ? (
              <>
                <LoaderIcon className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <MoveRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
