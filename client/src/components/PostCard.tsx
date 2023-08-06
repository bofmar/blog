import { NavLink } from "react-router-dom";
import { IPost } from "../types";

interface IPostCardProps {
	post: IPost;
}

export default function PostCard({post}: IPostCardProps) {
	return (
		<div className="font-sans w-[300px] sm:w-[600px] ">
			<NavLink className="text-neon-green text-2xl font-bold underline hover:text-off-green" to={`/${post._id}`}>{post.title}</NavLink>
			<p className="text-stone-300">{post.summary}</p>
		</div>
	)
}
