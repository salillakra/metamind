"use client";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Spinner from "@/app/components/Spinner";
import { CurrentPost } from "@/store/CurrentPost";
import { useRouter } from "next/navigation";

const Page = () => {
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	function submitHandler_Content() {
		setLoading(true);
		CurrentPost.setState((state) => {
			return {
				...state,
				content: value,
			};
		});
		setLoading(false);
		router.push("/secure/home/createpost/step-3");
	}

	return (
		<>
			{loading && <Spinner />}
			<ReactQuill
				className="h-[81vh] text-white bg-gray-900"
				theme="snow"
				value={value}
				onChange={setValue}
			/>
			<div className="w-full bg-gray-900 flex justify-end">
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
