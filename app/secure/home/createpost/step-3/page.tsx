"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-store";
import { tagsStore } from "@/store/Tags";
import TagPicker from "@/app/components/TagPicker";
import { CurrentPost } from "@/store/CurrentPost";
import { CreatePost } from "@/Post/action";
import { toast } from "@/hooks/use-toast";

const TagMenu = () => {
	const tags = useStore(tagsStore, (state) => state.tags);
	const Post = useStore(CurrentPost, (state) => state);
	const SaveTags = () => {
		CurrentPost.setState((state) => {
			return {
				...state,
				tags: tags,
			};
		});
	};

	const PublishThePost = async () => {
		CurrentPost.setState((state) => {
			return {
				...state,
				status: "published",
			};
		});
		console.log(Post);
		const response = await CreatePost(Post);
		if (response.success) {
			toast({
				variant: "default",
				title: "Post created successfully",
				description: "Your post is now live",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Failed to create post",
				description: response.error,
			});
		}
	};

	const DraftThePost = async () => {
		CurrentPost.setState((state) => {
			return {
				...state,
				status: "draft",
			};
		});
		const response = await CreatePost(Post);
		if (response.success) {
			toast({
				variant: "default",
				title: "Post Drafted successfully",
				description: "Your post is now saved as a draft",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Failed to save post as draft",
				description: response.error,
			});
		}
	};
	return (
		<>
			<AlertDialog>
				<div className="relative grid place-items-center inset-0 h-[81vh] w-full bg-[rgba(0,0,0,0.5)]">
					<Card className="sm:w-96 w-[90%]">
						<CardHeader>
							<CardTitle>Add tags</CardTitle>
						</CardHeader>
						<CardContent className="">
							<TagPicker />
						</CardContent>
						<CardFooter className="flex justify-between">
							<AlertDialogTrigger asChild>
								<Button onClick={() => SaveTags()}>Post</Button>
							</AlertDialogTrigger>
						</CardFooter>
					</Card>
				</div>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will make your post visible to everyone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={DraftThePost}>No</AlertDialogCancel>
						<AlertDialogAction onClick={PublishThePost}>Yes</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default TagMenu;
