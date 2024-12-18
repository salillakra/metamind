"use client";

import { Pen, StickyNote } from "lucide-react";
import Link from "next/link";

import { LogOut, User } from "lucide-react";
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
import Logo from "@/app/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";

function DropdownMenuprofile() {
	const { logout } = useLogout();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center space-x-2 cursor-pointer">
					<Avatar>
						<AvatarImage src="/image.png" alt="@doggy" />
						<AvatarFallback>DG</AvatarFallback>
					</Avatar>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User />
						<span>Profile</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout}>
					<LogOut />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
interface LayoutProps {
	children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
	const { user, loading } = useAuth();

	return (
		<div>
			<div className="flex justify-between items-center p-4 bg-slate-950 text-white">
				<Logo />
				<div>
					<DropdownMenuprofile />
				</div>
			</div>
			<div className="flex">
				<div className="flex-col hidden md:flex items-center justify-start">
					<div className="w-64 bg-slate-950  border-t border-gray-500 text-white h-[90vh]">
						<div className="flex justify-start items-center p-4 bg-slate-950 text-white">
							{loading ? (
								<div className="animate-pulse "> Loading...</div>
							) : (
								<span className="text-md">Welcome, {user?.username}! 🚀</span>
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
