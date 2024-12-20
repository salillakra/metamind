"use client";

import Logo from "@/app/components/Logo";
import Spinner from "@/app/components/Spinner";
import { Button } from "@/components/ui/button";
import useImageUpload from "@/hooks/useImageUpload";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileImg } from "@/auth/signup";
import { useStore } from "@tanstack/react-store";
import { userIdStore } from "@/store/Signup";

const ProfileUploadPage: React.FC = () => {
	const [bio, setBio] = useState("");
	const { uploading, uploadedUrl, error, uploadImage } = useImageUpload();
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const user = useStore(userIdStore, (state) => state._id);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			try {
				await uploadImage(file);
			} catch (error) {
				console.error(error);
				toast({
					title: "Error",
					description: "Failed to upload image",
					variant: "destructive",
				});
			}
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		console.log(uploadedUrl, user);
		if (!uploadedUrl || !user) {
			toast({
				title: "Error",
				description: "Please upload a profile picture",
				variant: "destructive",
			});
			setLoading(false);
			return;
		}

		const res = await updateProfileImg(user, uploadedUrl, bio);
		if (res.success) {
			setLoading(false);
			toast({
				title: "Success",
				description: "Profile picture updated!",
			});
			router.push("/");
		} else {
			setLoading(false);
			toast({
				title: "Error",
				description: res.message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-white">
			{(uploading || loading) && <Spinner />}
			<div className="absolute top-5 left-5">
				<Logo />
			</div>
			<h1 className="text-xl sm:text-3xl font-bold mb-6 text-center">
				Upload Your Profile Picture
			</h1>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center gap-8 w-full max-w-md"
			>
				<div className="relative h-40 w-40 md:w-64 md:h-64 shadow-lg rounded-full overflow-hidden border-4 border-white">
					{uploadedUrl ? (
						<Image
							height={300}
							width={300}
							className="h-full w-full object-cover"
							src={uploadedUrl}
							alt="Profile Preview"
						/>
					) : (
						<Image
							height={300}
							width={300}
							className="h-full w-full object-cover"
							src="https://wallpapers.com/images/high/profile-picture-ckz09w7hjzax4qhc.webp"
							alt="Default Profile"
						/>
					)}
					<label className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex justify-center items-center cursor-pointer transition duration-300">
						<Upload
							size={50}
							className="text-gray-100 group-hover:text-gray-300"
						/>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
					</label>
				</div>
				<textarea
					onChange={(e) => setBio(e.target.value)}
					className="w-full h-32 p-4 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
					placeholder="Tell us about yourself..."
				/>
				<Button
					type="submit"
					className="w-36 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg transition transform hover:scale-105"
				>
					Upload
				</Button>
			</form>
			{error && <p className="text-red-500 text-center mt-4">{error}</p>}
		</div>
	);
};

export default ProfileUploadPage;
