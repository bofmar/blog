import express, { Request, Response } from 'express';

const route = express.Router();

route.get('/', (_req: Request, res: Response) => {
	res.send('OK');
});

route.post('/', (_req: Request, res: Response) => {
	res.send('OK');
});

export default route;
