import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const opts = {
	jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey : process.env.SECRET
}


export const jwtStrategy = new JWTStrategy(opts, async (payload, done) => {
	try {
		const user = await User.findOne({username: payload.username});
		if(!user) {
			return done(null, false, { message: 'Incorrect username' });
		} 
		return done(null, true, user);
	} catch (error) {
		return done(error);
	}
}) 
