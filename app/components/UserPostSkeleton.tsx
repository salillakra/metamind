import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface UserPostSkeletonProps {
  count?: number;
}

const UserPostSkeleton = ({ count = 4 }: UserPostSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden bg-gray-800/50 border-gray-700 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-40 w-full bg-gray-700/50"></div>

          <CardHeader className="pb-2">
            <div className="h-6 w-3/4 rounded bg-gray-700/50"></div>
            <div className="h-4 w-1/3 rounded bg-gray-700/50 mt-2"></div>
          </CardHeader>

          <CardContent className="pb-2 space-y-3">
            <div className="h-4 w-full rounded bg-gray-700/50"></div>
            <div className="h-4 w-full rounded bg-gray-700/50"></div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              <div className="h-5 w-16 rounded-full bg-gray-700/50"></div>
              <div className="h-5 w-16 rounded-full bg-gray-700/50"></div>
              <div className="h-5 w-16 rounded-full bg-gray-700/50"></div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3">
              <div className="h-4 w-16 rounded bg-gray-700/50"></div>
              <div className="h-4 w-16 rounded bg-gray-700/50"></div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-4 border-t border-gray-700">
            <div className="h-9 w-20 rounded bg-gray-700/50"></div>
            <div className="flex gap-2">
              <div className="h-9 w-20 rounded bg-gray-700/50"></div>
              <div className="h-9 w-9 rounded bg-gray-700/50"></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default UserPostSkeleton;
