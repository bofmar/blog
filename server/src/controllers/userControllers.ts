import { Request, Response, NextFunction } from "express";
import z from "zod";
import User, { TUser } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import getPayloadFromHeader from "../helpers/getPayloadFromHeader.js";

dotenv.config();

const ZUser = z.object({
	username: z.string({required_error: "Please provide a username."}).trim().min(2, {message: 'Usernames must be at least 2 characters long.'}),
	password: z.string({required_error: "Pleases provide a password."}).trim().min(6, {message: 'Passwords must be at least 6 characters long.'}),
});

function validateUser(user: TUser) {
	return ZUser.safeParse(user);
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validateUser(req.body);
		if(!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		// Check if the username is in use
		const userExists = await User.findOne({username: req.body.username}).exec();
		if(userExists) {
			res.status(400).json({success: false,
								 errors: 
									 {fieldErrors: { username: [ `Someone is already using ${req.body.username} as their username.` ] }},
								 data: req.body});
			return;
		}

		// create hash and salt
		const hashedPassword = bcrypt.hashSync(req.body.password, 10)

		const newUser = new User({
			username: req.body.username,
			password: hashedPassword,
			authLevel: 'USER'
		});

		await newUser.save();
		res.json({success: true, errors: null, data: newUser});
	} catch (error){
		next(error);
	}
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		// we exclude the password field, as we don't want that to be publicaly accessible
		const users = await User.find({}, {password: 0}).exec();
		if(!users) {
			// no users in db?
			res.status(400).json({success: false, errors: null, data: null});
			return;
		}

		res.json({success: true, errors: null, data: users});
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// we exclude the password field, as we don't want that to be publicaly accessible
		const user = await User.findById(req.params.userId, {password: 0});
		if(!user) {
			res.status(400).json({success: false, errors: null, data: null});
			return;
		}

		res.json({success: true, errors: null, data: user});
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validateUser(req.body);
		if(!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		const user = await User.findOne({username: req.body.username});
		if(!user) {
			res.status(401).json({success: false, errors: null, data: null});
			return;
		} 

		bcrypt.compare(req.body.password, user.password, (_err, success) => {
			if(success) {
				const secret = process.env.SECRET as string;
				const token = jwt.sign({username: user.username}, secret, {expiresIn: '12h'}); 
				return res.json({message: "Auth passed", token});
			} else {
				res.status(403).json({success: false, errors: null, data: 'Invalid users credentials'});
				return;
			}
		});

	} catch (error) {
		next(error);
	}
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validationResult = validateUser(req.body);
		if(!validationResult.success) {
			res.status(400).json({success: false, errors: validationResult.error.flatten(), data: req.body});
			return;
		}

		const user = await User.findOne({username: req.body.username});
		if(!user) {
			res.status(401).json({success: false, errors: null, data: null});
			return;
		} 

		if(user.authLevel !== 'ADMIN') {
			res.status(403).json({success: false, errors: null, data: 'You do not have administration priviledges. This incident will be reported'});
			return;
		}

		bcrypt.compare(req.body.password, user.password, (_err, success) => {
			if(success) {
				const secret = process.env.SECRET as string;
				const token = jwt.sign({username: user.username}, secret, {expiresIn: '12h'}); 
				return res.json({message: "Auth passed", token});
			} else {
				res.status(403).json({success: false, errors: null, data: 'Invalid users credentials'});
				return;
			}
		});

	} catch (error) {
		next(error);
	}
};

export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearerHeader = req.headers['authorization'];
		if (bearerHeader === undefined) {
			return res.status(400).json({success: false, errors: null, data: null});
		}
		const secret = process.env.SECRET as string;
		const payload = getPayloadFromHeader(bearerHeader, secret) as JwtPayload;

		const user = await User.findOne({username: payload.username}).exec();

		if (!user) {
			return res.status(400).json({success: false, errors: null, data: null});
		}

		res.send({success: true, errors: null, data: true});
	} catch (error) {
		next(error);
	}
}
