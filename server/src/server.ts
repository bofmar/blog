import express, {Request, Response} from "express";
import morgan from "morgan";

const app = express();

app.use(morgan('combined'));

app.listen(5000, () => console.log('Listening for requests on port 5000'));

app.get('/', (_req: Request, res: Response) => {
	res.json({msg: 'Hi'});
})
