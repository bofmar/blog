import { Request, Response, NextFunction } from "express";
import z from "zod";
import BlogPost, { TPost } from "../models/blogPost.js";
import dotenv from 'dotenv';
import getPayloadFromHeader from "../helpers/getPayloadFromHeader.js";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/user.js";
import Comment, { TComment } from "../models/comment.js";

dotenv.config();

const ZPost = z.object({
	title: z.string({required_error: "Please provide a title."}).trim().min(1, {message: 'At least one charracter needed'}),
	summary: z.string({required_error: "Pleases provide a summary."}).trim().max(255, {message: 'Maximum length is 255 characters'}),
	body: z.string({required_error: "Pleases provide a body."}).trim().min(1, {message: 'Empty bodies are not allowed'}),
});

function validatePost(post: TPost) {
	return ZPost.safeParse(post);
}

async function authUser(bearerHeader: string | undefined): Promise<boolean> {
	if (bearerHeader === undefined) {
		return false;
	}
	const secret = process.env.SECRET as string;
	const payload = getPayloadFromHeader(bearerHeader, secret) as JwtPayload;

	const user = await User.findOne({username: payload.username}).exec();
	return (user !== null && user.authLevel === 'ADMIN');
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validatePost(req.body);
		if(!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		const isAuthorized = await authUser(req.headers['authorization']);

		if (!isAuthorized) {
			return res.status(403).json({success: false, errors: null, data: 'You do not have administration priviledges. This incident will be reported'});
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

export const allPosts = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const posts = await BlogPost.find({}).sort({createdAt: -1}).populate('comments').exec();
		if (!posts || posts.length === 0) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		res.json({success: true, errors: null, data: posts});
	} catch (error) {
		next(error);
	}
}

const getComments = async (arr: Array<TComment>) => {
	return arr.map(async (c) => await Comment.findById(c._id).populate('createdBy').exec());
}

export const onePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const post = await BlogPost.findById(req.params.postId).populate('comments').exec();
		if (!post) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const comments = await Promise.all(await getComments(post.comments as unknown as Array<TComment>));
		const payload = new BlogPost({
			_id: post._id,
			title: post.title,
			summary: post.summary,
			body: post.body,
			likes: post.likes,
			comments: comments,
			status: post.status
		})
		res.json({success: true, errors: null, data: payload});
	} catch (error) {
		next(error);
	}
}

export const postsByLikes = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const posts = await BlogPost.find({}).sort({'likes': -1}).populate('comments').exec();
		if (!posts || posts.length === 0) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		res.json({success: true, errors: null, data: posts});
	} catch (error) {
		next(error);
	}
}

export const changePublishStatus = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const isAuthorized = await authUser(req.headers['authorization']);

		if (!isAuthorized) {
			return res.status(403).json({success: false, errors: null, data: 'You do not have administration priviledges. This incident will be reported'});
		}

		const post = await BlogPost.findById(req.params.postId).populate('comments').exec();
		if (!post) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		if (post.status === 'UNPUBLISHED') {
			await BlogPost.findByIdAndUpdate(post._id, {'status': 'PUBLISHED'}).exec();
		} else {
			await BlogPost.findByIdAndUpdate(post._id, {'status': 'UNPUBLISHED'}).exec();
		}

		res.send({success: true, errors: null, data: post});
	} catch (error) {
		next(error);
	}
}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validatePost(req.body);
		if(!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		const isAuthorized = await authUser(req.headers['authorization']);

		if (!isAuthorized) {
			return res.status(403).json({success: false, errors: null, data: 'You do not have administration priviledges. This incident will be reported'});
		}

		const post = await BlogPost.findById(req.params.postId).populate('comments').exec();
		if (!post) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		await BlogPost.findByIdAndUpdate(post._id, {
			'title': req.body.title,
			'summary': req.body.summary,
			'body': req.body.body
		}).exec();

		res.send({success: true, errors: null, data: post});
	} catch (error) {
		next(error);
	}
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const isAuthorized = await authUser(req.headers['authorization']);

		if (!isAuthorized) {
			return res.status(403).json({success: false, errors: null, data: 'You do not have administration priviledges. This incident will be reported'});
		}

		const post = await BlogPost.findById(req.params.postId).populate('comments').exec();
		if (!post) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		await BlogPost.findByIdAndDelete(post._id).exec();	
		res.send({success: true, errors: null, data: post});
	} catch (error) {
		next(error);
	}
}

export const like = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const isAuthorized = await authUser(req.headers['authorization']);

		if (!isAuthorized) {
			return res.status(403).json({success: false, errors: null, data: 'Not authorized'});
		}
		const secret = process.env.SECRET as string;
		const payload = getPayloadFromHeader(req.headers['authorization'] as string, secret) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();

		const post = await BlogPost.findById(req.params.postId).populate('comments').exec();
		if (!post) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const newUserLikes = [... user!.likedPostIds, req.params.postId];

		await BlogPost.findOneAndUpdate(post._id, { $inc: { 'likes': 1}}).exec();
		await User.findByIdAndUpdate(user!._id, { 'likedPostIds': newUserLikes }).exec();

		res.send({success: true, errors: null, data: post});
	} catch (error) {
		next(error);
	}
}

export const dislike = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const isAuthorized = await authUser(req.headers['authorization']);

		if (!isAuthorized) {
			return res.status(403).json({success: false, errors: null, data: 'Not authorized'});
		}
		const secret = process.env.SECRET as string;
		const payload = getPayloadFromHeader(req.headers['authorization'] as string, secret) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();

		const post = await BlogPost.findById(req.params.postId).populate('comments').exec();
		if (!post) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const newUserLikes = [... user!.likedPostIds];
		const index = newUserLikes.indexOf(req.params.postId);
		newUserLikes.splice(index, 1);

		await BlogPost.findOneAndUpdate(post._id, { $inc: { 'likes': -1}}).exec();
		await User.findByIdAndUpdate(user!._id, { 'likedPostIds': newUserLikes }).exec();

		res.send({success: true, errors: null, data: post});
	} catch (error) {
		next(error);
	}
}
