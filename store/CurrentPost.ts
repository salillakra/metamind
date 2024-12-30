import { Store } from "@tanstack/react-store";

export const CurrentPost = new Store({
	authorId: "",
	imageURL: "",
	title: "",
	category: "",
	description: "",
	content: "",
	status: "published",
	tags: [],
} as {
	authorId: string;
	imageURL: string;
	title: string;
	description: string;
	category: string;
	status: "draft" | "published";
	content: string;
	tags: string[];
});
