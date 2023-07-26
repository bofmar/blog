import mongoose from "mongoose";

const Schema = mongoose.Schema;

export type TUser = {
	username: string,
	password: string,
	authLevel: 'ADMIN' | 'USER',
}

const UserSchema = new Schema<TUser>({
	username: { type: String, required: true, minlength: 2 },
	password: { type: String, required: true, minlength: 6 },
	authLevel: { type: String, required: true }
});

const User = mongoose.model<TUser>('User', UserSchema);

export default User;
