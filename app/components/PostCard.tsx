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
	likes,
}: Post) => {
	const router = useRouter();

	const handlePostClick = () => {
		router.push(link);
	};

	return (
		<div className="w-full sm:max-w-md mb-8 rounded-lg overflow-hidden shadow-lg bg-gray-900 hover:shadow-xl transition-shadow">
			{/* Image Section */}
			<div className="relative h-56 sm:h-64 w-full">
					<Image
						className="object-cover hover:opacity-90 transition-opacity"
						src={imageURL}
						alt={title}
						layout="fill"
						priority
					/>
				<span className="absolute top-2 left-2 bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded">
					{category}
				</span>
			</div>

			{/* Content Section */}
			<div className="p-4 flex flex-col gap-4">
				<h2
					className="text-xl font-semibold text-white truncate hover:underline cursor-pointer transition-colors hover:text-purple-400"
					onClick={handlePostClick}
				>
					{title}
				</h2>
				<p className="text-sm text-gray-400 line-clamp-3">
					{description}
				</p>
				<button
					type="button"
					onClick={handlePostClick}
					className="self-start text-sm text-purple-400 hover:text-purple-300 transition-colors"
				>
					Read More
				</button>

				{/* User Info */}
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage className="object-cover" src={profilePic} alt={`${firstName} profile pic`} />
						<AvatarFallback>{firstName[0]}</AvatarFallback>
					</Avatar>
					<div className="text-sm text-gray-300">
						<p className="font-medium text-white">
							{firstName} {lastName}
						</p>
						<p className="text-gray-400">
							{new Date(createdAt).toLocaleDateString("en-IN", {
								day: "2-digit",
								month: "short",
								year: "numeric",
							})}
							{" at "}
							{new Date(createdAt).toLocaleTimeString("en-IN", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="flex justify-between px-4 py-3 bg-gray-800 rounded-b-lg">
				<div className="flex items-center gap-1 text-gray-400">
					<Heart className="w-5 h-5 text-red-500" />
					<span className="font-medium">{likes}</span>
				</div>
				<div className="flex items-center gap-1 text-gray-400">
					<MessageCircle className="w-5 h-5 text-blue-500" />
					<span className="font-medium">5</span>
				</div>
				<div className="flex items-center gap-1 text-gray-400">
					<Eye className="w-5 h-5 text-green-500" />
					<span className="font-medium">{views}</span>
				</div>
			</div>

			{/* Tags Section */}
			<div className="flex flex-wrap gap-2 px-4 py-3 bg-gray-900">
				{tags.map((tag: string) => (
					<span
						key={tag}
						className="text-xs bg-gray-800 px-3 py-1 rounded-lg text-gray-400 hover:bg-purple-700 hover:text-white transition-colors"
					>
						#{tag}
					</span>
				))}
			</div>
		</div>
	);
};

export default PostCard;
