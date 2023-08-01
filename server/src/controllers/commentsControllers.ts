import { Request, Response, NextFunction } from "express";
import Comment from "../models/comment.js";

export const allComments = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await Comment.find({}).exec();
		if(!comments || comments.length === 0) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		res.json({success: true, errors: null, data: comments});
	} catch (error) {
		next(error);
	}
}
