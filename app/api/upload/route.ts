import { v2 as cloudinary } from "cloudinary";
import { type NextRequest, NextResponse } from "next/server";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface SuccessResponse {
	secure_url: string;
}

interface ErrorResponse {
	error: string;
}

export async function POST(
	req: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		const body = await req.json();
		const { file } = body;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const uploadResponse = await cloudinary.uploader.upload(file, {
			folder: "MetaMind", // Optional: Organize uploads
			resource_type: "image",
			quality: "auto", // Automatically optimizes quality
			fetch_format: "auto", // Automatically chooses the best format (e.g., WebP, AVIF)
			width: 1000, // Optional: Resize width (e.g., 1000px)
			crop: "limit", // Prevents upscaling
		});

		console.log("Upload response:", uploadResponse);

		return NextResponse.json({
			secure_url: uploadResponse.secure_url,
			public_id: uploadResponse.public_id,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to process upload" },
			{ status: 500 },
		);
	}
}
