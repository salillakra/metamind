import { Store } from "@tanstack/store";

// Initialize a new store with an empty array of tags
export const tagsStore = new Store({
	tags: [] as string[],
});
