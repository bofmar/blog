import { IComment } from "../types";
import useFetch from "../hooks/useFetch";
import URI from "../uri";
import { NavLink } from "react-router-dom";

export default function AllComments() {
	const Uri = new URI;
	const {data: comments, error, loading} = useFetch<Array<IComment>>(Uri.comments);

	return (
	<div>
		{error && !comments && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{comments && <ul className="text-white">
						{comments.map(comment => <li key={comment._id}>
							<NavLink to={`/posts/${comment._id}`}>{comment.text}</NavLink>
						</li>)}
					</ul>}
	</div>
	);
}
