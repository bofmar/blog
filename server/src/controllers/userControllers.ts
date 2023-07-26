import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
	try {
		res.json({msg: req.body});
	} catch {
		console.log('error');
	}
};
