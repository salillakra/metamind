'use client'
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { PostModel } from "@/db/post";
import { type IPost } from "@/db/post";
import AdminPostCard from "@/app/components/AdminCard";
import { connectDB } from "@/db/connect";


const Page = () => {
	const [posts, setPosts] = useState<IPost[]>();
	const { user } = useAuth()
	useEffect(() => {
		const fetchPosts = async () => {
			await connectDB()
			// const response: IPost[] = await PostModel.find({ authorId: user?._id });
			// setPosts(response);
		}
		fetchPosts();
	}, []);
	return <div>
		<div className="flex flex-wrap justify-center items-center">
			{(posts && posts.length > 0) ? posts.map((post) => {
				return <AdminPostCard title={post.title} createdAt={post.createdAt} tags={post.tags} description={post.discrpition} key={post._id.toString()} />
			}) : <div className="text-center">No posts found</div>}
		</div>
	</div>;
};

export default Page;
