"use client";

import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenuprofile } from "./DropdownMenuprofile";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navbarVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.nav
        className="flex relative items-center justify-between bg-base-100 px-6 py-3 shadow-md"
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        {/* Left Section */}
        <motion.div
          className="flex-1 flex items-center"
          variants={itemVariants}
        >
          <Link href="/">
            <Logo className="mr-4" />
          </Link>
        </motion.div>

        {/* Center Section */}
        <motion.div
          className="flex-2 hidden md:flex justify-center"
          variants={itemVariants}
        >
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "300px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-center"
              >
                <Input
                  type="text"
                  placeholder="Search posts, authors, tags..."
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
                  autoFocus
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-2">
                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSearch}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 px-1.5"
                  >
                    <Search size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(true)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Search size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex-1 flex items-center justify-end gap-4"
          variants={itemVariants}
        >
          {user ? (
            <motion.div whileHover={{ scale: 1.05 }}>
              <DropdownMenuprofile userData={user} />
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signin">
                <Button
                  variant="link"
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-full px-6"
                >
                  Login
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.nav>
      <motion.hr
        className="mb-3 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
    </>
  );
}

export default Navbar;
