// components/PostCard.js
import React from "react";
import Image from "next/image";

const PostCard = ({
	title,
	author,
	category,
	imageURL,
	tags,
	content,
	createdAt,
}) => {
	return (
		<div className="max-w-screen-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mb-6 transition-shadow duration-300 hover:shadow-2xl">
			{/* Post Image */}
			<div className="relative h-64 w-full mb-6">
				<img
					src={imageURL || "/default-image.jpg"}
					alt="Post Cover"
					className="w-full h-full object-cover rounded-lg"
				/>
			</div>

			{/* Post Info */}
			<div className="text-white">
				<p className="text-sm uppercase font-semibold text-indigo-400">
					{category || "Category"}
				</p>
				<h2 className="text-3xl font-bold mt-2 hover:text-indigo-300 transition-colors duration-300">
					{title || "Post Title Loading..."}
				</h2>
				<p className="text-sm mt-2 text-gray-400">
					Written by: {author || "Author Name"}
				</p>
				<p className="text-sm mt-2 text-gray-400">
					Created: {new Date(createdAt).toLocaleDateString() || "N/A"}
				</p>

				{/* Tags */}
				<div className="flex flex-wrap gap-2 mt-4">
					{tags?.map((tag, index) => (
						<span
							key={index}
							className="text-xs bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full font-medium"
						>
							#{tag}
						</span>
					))}
				</div>

				{/* Content Preview */}
				<p className="mt-4 text-gray-300">{content || "Loading content..."}</p>
			</div>
		</div>
	);
};

export default PostCard;
