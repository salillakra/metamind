"use client";

import { BadgePlus, Menu, Pen, StickyNote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { useRouter } from "next/navigation";

interface IUSER {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	profilePic: string;
	bio: string;
}

export function DropdownMenuprofile({ user }: { user: IUSER }) {
	const router = useRouter();
	const { logout } = useLogout();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center space-x-2 cursor-pointer">
					<Avatar>
						<AvatarImage
							className="object-cover"
							src={user.profilePic}
							alt="@doggy"
						/>
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
				<DropdownMenuItem onClick={()=>router.push("/secure/home/createpost")}>
					<Pen />
					<span>Create Post</span>
				</DropdownMenuItem>
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
							{
								<span className="text-md">
									Welcome, {`${user?.firstName || " "} ${user?.lastName || " "}`}! 🚀
								</span>
							}
						</div>
						<div className="pt-2 border-t font-thin text-md border-gray-500">

							<div
								className={`cursor-pointer hover:bg-slate-900 transition-all px-4 py-2 ${index === 0 ? "bg-slate-800" : ""}`}
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
								className={`cursor-pointer hover:bg-slate-900 transition-all px-4 py-2 ${index === 1 ? "bg-slate-800" : ""}`}
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
