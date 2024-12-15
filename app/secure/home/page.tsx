"use client";

import { Pen, StickyNote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

const Dashboard = () => {
  const [data, setData] = useState<User>();
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    const response = await fetch("/api/user", { method: "GET" });
    if (response.ok) {
      setLoading(false);
      const user = await response.json();
      setData(user);
    } else {
      console.error("Failed to get user");
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="min-w-60 bg-slate-950  border-t border-gray-500 text-white h-[90vh]">
        <div className="flex justify-start items-center p-4 bg-slate-950 text-white">
          {loading ? (
            <div className="animate-pulse "> Loading...</div>
          ) : (
            <span className="text-md">Welcome, {data?.username}! 🚀</span>
          )}
        </div>
        <div className="pt-2 border-t border-gray-500">
          <div className=" cursor-pointer hover:bg-slate-900 transition-all px-4 py-2">
            <Link
              className="flex gap-2 items-center"
              href="secure/home/my-Posts"
            >
              <StickyNote />
              My Posts
            </Link>
          </div>
          <div className=" cursor-pointer hover:bg-slate-900 transition-all px-4 py-2">
            <Link
              className="flex gap-2 items-center"
              href="secure/home/create-Post"
            >
              <Pen />
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
