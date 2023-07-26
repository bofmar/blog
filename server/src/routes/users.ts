import express, { Request, Response } from 'express';
//import User from '../models/user.js';

import * as userControls from "../controllers/userControllers.js"

const route = express.Router();

route.get('/', (_req: Request, res: Response) => {
	res.send('OK');
});

route.post('/', userControls.createUser);

export default route;
