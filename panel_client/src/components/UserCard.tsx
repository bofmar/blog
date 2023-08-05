import { IUser } from "../types";

interface IUserCardProps {
	user: IUser;
	index: number
}

function padLeft(num: number) {
	let str = num.toString();
	for (let i = str.length; i < 3; i++) {
		str = ' ' + str;
	}
	return str;
}

export default function UserCard({user, index}: IUserCardProps) {
	return (
		<div className="font-sans w-[600px] flex justify-center items-center">
			<span className="text-stone-300 text-lg">{`${padLeft(index + 1)}. `}</span>
			<h1 className="text-stone-300 text-lg">{user.username}</h1>
			<span className={`pr-10 font-bold ${user.authLevel === 'ADMIN' ? 'text-amber-300' : 'text-cyan-500'}`}>{` - ${user.authLevel}`}</span>
		</div>
	);
}
