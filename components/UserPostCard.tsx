import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Clock, Edit, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

export interface UserPostProps {
  id: string;
  title: string;
  description: string;
  category: string | null;
  imageURL: string | null;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  stats: {
    views: number;
    likes: number;
  };
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
}

const UserPostCard = ({
  id,
  title,
  description,
  category,
  imageURL,
  tags,
  isPublished,
  isFeatured,
  createdAt,
  stats,
  onDelete,
  onPreview,
  onEdit,
}: UserPostProps) => {
  const handlePreview = () => {
    onPreview(id);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/10 bg-gray-800/50 border-gray-700 text-white">
      {/* Status indicators */}
      <div className="absolute right-2 top-2 flex gap-2 z-10">
        {isFeatured && (
          <Badge className="bg-amber-600 hover:bg-amber-700">Featured</Badge>
        )}
        <Badge
          className={
            isPublished
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 hover:bg-gray-700"
          }
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={imageURL || "https://avatar.iran.liara.run/public"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {category && (
          <span className="absolute left-2 top-2 rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
            {category}
          </span>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
        <CardDescription className="text-gray-400 flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {new Date(createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-gray-700/50 text-gray-300 border-gray-600"
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="bg-gray-700/50 text-gray-300 border-gray-600"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-emerald-500" />
            <span>{stats.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-rose-500" />
            <span>{stats.likes}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t border-gray-700">
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="border-gray-600 hover:bg-gray-700"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            variant="outline"
            size="sm"
            className="border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isPublished ? "View" : "Preview"}
          </Button>

          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="border-rose-600 text-rose-400 hover:bg-rose-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserPostCard;
