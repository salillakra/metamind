"use client";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import Spinner from "@/app/components/Spinner";

const Page = () => {
	const [post, setPost] = React.useState({
		title: "",
		category: "",
		authorId: "",
		status: "draft",
		createdAt: new Date(),
		tags: [],
		content: "",
		imageURL: "",
	});
	interface Author {
		profilePic: string;
		firstName: string;
		lastName: string;
	}

	const [author, setAuthor] = React.useState<Author | null>(null); // New state for author details
	const [loading, setLoading] = React.useState(true); // Loading state

	const params = useParams();

	React.useEffect(() => {
		fetch(`/api/getpost/${params.slug}`)
			.then((res) => res.json())
			.then((data) => {
				setPost(data.post);
				setAuthor(data.author);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching the post:", error);
				setLoading(false);
			});
	}, [params.slug]);

	//returing the spinner component if the loading state is true
	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="min-h-screen text-gray-100">
			{/* Hero Section */}
			<div className="relative h-[29rem] sm:h-96 w-full overflow-hidden">
				<img
					src={post?.imageURL || "/default-image.jpg"}
					alt="Post Cover"
					className="absolute top-0 w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
				<div className="absolute left-4 bottom-10 sm:left-10 text-white z-10">
					<p className="text-sm uppercase font-semibold tracking-wide">
						{post.category || "Category"}
					</p>
					<h1 className=" text-xl sm:text-3xl md:text-5xl font-bold drop-shadow-lg hover:text-indigo-300 transition-colors duration-300">
						{post.title || "Post Title Loading..."}
					</h1>
					<p className="text-sm mt-2">
						Published on {new Date(post.createdAt).toDateString()}
					</p>
					<div className="flex items-center mt-4 space-x-3">
						<Image
							src={author?.profilePic || ""}
							alt="Author Profile Picture"
							width={50}
							height={50}
							className="rounded-full h-12 w-12 object-cover border-2 border-indigo-500"
						/>
						<div className="text-sm font-light">
							<p className="text-gray-300">Written by:</p>
							<p className="text-indigo-300 font-medium">
								{`${author?.firstName} ${author?.lastName}` || "N/A"}
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* Content Section */}
			<div className="p-8 mt-8 max-w-screen-lg mx-auto bg-primary-foreground shadow-lg rounded-lg">
				{/* Tags */}
				<div className="flex flex-wrap gap-2 mb-4">
					{post.tags.map((tag, index) => (
						<span
							key={tag}
							className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium hover:bg-blue-400 transition duration-200"
						>
							#{tag}
						</span>
					))}
				</div>

				{/* Content */}
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={
						post.content
							? { __html: post.content }
							: { __html: "Loading content..." }
					}
					className="text-primary text-base leading-relaxed"
				/>
			</div>
		</div>
	);
};

export default Page;
