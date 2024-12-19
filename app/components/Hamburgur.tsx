import { useAuth } from "@/hooks/useAuth";
import { Pen, StickyNote, X, User } from "lucide-react";
import Link from "next/link";

const Hamburgur = ({
	isOpen,
	setOpen,
	className,
	...props
}: {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
}) => {
	const { user } = useAuth();

	function closeMenu() {
		setOpen((prev) => !prev);
	}

	return (
		<div
			{...props}
			className={`fixed inset-0 bg-[rgba(0,0,0,0.8)] z-50 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"} ${className}`}
			onClick={() => setOpen(false)}
		>
			<div
				className={`absolute left-0 top-0 h-full w-[35%] bg-slate-950 shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
				onKeyDown={(e) => e.key === "Enter" && setOpen(false)}
				onClick={(e) => e.stopPropagation()}
			>
				<div
					onClick={() => setOpen(false)}
					onKeyUp={(e) => e.key === "Enter" && setOpen(false)}
					onKeyDown={(e) => e.key === "Enter" && setOpen(false)}
					className="absolute top-4 right-4 cursor-pointer text-white hover:scale-110 transition-transform duration-200"
				>
					<X />
				</div>
				<div className="px-4 py-2 border-b border-gray-500">
					<p className="text-3xl font-bold text-white tracking-tighter">Menu</p>
				</div>
				<div className="pt-4 border-t border-gray-500 font-thin text-md">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						onClick={closeMenu}
						className="cursor-pointer hover:bg-slate-700 transition-all px-4 py-3 rounded-lg"
					>
						<Link
							className="flex gap-3 items-center text-white text-lg"
							href="secure/home/my-Posts"
						>
							<StickyNote />
							My Posts
						</Link>
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						onClick={closeMenu}
						className="cursor-pointer hover:bg-gray-700 transition-all px-4 py-3 rounded-lg"
					>
						<Link
							className="flex gap-3 items-center text-white text-lg"
							href="/secure/home/createpost"
						>
							<Pen />
							Create Post
						</Link>
					</div>
				</div>
				{user && (
					<div className="absolute bottom-5 left-4 flex flex-col gap-2 px-4 py-2 text-white">
						<div className="flex items-center gap-3">
							<User className="w-5 h-5 text-gray-300" />
							<p className="text-sm font-medium">
								{user.firstName} {user.lastName}
							</p>
						</div>
						<p className="text-xs text-gray-400">{user.email}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Hamburgur;
