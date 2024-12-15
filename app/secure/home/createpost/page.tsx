"use client";

import Editor from "@/app/components/Editor";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const Page = () => {
    const [markdown, setMarkdown] = React.useState("");

    return (
        <div className="flex h-screen">
            <div className="w-1/2 h-screen">
                <Editor setMarkdown={setMarkdown} id="editor" />
            </div>
            <div className="w-1/2 border-l-2 border-gray-200">
                <h1 className="text-4xl font-bold text-center p-4">Preview</h1>
                <div className="p-4 overflow-auto markdown-preview">
                    <Markdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                    >{markdown}</Markdown>
                </div>
            </div>
        </div>
    );
};

export default Page;
