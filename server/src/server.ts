/* ----------IMPORT LIBRARIES---------- */
import express, {Request, Response} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
/* ----------IMPORT MIDDLEWARE---------- */
import morgan from "morgan";

dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

mongoose.connect(MONGO_URI as string).then(_result => {
	app.listen(PORT, () => console.log(`Listening for requests on port ${PORT}`));
});

app.use(morgan('combined'));


app.get('/', (_req: Request, res: Response) => {
	res.json({msg: 'Hi'});
})
