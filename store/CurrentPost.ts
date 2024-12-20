import { Store } from "@tanstack/react-store";

export const CurrentPost = new Store({
	authorId: "",
	imageURL: "",
	title: "",
	category: "",
	content: "",
	status: "draft",
	tags: [],
} as {
	authorId: string;
	imageURL: string;
	title: string;
	category: string;
	status: "draft" | "published";
	content: string;
	tags: string[];
});
