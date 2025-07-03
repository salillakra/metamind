"use client";

import { LayoutDashboard, LogOut, Pen, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import useLogout from "@/hooks/useLogout";
import type { User as PrismaUser } from "@prisma/client";
import { motion } from "framer-motion";

// Animation variants for menu items
const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
};

export function DropdownMenuprofile({
  userData,
}: {
  userData: PrismaUser | undefined;
}) {
  const router = useRouter();
  const { logout } = useLogout();

  // If userData is undefined, return a fallback or null
  if (!userData) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          className="flex items-center space-x-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={userData.imageURL || "/default-profile.png"}
              alt="Profile Picture"
            />
            <AvatarFallback>
              {userData.firstName ? userData.firstName[0] : "U"}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <motion.div
            custom={0}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <DropdownMenuItem onClick={() => router.push("/secure/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <motion.div
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <DropdownMenuItem
            onClick={() => router.push("/secure/dashboard/createpost/step-1")}
          >
            <Pen className="mr-2 h-4 w-4" />
            <span>Create Post</span>
          </DropdownMenuItem>
        </motion.div>
        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <DropdownMenuItem
            onClick={() => router.push("/secure/dashboard/myposts")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>My Posts</span>
          </DropdownMenuItem>
        </motion.div>
        <motion.div
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <DropdownMenuItem
            onClick={() => router.push(`/author/${userData.username}`)}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Public Profile</span>
          </DropdownMenuItem>
        </motion.div>
        <DropdownMenuSeparator />
        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
