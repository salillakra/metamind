import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface TrendingTagsProps {
  tags: Array<{ tag: string; count: number }>;
}

const TrendingTags = ({ tags }: TrendingTagsProps) => {
  const router = useRouter();

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-gray-800/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            className="rounded-full border-gray-700 bg-gray-700/30 text-gray-300 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
            onClick={() => router.push(`/search?tag=${tag}`)}
          >
            #{tag} <span className="ml-1 text-xs text-gray-400">({count})</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags;
