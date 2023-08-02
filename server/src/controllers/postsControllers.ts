import { Request, Response, NextFunction } from "express";
import z from "zod";
import BlogPost, { TPost } from "../models/blogPost.js";
import dotenv from 'dotenv';
import getPayloadFromHeader from "../helpers/getPayloadFromHeader.js";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/user.js";

dotenv.config();

const ZPost = z.object({
	title: z.string({required_error: "Please provide a title."}).trim().min(1, {message: 'At least one charracter needed'}),
	summary: z.string({required_error: "Pleases provide a summary."}).trim().max(255, {message: 'Maximum length is 255 characters'}),
	body: z.string({required_error: "Pleases provide a body."}).trim().min(1, {message: 'Empty bodies are not allowed'}),
});

function validatePost(post: TPost) {
	return ZPost.safeParse(post);
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validatePost(req.body);
		if(!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		const bearerHeader = req.headers['authorization'];
		if (bearerHeader === undefined) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const secret = process.env.SECRET as string;
		const payload = getPayloadFromHeader(bearerHeader, secret) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();

		// only the admin can create posts
		if (!user || user.authLevel !== 'ADMIN') {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		const newPost = new BlogPost({
			title: req.body.title,
			summary: req.body.summary,
			body: req.body.body,
			likes: 0,
			comments: [],
			status: 'UNPUBLISHED'
		});

		await newPost.save();
		res.json({success: true, errors: null, data: newPost});
	} catch (error){
		next(error);
	}
}
