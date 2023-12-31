import { Request, Response, NextFunction } from "express";
import Comment from "../models/comment.js";
import { z } from "zod";
import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/user.js";
import getPayloadFromHeader from "../helpers/getPayloadFromHeader.js";
import BlogPost from "../models/blogPost.js";

dotenv.config();

const SECRET = process.env.SECRET as string;

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

const ZComment = z.string({required_error: "Please provide a comment."}).trim().min(20, {message: 'Comments must be at least 20 characters long'});

function validateComment(comment: string) {
	return ZComment.safeParse(comment);
}

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validateComment(req.body.comment);
		if (!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		const bearerHeader = req.headers['authorization'];
		if (bearerHeader === undefined) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const payload = getPayloadFromHeader(bearerHeader, SECRET) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();
		if (!user) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		const comment = new Comment({
			text: req.body.comment,
			createdBy: user,
		});
		const post = await BlogPost.findById(req.body.post).exec();

		await comment.save();
		await BlogPost.findByIdAndUpdate(req.body.post, {'comments': [...post!.comments, comment]}).exec();
		res.send({success: true, errors: null, data: comment});
	} catch (error) {
		next(error);
	}
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearerHeader = req.headers['authorization'];
		if (bearerHeader === undefined) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const payload = getPayloadFromHeader(bearerHeader, SECRET) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();

		if (!user) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		const comment = await Comment.findById(req.params.commentId).populate('createdBy').exec();
		if (!comment) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		// the only one who should be able to delete a comment is the user
		// who created it or the admin.
		if ((!comment.createdBy && user.authLevel !== 'ADMIN') || 
			(comment.createdBy && !comment.createdBy._id.equals(user._id) && user.authLevel !== 'ADMIN')) {
			return res.status(403).json({success: false, errors: null, data: null});
		}


		await Comment.findByIdAndDelete(comment._id).exec();	
		res.send({success: true, errors: null, data: comment});
	} catch (error) {
		next(error);
	}
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearerHeader = req.headers['authorization'];
		if (bearerHeader === undefined) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const payload = getPayloadFromHeader(bearerHeader, SECRET) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();

		if (!user) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		const comment = await Comment.findById(req.params.commentId).populate('createdBy').exec();
		if (!comment) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		if (!comment.createdBy._id.equals(user._id)) {
			return res.status(403).json({success: false, errors: null, data: null});
		}

		await Comment.findByIdAndUpdate(comment._id, {text: req.body.comment}).exec();	
		res.send({success: true, errors: null, data: comment});
	} catch (error) {
		next(error);
	}
}

