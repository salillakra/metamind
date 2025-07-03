import React from "react";

interface PostSkeletonProps {
  count?: number;
}

const PostSkeleton = ({ count = 4 }: PostSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full overflow-hidden rounded-xl bg-gray-800/30 shadow-xl animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 w-full bg-gray-700/50 sm:h-56"></div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-6 w-3/4 rounded bg-gray-700/50"></div>

            {/* Description */}
            <div className="h-4 w-full rounded bg-gray-700/50"></div>
            <div className="h-4 w-full rounded bg-gray-700/50"></div>

            {/* User info */}
            <div className="mt-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-700/50"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-700/50"></div>
                <div className="h-3 w-16 rounded bg-gray-700/50"></div>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="border-t border-gray-700/30 px-4 py-3 flex justify-between">
            <div className="h-4 w-12 rounded bg-gray-700/50"></div>
            <div className="h-4 w-12 rounded bg-gray-700/50"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostSkeleton;
