import { IUser } from "../types";
import useFetch from "../hooks/useFetch";
import URI from "../uri";
import { NavLink } from "react-router-dom";

export default function AllUsers() {
	const Uri = new URI;
	const {data: users, error, loading} = useFetch<Array<IUser>>(Uri.users);

	return (
	<div>
		{error && !users && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{users && <ul className="text-white">
						{users.map(user => <li key={user._id}>
							<NavLink to={`/posts/${user._id}`}>{user.username}</NavLink>
						</li>)}
					</ul>}
	</div>
	);
}
