"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { Upload, X } from "lucide-react";
import { CreatePost } from "@/Post/action";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { PostData } from "../layout";
import useImageUpload from "@/hooks/useImageUpload";
import Spinner from "@/app/components/Spinner";

const categories: [string, ...string[]] = [
	"Technology",
	"Health",
	"Science",
	"Education",
	"Entertainment",
	"Sports",
	"Business",
	"Travel",
	"Lifestyle",
	"Food",
	"Fashion",
	"Art",
	"Politics",
	"Environment",
	"History",
	"Culture",
	"Finance",
	"Music",
	"Literature",
	"Gaming",
];

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	category: z.enum(categories),
});

export default function Page() {
	const { uploading, uploadedUrl, error, uploadImage } = useImageUpload();
	const { setPost } = useContext(PostData);
	const { user } = useAuth();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			category: categories[0],
		},
	});
	const router = useRouter();

	console.log("this is from createpost", uploadedUrl);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Handle form submission
		if (!user) {
			toast({
				title: "Error",
				description: "You need to be signed in to create a post",
			});
			return false;
		}
		const response = await CreatePost({ ...values, _id: user?._id });
		if (response?.success) {
			setPost({
				title: values.title,
				category: values.category,
			});
			toast({
				title: "Post Created",
				description: "Your post has been created successfully",
			});
			router.push("/secure/home/createpost/step-2");
		} else {
			toast({
				title: "Error",
				description: "An error occurred while creating your post",
			});
		}
	}

	// Handle file input change (for drag and drop and click-to-upload)
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			await uploadImage(file);
		}
	};

	// Handle drag and drop file upload
	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDrop = async (event: React.DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const file = event.dataTransfer.files?.[0];
		if (file) {
			await uploadImage(file);
		}
	};

	return (
		<>
			<div className="flex justify-center h-[90vh] items-center">
				{uploading && <Spinner /> /*// Show spinner while uploading */}
				<div className="flex flex-col w-[93.55%] md:w-[70%]">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-5"
						>
							{/* Drag and Drop or Click-to-upload Area */}
							<div
								className="flex items-center justify-center w-full"
								onDragOver={handleDragOver}
								onDrop={handleDrop}
							>
								{uploadedUrl ? (
									<div className="relative w-full">
										<div className="bg-red-500 absolute grid place-items-center -right-4 top-0 h-8 w-8  rounded-[100%]  cursor-pointer">
											<X size={"lg"} />
										</div>
										<div className="mt-4 flex justify-center">
											<Image
												src={uploadedUrl}
												height={300}
												width={400}
												alt="Preview"
												className="h-64 w-full object-cover rounded-md"
											/>
										</div>
									</div>
								) : (
									<label
										htmlFor="dropzone-file"
										className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
									>
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<Upload className="my-1" />
											<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
												<span className="font-semibold">Click to upload</span>{" "}
												or drag and drop
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												SVG, PNG, JPG or GIF (MAX. 800x400px)
											</p>
										</div>
										<input
											id="dropzone-file"
											type="file"
											className="hidden"
											accept="image/*"
											onChange={handleFileChange}
										/>
									</label>
								)}
							</div>

							{/* Title Field */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Category Select */}
							<FormField
								control={form.control}
								name="category"
								render={() => (
									<Select>
										<Label>Category</Label>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Category</SelectLabel>
												{categories.map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
										<FormMessage />
									</Select>
								)}
							/>

							<Button
								size={"default"}
								className="inline-block w-1/3 mx-auto"
								type="submit"
							>
								Create🚀
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
}
