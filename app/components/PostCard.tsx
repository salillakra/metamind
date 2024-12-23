import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Post {
	title: string;
	category: string;
	imageURL: string;
	tags: string[];
	description: string;
	createdAt: Date;
	profilePic: string;
	firstName: string;
	lastName: string;
	link: string;
	views: number;
	likes: number;
}

const PostCard = ({
	link,
	title,
	category,
	imageURL,
	tags,
	views,
	description,
	createdAt,
	profilePic,
	firstName,
	lastName,
	likes
}: Post) => {
	const router = useRouter();

	const handlePostClick = () => {
		router.push(link);
	};
	return (
		<div className="w-full sm:w-[30rem] mb-8">
			<div className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-indigo-800 shadow-md">
				<div className="w-full sm:w-1/2">
					<Image
						className="h-full w-full object-cover"
						src={imageURL}
						alt={title}
						width={500}
						height={500}
					/>
				</div>
				<div className="flex py-3 bg-purple-800 gap-2 pl-4 flex-col w-full sm:w-[60%] justify-center">
					<span className="text-bold text-sm uppercase">{category}</span>
					<h2 className="text-lg font-semibold text-white">{title}</h2>
					<p className="text-gray-300 my-3 line-clamp-3">
						{description}
					</p>
					<button 
						type="button"
						onClick={handlePostClick}
						className=" ml-auto -translate-y-5 mr-3 hover:text-gray-400 transition hover:underline text-white"
					>
						Read More</button >
					<div className="flex gap-2">
						<Avatar>
							<AvatarImage className="object-cover" src={profilePic} alt={`${firstName} profile pic`} />
							<AvatarFallback>{firstName}</AvatarFallback>
						</Avatar>
						<div className="flex justify-between flex-col">
							<span className="text-base font-semibold tracking-wider">
								{firstName} {lastName}
							</span>
							<span className="text-xs">
								on{" "}
								{new Date(createdAt).toLocaleDateString("en-IN", {
									day: "2-digit",
									month: "short",
									year: "numeric",
								})}{" "}
								at{" "}
								{new Date(createdAt).toLocaleTimeString("en-IN", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full justify-between px-16 mt-4 py-2 bg-gray-800 rounded-lg">
				<div className="flex items-center gap-1 text-gray-300">
					<Heart className="w-5 h-5 text-red-500" />
					<span>{likes}</span>
				</div>
				<div className="flex items-center gap-1 text-gray-300">
					<MessageCircle className="w-5 h-5 text-blue-500" />
					<span>5</span>
				</div>
				<div className="flex items-center gap-1 text-gray-300">
					<Eye className="w-5 h-5 text-green-500" />
					<span>{views}</span>
				</div>
			</div>
			<div className="flex flex-wrap gap-2 mt-4">
				{tags.map((tag: string) => (
					<span
						key={tag}
						className="text-xs bg-gray-800 px-2 py-1 rounded-lg text-gray-300"
					>
						{tag}
					</span>
				))}
			</div>
		</div>
	);
};
export default PostCard;
