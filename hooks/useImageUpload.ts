import { useState } from "react";

const useImageUpload = () => {
	const [uploading, setUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const uploadImage = async (file: File) => {
		setUploading(true);
		setError(null);
		setUploadedUrl(null);

		try {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = async () => {
				try {
					const response = await fetch("/api/upload", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ file: reader.result }),
					});

					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error Response:", errorData);
						throw new Error("Failed to upload image");
					}

					const data = await response.json();
					setUploadedUrl(data.secure_url);
					console.log("Uploaded Image URL:", data.secure_url);
					// biome-ignore lint/suspicious/noExplicitAny: <🖖>
				} catch (err: any) {
					setError(err);
				} finally {
					setUploading(false);
				}
			};

			reader.onerror = () => {
				setUploading(false);
				setError("Error reading file");
			};
			// biome-ignore lint/suspicious/noExplicitAny: <🖖>
		} catch (err: any) {
			setUploading(false);
			setError(err.message);
			throw err;
		}
	};

	return { uploading, uploadedUrl, error, uploadImage };
};

export default useImageUpload;
