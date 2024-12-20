import mongoose, { type Document, Schema } from "mongoose";

export interface IPost extends Document {
	_id: mongoose.Types.ObjectId;
	authorId: mongoose.Types.ObjectId;
	title: string;
	imageURL: string;
	content: string;
	tags: string[];
	category: string;
	status: "draft" | "published";
	likes: number;
	comments: IComment[];
	createdAt: Date;
	updatedAt: Date;
}

// Comment Subdocument Interface
export interface IComment {
	userId: mongoose.Types.ObjectId;
	comment: string;
	createdAt: Date;
}

// Post Schema
const PostSchema: Schema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
		},
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: { type: String, required: true },
		imageURL: { type: String, default: "", required: true },
		content: { type: String, default: "", required: true },
		tags: { type: [String], default: [] },
		category: { type: String, required: true },
		status: { type: String, enum: ["draft", "published"], default: "draft" },
	},
	{ timestamps: true },
);

// Check if the model already exists
const PostModel =
	mongoose.models.Posts || mongoose.model<IPost>("Posts", PostSchema);

export { PostModel };
