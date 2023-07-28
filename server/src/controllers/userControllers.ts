import { Request, Response } from "express";
import z from "zod";
import User, { TUser } from "../models/user.js";
import bcrypt from "bcryptjs";

const ZUser = z.object({
	username: z.string({required_error: "Please provide a username."}).trim().min(2, {message: 'Usernames must be at least 2 characters long.'}),
	password: z.string({required_error: "Pleases provide a password."}).trim().min(6, {message: 'Passwords must be at least 6 characters long.'}),
});

function validateUser(user: TUser) {
	return ZUser.safeParse(user);
}

export const createUser = async (req: Request, res: Response) => {
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
		console.log(error);
	}
};

export const getAllUsers = async (_req: Request, res: Response) => {
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
		console.log(error);
	}
};
