import { NavLink, useNavigate } from "react-router-dom";
import { IPost } from "../types";
import heart from '/heart.png';
import edit from '../svg/edit.svg';
import del from '../svg/delete.svg';
import { ToastContainer, toast } from "react-toastify";
import URI from "../uri";

interface IPostCardProps {
	post: IPost;
}

export default function PostCard({post}: IPostCardProps) {
	const navigate = useNavigate();
	const Uri = new URI();

	const handleClick = async (action: string) => {
		try {
		const loadToast = toast.loading('Please wait...');
		const delay = 2000; //ms
		const token = localStorage.getItem('mario-blog-key') || undefined;

		if(token === undefined) {
			toast.update(loadToast, {render: 'No token present. Please save your work offsite and log in again',
				type: 'error', isLoading: false, autoClose: delay});
			return
		}

		const uri = action === 'PUT' ? Uri.publish(post._id) : Uri.postId(post._id);

		const response = await fetch(uri, {
			method: action,
			mode: 'cors',
			headers: { 'Content-Type' : 'application/json', 
						'Authorization' : `BEARER ${token}` },
			body: JSON.stringify({})
		});
		const data = await response.json();

		if (response.status === 403) {
			toast.update(loadToast, {render: data.data,
				type: 'error', isLoading: false, autoClose: delay});
			return;
		}

		if (response.status !== 200) {
			toast.update(loadToast, {render: 'Something went wrong. Please try again.',
				type: 'error', isLoading: false, autoClose: delay});
			return;
		}

		toast.update(loadToast, {render: 'Success',
			type: 'success', isLoading: false, autoClose: delay});
		setTimeout(() => window.location.reload(), delay);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="font-sans w-[600px]">
			<NavLink className="text-neon-green text-xl font-bold underline hover:text-off-green" to={`/${post._id}`}>{post.title}</NavLink>
			<p className="text-stone-300">{post.summary}</p>
			<span className={`pr-10 font-bold ${post.status === 'UNPUBLISHED' ? 'text-amber-300' : 'text-cyan-500'}`}>{post.status}</span>
			<span>{post.likes}
				<img className="w-6 inline ml-5" src={heart} />
			</span>
			<div className="mt-5 flex gap-5">
				<button className="btn-primary" onClick={() => handleClick('PUT')}>
					{post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
				</button>
				<button className="btn-primary flex gap-2" onClick={() => navigate(`/posts/${post._id}`)}>
					<img className='w-6' src={edit} />Edit
				</button>
				<button className="btn-secondary flex gap-2" onClick={() => handleClick('DELETE')}>
					<img className='w-6' src={del} />Delete
				</button>
			</div>
			<ToastContainer theme="dark" />
		</div>
	)
}
