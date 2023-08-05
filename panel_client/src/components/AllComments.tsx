import { IComment } from "../types";
import useFetch from "../hooks/useFetch";
import URI from "../uri";
import CommnetCard from "./CommentCard";

export default function AllComments() {
	const Uri = new URI;
	const {data: comments, error, loading} = useFetch<Array<IComment>>(Uri.comments);

	return (
	<div className="col-span-10 flex flex-col justify-center content-center items-center my-32">
		{error && !comments && <p className="text-white">ERROR</p>}
		{loading && <p className="text-white">loading...</p>}
		{comments && <ul className="text-white flex flex-col gap-20 justify-center content-center items-center">
						{comments.map(comment => <li key={comment._id}>
							<CommnetCard comment={comment} />
						</li>)}
					</ul>}
	</div>
	);
}
