import { Request, Response } from "express";
import z from "zod";
import { TUser } from "../models/user.js";

const ZUser = z.object({
	username: z.string().trim().min(2, {message: 'Usernames must be at least 2 characters long.'}),
	password: z.string().trim().min(6, {message: 'Passwords must be at least 6 characters long.'}),
});

function validateUser(user: TUser) {
	return ZUser.safeParse(user);
}

export const createUser = async (req: Request, res: Response) => {
	try {
		const validationResult = validateUser(req.body);
		if(!validationResult.success) {
			// TO DO trim the error message
			res.status(400).json({success: false, errors: validationResult.error, data: req.body});
			return;
		}

		res.json({msg: req.body});
	} catch {
		console.log('error');
	}
};
