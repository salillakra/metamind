/*
© 2024 Salil Lakra. All rights reserved.
This content is protected by copyright law and may not be reproduced, distributed, or otherwise used without permission.
*/

"use client";

import { Button } from "@/components/ui/button";
import { tagsStore } from "@/store/Tags";
import { useStore } from "@tanstack/react-store";
import React, { useState } from "react";

const Tag = ({
	tag,
	index,
	tags,
}: {
	tag: string;
	index: number;
	tags: string[];
}) => {
	const DeleteTag = (index: number) => {
		const newTags = [...tags];
		newTags.splice(index, 1);
		tagsStore.setState((state) => {
			return {
				...state,
				tags: newTags,
			};
		});
	};

	return (
		<React.Fragment>
			<div className="bg-purple-900 p-2 rounded-md flex items-center gap-2">
				<div>
					<span className="text-gray-400">#</span>
					<span className="text-white font-thin">{tag}</span>
				</div>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button
					onClick={() => DeleteTag(index)}
					className="hover:bg-slate-800 transition-all p-1 rounded-lg"
				>
					<svg
						className="w-4 h-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Delete Tag</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</React.Fragment>
	);
};

const TagPicker = () => {
	const [inputValue, setInputValue] = useState<string>("");
	const tags = useStore(tagsStore, (state) => state.tags);
	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputValue === "") return;
		tagsStore.setState((state) => {
			return {
				...state,
				tags: [...state.tags, inputValue],
			};
		});
		setInputValue("");
	};
	return (
		<div className="flex justify-center h-fit w-full">
			<div className="p-2 flex flex-col bg-primary-foreground rounded-md">
				<div className="flex gap-2 flex-wrap">
					{tags.length !== 0 &&
						tags.map((tag, index) => (
							<Tag
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								tags={tags}
								index={index}
								tag={tag}
							/>
						))}
				</div>
				<form onSubmit={(e) => submitHandler(e)} className="mt-3">
					<input
						placeholder="Enter Tags"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="bg-primary-foreground w-full p-2 focus:outline-none focus:border-0"
					/>
					<Button variant={"secondary"} type="submit">
						Add
					</Button>
				</form>
			</div>
		</div>
	);
};

export default TagPicker;
