/*
© 2024 Salil Lakra. All rights reserved.
This content is protected by copyright law and may not be reproduced, distributed, or otherwise used without permission.
*/

"use client";

import { useTags } from "@/hooks/useTags";
import React, { useState } from "react";

const Tag = ({
	tag,
	index,
	tags,
	setTags,
}: {
	tag: string;
	index: number;
	tags: string[];
	setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
	const DeleteTag = (index: number) => {
		const newTags = [...tags];
		newTags.splice(index, 1);
		setTags(newTags);
	};
	return (
		<React.Fragment>
			<div className="bg-gray-900 p-2 rounded-lg flex items-center gap-2">
				<div>
					<span className="text-gray-400">#</span>
					<span className="text-white font-thin italic">{tag}</span>
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
	const [inputValue, setInputValue] = useState("");
	const { tags, setTags } = useTags();
	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputValue !== "") {
			setTags([...tags, inputValue]);
		}
		setInputValue("");
	};
	return (
		<div className="flex justify-center h-fit w-full">
			<div className="px-4 w-[80%] sm:w-[50%]  md:max-w-80 py-2 flex flex-col bg-gray-800 rounded-lg">
				<div className="flex gap-2 flex-wrap">
					{tags.length !== 0 &&
						tags.map((tag, index) => (
							<Tag
								key={index}
								tags={tags}
								setTags={setTags}
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
						className="bg-gray-800 p-2 focus:outline-none focus:border-0"
					/>
					<button
						type="submit"
						className="bg-gray-900 p-2 mt-2 rounded-lg hover:bg-slate-800 transition-all"
					>
						Add Tag
					</button>
				</form>
			</div>
		</div>
	);
};

export default TagPicker;
