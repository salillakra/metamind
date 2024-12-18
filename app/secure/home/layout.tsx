"use client";

import { Menu, Pen, StickyNote } from "lucide-react";
import Link from "next/link";
import { createContext, useState } from "react";
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
import Spinner from "@/app/components/Spinner";
import Hamburgur from "@/app/components/Hamburgur";

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

// PostData context
export const PostData = createContext<{
	title: string;
	category: string;
	setPost: React.Dispatch<
		React.SetStateAction<{ title: string; category: string }>
	>;
}>({
	title: "",
	category: "",
	setPost: () => {},
});

const Layout = ({ children }: LayoutProps) => {
	const { user, loading } = useAuth();
	const [post, setPost] = useState({ title: "", category: "" });
	const [isOpen, setOpen] = useState<boolean>(false);
	return (
		<div className="flex flex-col relative">
			<Hamburgur isOpen={isOpen} setOpen={setOpen} />

			<div className="flex justify-between items-center p-4 bg-slate-950 text-white">
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
				<div>
					<DropdownMenuprofile />
				</div>
			</div>
			<div className="flex">
				{loading && <Spinner />}
				<div className="flex-col hidden md:flex items-center justify-start">
					<div className="w-64 bg-slate-950  border-t border-gray-500 text-white h-[90vh]">
						<div className="flex justify-start items-center p-4 bg-slate-950 text-white">
							{<span className="text-md">Welcome, {user?.firstName}! 🚀</span>}
						</div>
						<div className="pt-2 border-t font-thin text-md border-gray-500">
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
				<PostData.Provider
					value={{ title: post.title, category: post.category, setPost }}
				>
					<div className="w-full">{children}</div>
				</PostData.Provider>
			</div>
		</div>
	);
};

export default Layout;
