import { IUser } from "../types";
import useFetch from "../hooks/useFetch";
import URI from "../uri";
import UserCard from "./UserCard";

export default function AllUsers() {
	const Uri = new URI;
	const {data: users, error, loading} = useFetch<Array<IUser>>(Uri.users);

	return (
	<div className="col-span-10 flex flex-col justify-center content-center items-center my-32">
		{error && !users && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{users && <ol className="text-white">
						{users.map((user, i) => <li key={user._id}>
							<UserCard user={user} index={i} />
						</li>)}
					</ol>}
	</div>
	);
}
