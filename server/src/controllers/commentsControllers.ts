import { Request, Response, NextFunction } from "express";
import Comment from "../models/comment.js";

export const allComments = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await Comment.find({}).populate('createdBy').exec();
		if (!comments || comments.length === 0) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		res.json({success: true, errors: null, data: comments});
	} catch (error) {
		next(error);
	}
}

export const oneComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comment = await Comment.findById(req.params.commentId).populate('createdBy').exec();
		if (!comment) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		res.json({success: true, errors: null, data: comment});
	} catch (error) {
		next(error);
	}
}
