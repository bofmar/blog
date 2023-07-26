/* ----------IMPORT LIBRARIES---------- */
import express, {Request, Response} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
/* ----------IMPORT MIDDLEWARE---------- */
import morgan from "morgan";
import cors from "cors";
/* ----------IMPORT ROUTES---------- */
import postRoute from "./routes/posts.js";
import userRoute from "./routes/users.js";
import commentsRoute from "./routes/comments.js";

dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

mongoose.connect(MONGO_URI as string).then(_result => {
	app.listen(PORT, () => console.log(`Listening for requests on port ${PORT}`));
});

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // TO DO: Configure this

// Routes
app.use('/api/posts', postRoute);
app.use('/api/users', userRoute);
app.use('/api/comments', commentsRoute);

app.get('/', (_req: Request, res: Response) => {
	res.json({msg: 'Hi'});
});
