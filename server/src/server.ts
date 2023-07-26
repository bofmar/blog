import express, {Request, Response} from "express";

const app = express();

app.listen(5000, () => console.log('Listening for requests on port 5000'));

app.get('/', (_req: Request, res: Response) => {
	res.json({msg: 'Hi'});
})
