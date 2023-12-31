import mongoose, { Types } from "mongoose";
import Comment from "./comment.js";

const Schema = mongoose.Schema;

export type TPost = {
	title: string;
	summary: string;
	body: string;
	likes: number;
	comments: Array<Types.ObjectId>;
	status: 'PUBLISHED' | 'UNPUBLISHED'
}

const PostSchema = new Schema<TPost>({
	title: { type: String, required: true, minlength: 1 },
	summary: { type: String, required: true, minlength: 20, maxlength: 255 },
	body: { type: String, required: true, minlength: 1},
	likes: { type: Number, required: true, default: 0 },
	comments: [{ type: Schema.Types.ObjectId, ref: Comment.modelName, required: true }],
	status: { type: String, required: true }
}, { timestamps: true });

const BlogPost = mongoose.model<TPost>('BlogPost', PostSchema);

export default BlogPost;
