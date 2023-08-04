import { IPost } from "../types";
import useFetch from "../hooks/useFetch";
import URI from "../uri";
import { NavLink } from "react-router-dom";

export default function AllPosts() {
	const Uri = new URI;
	const {data: posts, error, loading} = useFetch<Array<IPost>>(Uri.posts);

	return (
	<div>
		{error && !posts && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{posts && <ul className="text-white">
					{posts.map(post => <li key={post._id}><NavLink to={`/posts/${post._id}`}>{post.title}</NavLink></li>)}
					</ul>}
	</div>
	);
}