import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedPostProps {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  category: string;
  tags: string[];
  authorName: string;
  authorImage: string;
  createdAt: Date;
  views: number;
  likes: number;
}

const FeaturedPost = ({
  id,
  title,
  description,
  imageURL,
  category,
  tags,
  authorName,
  authorImage,
  createdAt,
  views,
  likes,
}: FeaturedPostProps) => {
  const router = useRouter();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/70 transition-all duration-300 hover:from-gray-800/60 hover:to-gray-900/90 md:flex-row">
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-1/2 xl:w-3/5">
        <Image
          src={imageURL}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-medium text-white">
              {category}
            </span>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-emerald-500" />
                <span>{views}</span>
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-indigo-400 md:text-3xl">
            {title}
          </h2>

          <p className="mb-6 text-gray-300 line-clamp-3 md:line-clamp-4">
            {description}
          </p>

          {tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-indigo-500/30">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback className="bg-indigo-700/50">
                {authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">{authorName}</p>
              <p className="text-xs text-gray-400">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push(`/view/${id}`)}
            variant="outline"
            className="border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white"
          >
            Read Article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
