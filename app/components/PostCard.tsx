import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Post {
  title: string;
  category: string;
  imageURL: string;
  tags: string[];
  description: string;
  createdAt: Date;
  profilePic: string;
  firstName: string;
  lastName: string;
  link: string;
  views: number;
  likes: number;
}

const PostCard = ({
  link,
  title,
  category,
  imageURL,
  tags,
  views,
  description,
  createdAt,
  profilePic,
  firstName,
  lastName,
  likes,
}: Post) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(link);
  };

  return (
    <div
      onClick={handlePostClick}
      className="group w-full overflow-hidden rounded-xl bg-gray-800/50 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/70 hover:shadow-indigo-500/10 sm:max-w-md cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden sm:h-56">
        <Image
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          src={imageURL}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {category}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
          {title}
        </h2>
        <p className="text-sm text-gray-400 line-clamp-2">{description}</p>

        {/* User Info */}
        <div className="mt-2 flex items-center gap-3">
          <Avatar className="border-2 border-indigo-500/30">
            <AvatarImage
              className="object-cover"
              src={profilePic}
              alt={`${firstName} profile pic`}
            />
            <AvatarFallback className="bg-indigo-700/50">
              {firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-white">
              {firstName} {lastName}
            </p>
            <p className="text-gray-400 text-xs">
              {new Date(createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-between border-t border-gray-700/50 px-4 py-3">
        <div className="flex items-center gap-1 text-gray-400">
          <Heart className="h-4 w-4 text-rose-500" />
          <span className="text-xs font-medium">{likes}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Eye className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-medium">{views}</span>
        </div>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-gray-700/50 px-4 py-2">
          {tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-gray-700/50 px-2 py-0.5 rounded-md text-gray-300"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded-md text-gray-300">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
