import { IComment } from "../types";
import del from '../svg/delete.svg';
import { ToastContainer, toast } from "react-toastify";
import URI from "../uri";

interface ICommentCardProps {
	comment : IComment;
}

export default function CommnetCard({comment}: ICommentCardProps) {
	const Uri = new URI();

	const delComment = async () => {
		try {
		const loadToast = toast.loading('Please wait...');
		const delay = 2000; //ms
		const token = localStorage.getItem('mario-blog-key') || undefined;

		if(token === undefined) {
			toast.update(loadToast, {render: 'No token present. Please save your work offsite and log in again',
				type: 'error', isLoading: false, autoClose: delay});
			return
		}

		const response = await fetch(Uri.commentId(comment._id), {
			method: 'DELETE',
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

	const user = comment.createdBy;
	return (
		<div className="font-sans w-[600px]">
			<p className={
				!user ? 'text-stone-300 font-bold' :
				user.authLevel === 'ADMIN' ?
				'text-amber-300 font-bold' :
				'text-cyan-500 font-bold'}>
			{user ? user.username : 'Annonymous'}
			</p>
			<p className="text-stone-300">{comment.text}</p>
			<button className="btn-secondary flex gap-2" onClick={() => delComment()}>
				<img className='w-6' src={del} />Delete
			</button>
			<ToastContainer theme="dark" />
		</div>
	);
}
