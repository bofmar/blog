import mongoose from "mongoose";

const Schema = mongoose.Schema;

export type TUser = {
	username: string,
	password: string,
	authLevel: 'ADMIN' | 'USER',
	likedPostIds: Array<string> ;
}

// we need to refer to the likedPostIds as a string, otherwise we create a 
// circular dependency
const UserSchema = new Schema<TUser>({
	username: { type: String, required: true, minlength: 2 },
	password: { type: String, required: true, minlength: 6 },
	authLevel: { type: String, required: true },
	likedPostIds: [{ type: String, required: true }]
});

const User = mongoose.model<TUser>('User', UserSchema);

export default User;
