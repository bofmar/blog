import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import URI from "../uri";
import PostCard from "./PostCard";

export default function Unpublished() {
	const Uri = new URI;
	const {data: posts, error, loading} = useFetch<Array<IPost>>(Uri.posts);

	return (
	<div className="col-span-10 flex flex-col justify-center content-center my-32">
		{error && !posts && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{posts && <ul className="text-white flex flex-col gap-20 justify-center content-center items-center">
					{posts.map(post => post.status === 'UNPUBLISHED' ?
						<li key={post._id}>
							<PostCard post={post} />
						</li>  
					:  null)}
					</ul>}
	</div>
	);
}
