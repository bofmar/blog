import express, { Request, Response } from 'express';
import * as postControls from "../controllers/postsControllers.js"
import passport from 'passport';

const route = express.Router();


route.get('/', passport.authorize('jws'), postControls.createPost);

route.post('/', (_req: Request, res: Response) => {
	res.send('OK');
});

export default route;
