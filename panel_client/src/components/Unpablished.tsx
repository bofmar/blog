import { NavLink } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import URI from "../uri";

export default function Unpublished() {
	const Uri = new URI;
	const {data: posts, error, loading} = useFetch<Array<IPost>>(Uri.posts);

	return (
	<div>
		{error && !posts && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{posts && <ul className="text-white">
					{posts.map(post => post.status === 'UNPUBLISHED' ?
						<li key={post._id}>
							<NavLink to={`/posts/${post._id}`}>{post.title}</NavLink>
						</li>  
					:  null)}
					</ul>}
	</div>
	);
}
