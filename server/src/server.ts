/* ----------IMPORT LIBRARIES---------- */
import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
/* ----------IMPORT MIDDLEWARE---------- */
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
/* ----------IMPORT ROUTES---------- */
import postRoute from "./routes/posts.js";
import userRoute from "./routes/users.js";
import commentsRoute from "./routes/comments.js";
import User from "./models/user.js";
import { jwtStrategy } from "./strategies/jwt.js";

dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;

function printError(err: any) {
	console.log('==========ERROR==========');
	console.error(err.stack);
	console.log('==========+END+==========')
}

passport.use(jwtStrategy);

passport.serializeUser(function(user: any, done) {
	done(null, user._id);
});

passport.deserializeUser(async function(_id, done) {
	try {
		const user = await User.findById(_id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

const app = express();

mongoose.connect(MONGO_URI as string).then(_result => {
	app.listen(PORT, () => console.log(`Listening for requests on port ${PORT}`));
});

app.use(session({
	secret: SECRET as string,
	resave: false,
	saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // TODO: Configure this

// Routes
app.use('/api/posts', postRoute);
app.use('/api/users', userRoute);
app.use('/api/comments', commentsRoute);

app.get('/', (_req: Request, res: Response) => {
	res.json({msg: 'Hi'});
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
	printError(err);
	if (res.headersSent) {
		return next(err);
	}

	res.status(500).send({success: false, errors: err, data: null});
});

app.use((_req: Request, res: Response) => {
	res.status(404).send({success: false, errors: null, data: null})
});
