import mongoose, { Types } from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

export type TComment = {
	text: string,
	createdBy: Types.ObjectId,
	likes: number
}

const CommentSchema = new Schema<TComment>({
	text: { type: String, required: true, minlength: 20 },
	createdBy: { type: Schema.Types.ObjectId, ref: User.modelName, required: true },
	likes: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Comment = mongoose.model<TComment>('Comment', CommentSchema);

export default Comment;
