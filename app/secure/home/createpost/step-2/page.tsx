"use client";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import React, { useContext, useState } from "react";
// @ts-ignore <types not available for react-quill>
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PostModel } from "@/db/post";
import { connectDB } from "@/db/connect";
import { useAuth } from "@/hooks/useAuth";
import { PostData } from "../../layout";
import Spinner from "@/app/components/Spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTags } from "@/hooks/useTags";
import TagPicker from "@/app/components/TagPicker";

const Tags = () => {
	<Card className="w-[350px]">
		<CardHeader>
			<CardTitle>Add tags</CardTitle>
			<CardDescription>
				Help people discover your project by adding tags
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form>
				<TagPicker />
			</form>
		</CardContent>
		<CardFooter className="flex justify-between">
			<Button>Post</Button>
		</CardFooter>
	</Card>;
};

const Page = () => {
	const { tags } = useTags();
	const { title, category } = useContext(PostData);
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();

	console.log(tags);
	async function submitHandler_Content(): Promise<void> {
		"use server";
		setLoading(true); // Start loading
		const userID = user?._id;
		try {
			await connectDB();

			console.log([title, category, userID]);
			const res = await PostModel.findOneAndUpdate(
				{ authorId: userID, title: title, category: category },
				{ content: value },
			);
			console.log(res);
			setLoading(false); // Stop loading
		} catch (error) {
			console.error(error);
			setLoading(false); // Stop loading
		}
	}

	return (
		<>
			{loading && <Spinner />}
			<ReactQuill
				className="h-full text-white bg-black"
				theme="snow"
				value={value}
				onChange={setValue}
			/>
			<div className="w-full flex justify-end">
				<Button
					onClick={submitHandler_Content}
					className="mx-3 z-10 "
					size={"default"}
				>
					Continue
					<MoveRight />
				</Button>
			</div>
		</>
	);
};

export default Page;
