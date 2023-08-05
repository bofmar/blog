import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import URI from "../uri";
import { useEffect, useRef } from "react";
import NavBar from "./NavBar";

export default function Post() {
	const { postId } = useParams();
	const Uri = new URI();
	const { data: post } = useFetch<IPost>(Uri.postId(postId as string));
	const blogRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if(post && blogRef.current) {
			blogRef.current.innerHTML = post.body;

		}
	}, [post]);

	return (
	<div>
		<NavBar />
		<div className='blog flex flex-col w-3/4 pt-16'>
			<div ref={blogRef}>
			</div>
		</div>
	</div>
	);
}
