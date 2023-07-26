// TO DO:
// This is just a stub. We need to create a propper schema
// when we have the info of what our posts will look like.
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export type TPost = {
	title: string;
}

const PostSchema = new Schema<TPost>({
	title: { type: String, required: true }
}, { timestamps: true });

const BlogPost = mongoose.model<TPost>('User', PostSchema);

export default BlogPost;
