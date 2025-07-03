import React from "react";

const FeaturedPostSkeleton = () => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/70 animate-pulse md:flex-row">
      {/* Image skeleton */}
      <div className="relative h-64 w-full bg-gray-700/50 md:h-auto md:w-1/2 xl:w-3/5"></div>

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col justify-between p-6 space-y-4 md:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 rounded-full bg-gray-700/50"></div>
            <div className="flex gap-3">
              <div className="h-4 w-12 rounded bg-gray-700/50"></div>
              <div className="h-4 w-12 rounded bg-gray-700/50"></div>
            </div>
          </div>

          <div className="h-8 w-3/4 rounded bg-gray-700/50"></div>
          <div className="h-8 w-1/2 rounded bg-gray-700/50"></div>

          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-700/50"></div>
            <div className="h-4 w-full rounded bg-gray-700/50"></div>
            <div className="h-4 w-3/4 rounded bg-gray-700/50"></div>
          </div>

          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-700/50"></div>
            <div className="h-6 w-16 rounded-full bg-gray-700/50"></div>
            <div className="h-6 w-16 rounded-full bg-gray-700/50"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-700/50"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-700/50"></div>
              <div className="h-3 w-16 rounded bg-gray-700/50"></div>
            </div>
          </div>

          <div className="h-9 w-28 rounded bg-gray-700/50"></div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostSkeleton;
