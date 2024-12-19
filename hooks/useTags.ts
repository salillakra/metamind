"use client";
import { useState } from "react";

export const useTags = () => {
    const [tags, setTags] = useState<string[]>([]);
    return { tags, setTags };
};
