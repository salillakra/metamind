"use client";

import { Menu, Pen, StickyNote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/app/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/app/components/Spinner";
import Hamburgur from "@/app/components/Hamburgur";
import { DropdownMenuprofile } from "@/app/components/DropdownMenuprofile"; // Import here

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col relative h-screen overflow-hidden">
      <Hamburgur isOpen={isOpen} setOpen={setOpen} />

      <div className="flex justify-between items-center p-4 bg-primary-foreground text-white">
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setOpen(!isOpen);
            }
          }}
          onClick={() => setOpen(!isOpen)}
          className="md:hidden cursor-pointer hover:scale-110 transition-transform duration-200"
        >
          <Menu />
        </div>

        <Logo />
        <div>{user && <DropdownMenuprofile user={user} />}</div>
      </div>
      <div className="flex">
        {loading && <Spinner />}
        <div className="flex-col hidden md:flex items-center justify-start">
          <div className="w-64 bg-primary-foreground border-t border-gray-500 text-white h-[90vh]">
            <div className="flex justify-start items-center p-4 bg-primary-foregroundtext-white">
              <span className="text-md">
                Welcome, {`${user?.firstName || ""} ${user?.lastName || ""}`}!
                🚀
              </span>
            </div>
            <div className="pt-2 border-t font-thin text-md border-gray-500">
              <div
                className={`cursor-pointer hover:bg-slate-900 transition-all px-4 py-2 ${
                  index === 0 ? "bg-slate-800" : ""
                }`}
                onClick={() => setIndex(0)}
              >
                <Link
                  className="flex gap-2 items-center"
                  href="/secure/home/myposts"
                >
                  <StickyNote />
                  My Posts
                </Link>
              </div>
              <div
                className={`cursor-pointer hover:bg-slate-900 transition-all px-4 py-2 ${
                  index === 1 ? "bg-slate-800" : ""
                }`}
                onClick={() => setIndex(1)}
              >
                <Link
                  className="flex gap-2 items-center"
                  href="/secure/home/createpost"
                >
                  <Pen />
                  Create Post
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
