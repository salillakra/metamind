import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag as TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthorPostCardProps {
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  tags: string[];
  imageURL?: string | null;
  slug: string;
  authorName: string;
  authorImage?: string | null;
}

const UserPostCard = ({
  title,
  description,
  category,
  createdAt,
  tags,
  imageURL,
  slug,
  authorName,
  authorImage,
}: AuthorPostCardProps) => {
  return (
    <Card className="overflow-hidden bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageURL || "/default-image.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        {category && (
          <span className="absolute left-3 top-3 rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white">
            {category}
          </span>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-xl text-white hover:text-purple-400 transition-colors">
          <Link href={`/view/${slug}`}>{title}</Link>
        </CardTitle>
        <CardDescription className="text-gray-400 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full overflow-hidden">
              <Image
                src={authorImage || "/default-image.jpg"}
                alt={authorName}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span>{authorName}</span>
          </div>
          <span className="text-gray-500">•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-gray-300 line-clamp-2 mb-4">{description}</p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-gray-700 text-gray-300 border-gray-600 flex items-center gap-1"
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="bg-gray-700 text-gray-300 border-gray-600"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/view/${slug}`} className="w-full">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Read Post
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default UserPostCard;
