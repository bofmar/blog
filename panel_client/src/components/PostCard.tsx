import { NavLink } from "react-router-dom";
import { IPost } from "../types";
import heart from '/heart.png';
import edit from '../svg/edit.svg';
import del from '../svg/delete.svg';

interface IPostCardProps {
	post: IPost;
}

export default function PostCard({post}: IPostCardProps) {
	return (
		<div className="font-sans w-[600px]">
			<NavLink className="text-neon-green text-xl font-bold underline hover:text-off-green" to={`/posts/${post._id}`}>{post.title}</NavLink>
			<p className="text-stone-300">{post.summary}</p>
			<span className={`pr-10 font-bold ${post.status === 'UNPUBLISHED' ? 'text-amber-300' : 'text-cyan-500'}`}>{post.status}</span>
			<span>{post.likes}
				<img className="w-6 inline ml-5" src={heart} />
			</span>
			<div className="mt-5 flex gap-5">
				<button className="btn-primary">{post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
				<button className="btn-primary flex gap-2">
					<img className='w-6' src={edit} />Edit
				</button>
				<button className="btn-secondary flex gap-2">
					<img className='w-6' src={del} />Delete
				</button>
			</div>
		</div>
	)
}
