import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import URI from "../uri";
import PostHandler from "./PostHandler";
import SideBar from "./SideBar";

export default function EditPost() {
	const Uri = new URI();
	const { postId } = useParams();
	const {data: post, loading, error} = useFetch<IPost>(Uri.postId(postId as string));

	return (
		<>
			<SideBar />
			{error && !post && <p className="text-white">ERROR</p>}
			{loading && <p className="text-white">loading...</p>}
			{post && <PostHandler initialValue={post.body} initialTitle={post.title} initialSummary={post.summary} editPost={true}/>}
		</>
	);
}
