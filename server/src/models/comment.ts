import mongoose, { Types } from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

export type TComment = {
	_id: string,
	text: string,
	createdBy: Types.ObjectId,
}

const CommentSchema = new Schema<TComment>({
	text: { type: String, required: true, minlength: 20 },
	createdBy: { type: Schema.Types.ObjectId, ref: User.modelName, required: true },
}, { timestamps: true });

const Comment = mongoose.model<TComment>('Comment', CommentSchema);

export default Comment;
