/*
© 2024 Salil Lakra. All rights reserved.
This content is protected by copyright law and may not be reproduced, distributed, or otherwise used without permission.
*/

"use client";

import { Button } from "@/components/ui/button";
import { savePostToLocalStorage } from "@/lib/localStorageUtils";
import { tagsStore } from "@/store/Tags";
import { CurrentPost } from "@/store/CurrentPost";
import { useStore } from "@tanstack/react-store";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tag = ({
  tag,
  index,
  tags,
}: {
  tag: string;
  index: number;
  tags: string[];
}) => {
  const DeleteTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    tagsStore.setState((state) => {
      return {
        ...state,
        tags: newTags,
      };
    });

    // Update CurrentPost store with the updated tags
    CurrentPost.setState((state) => ({
      ...state,
      tags: newTags,
    }));

    // Save to localStorage after deleting tag
    savePostToLocalStorage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-r from-purple-900 to-violet-800 p-2 rounded-md flex items-center gap-2 shadow-md"
    >
      <div>
        <span className="text-gray-300">#</span>
        <span className="text-white font-medium">{tag}</span>
      </div>
      <motion.button
        whileHover={{ backgroundColor: "rgba(30, 30, 46, 0.8)", scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => DeleteTag(index)}
        className="transition-all p-1 rounded-lg"
      >
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Delete Tag</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

const TagPicker = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isTagsAvailable, setIsTagsAvailable] = useState<boolean>(false);
  const tags = useStore(tagsStore, (state) => state.tags);

  useEffect(() => {
    // Check if tags are available
    const setTags = async () => {
      const tagsString = localStorage.getItem("metamind_draft_post");
      const tags = tagsString ? JSON.parse(tagsString).tags : [];

      tagsStore.setState((state) => {
        return {
          ...state,
          tags: tags,
        };
      });
    };
    setTags();
    setIsTagsAvailable(tags.length > 0);
  }, [tags]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue === "") return;
    tagsStore.setState((state) => {
      return {
        ...state,
        tags: [...state.tags, inputValue],
      };
    });

    console.log("Tags after adding:", tagsStore.state.tags);

    // Update CurrentPost store with the tags
    CurrentPost.setState((state) => ({
      ...state,
      tags: tagsStore.state.tags,
    }));

    // Save to localStorage
    savePostToLocalStorage();
    setInputValue("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center h-fit w-full"
    >
      <motion.div
        className="p-4 flex flex-col bg-primary-foreground rounded-lg shadow-lg border border-purple-800/20"
        whileHover={{ boxShadow: "0 8px 30px rgba(120, 0, 255, 0.1)" }}
      >
        <div className="mb-2">
          <h3 className="text-lg font-medium text-purple-300">Tags</h3>
          {isTagsAvailable ? (
            <p className="text-xs text-gray-400">Click on a tag to remove it</p>
          ) : (
            <p className="text-xs text-gray-400">
              Add some tags to categorize your post
            </p>
          )}
        </div>

        <AnimatePresence>
          <div className="flex gap-2 flex-wrap min-h-10">
            {tags.length !== 0 &&
              tags.map((tag, index) => (
                <Tag
                  key={`tag-${index}-${tag}`}
                  tags={tags}
                  index={index}
                  tag={tag}
                />
              ))}
          </div>
        </AnimatePresence>

        <motion.form
          onSubmit={(e) => submitHandler(e)}
          className="mt-4"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="relative">
            <motion.input
              placeholder="Enter tag and press Add"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-primary-foreground w-full p-3 rounded-md border border-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              whileFocus={{ scale: 1.01 }}
            />
            <Button
              variant={"secondary"}
              type="submit"
              className="mt-2 w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white"
            >
              Add Tag
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default TagPicker;
