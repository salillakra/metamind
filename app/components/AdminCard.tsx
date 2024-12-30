import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import React from "react";

interface AdminPost {
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
}

const AdminPostCard = ({
  title,
  description,
  tags,
  createdAt,
}: AdminPost) => {
  return (
    <Card className="w-full sm:max-w-lg bg-gray-900 border border-gray-700 rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white truncate">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-400 line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full hover:bg-purple-700 hover:text-white transition-colors"
            >
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          Created on {new Date(createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })} at {new Date(createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPostCard;
