import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag, Trash2 } from "lucide-react";
import React, { useState } from "react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface AdminPost {
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  className?: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  id?: string;
}

const AdminPostCard = ({
  className,
  title,
  description,
  tags,
  createdAt,
  id,
  onDelete,
  isDeleting,
}: AdminPost) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        className={`w-full max-w-full sm:max-w-lg bg-gray-900 border border-gray-700 rounded-lg shadow-md ${className}`}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-white truncate">
              {title}
            </CardTitle>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-gray-400 hover:text-rose-500 transition-colors"
              aria-label="Delete post"
              disabled={isDeleting}
            >
              <Trash2
                className={`w-5 h-5 ${isDeleting ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
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
            Created on{" "}
            {new Date(createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            at{" "}
            {new Date(createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        title={title}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdminPostCard;
