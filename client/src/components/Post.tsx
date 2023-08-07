import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import URI from "../uri";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import heart from '/heart.png';
import emptyHeart from '../svg/empty-heart.svg';
import { AuthContext } from "../hooks/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import CommnetCard from "./CommentCard";
import { z } from "zod";
import { NavLink } from "react-router-dom";

export default function Post() {
	const Auth = useContext(AuthContext);
	const { postId } = useParams();
	const Uri = new URI();
	const { data: post } = useFetch<IPost>(Uri.postId(postId as string));
	const [ userComment, setUserComment ] = useState('');
	const [likes, setLikes] = useState(post?.likes);
	const blogRef = useRef<HTMLDivElement | null>(null);
	const [userLiked, setUserLiked] = useState(liked());
	const token = localStorage.getItem('mario-blog-key') || undefined;

	useEffect(() => {
		if(token === undefined) {
			return;
		}
		const abort = new AbortController();
		async function getAuth() {
			try {
				const response = await fetch(Uri.auth, { 
					signal: abort.signal,
					mode: 'cors',
					headers: { 'Authorization' : `BEARER: ${token}` },
				});
				const resData = await response.json();
				if (resData.success) {
					Auth?.logIn(resData.data);
				}
			} catch(error) {
				console.log(error);
			}
		}
		getAuth();
		return () => {
		}
	}, []);

	useEffect(() => {
		if(post && blogRef.current) {
			blogRef.current.innerHTML = post.body;
			setLikes(post?.likes);

		}
	}, [post]);

	function liked(): boolean {
		if (!Auth || !Auth.user){
			return false;
		}
		return Auth.user.likedPostIds.includes(postId as string);
	}

	async function registerLike(): Promise<void> {
		if (!Auth || !Auth.user){
			return
		}

		// update state
		setUserLiked(!userLiked);
		let payload: IPost | null;
		const like = liked();
		if (like) {
			Auth.dislike(postId as string);
			payload = post ? {...post, likes: post!.likes - 1 } : null;
			setLikes(likes as number - 1);
		} else {
			Auth.like(postId as string);
			payload = post ? {...post, likes: post!.likes + 1 } : null;
			setLikes(likes as number + 1);
		}
		if(payload) {
			await sendUpdate(payload, like);
			console.log(payload);
		}
	}
	const sendUpdate = async (payload: IPost, like: boolean) => {
		try {
		const loadToast = toast.loading('Please wait...');
		const delay = 2000; //ms
		const token = localStorage.getItem('mario-blog-key') || undefined;
		const url = like ? Uri.dislike(postId as string) : Uri.like(postId as string);

		if(token === undefined) {
			toast.update(loadToast, {render: 'No token present. Please save your work offsite and log in again',
				type: 'error', isLoading: false, autoClose: delay});
			return
		}

		const response = await fetch(url, {
			method: 'PUT',
			mode: 'cors',
			headers: { 'Content-Type' : 'application/json', 
						'Authorization' : `BEARER ${token}` },
			body: JSON.stringify(payload)
		});
		if (response.status !== 200) {
			toast.update(loadToast, {render: 'Something went wrong. Please try again.',
				type: 'error', isLoading: false, autoClose: delay});
			return;
		}

		toast.update(loadToast, {render: 'Saved!',
			type: 'success', isLoading: false, autoClose: delay});
		} catch(error) {
			console.log(error);
		}
	}

	const ZComment = z.string({required_error: "Please provide a comment."}).trim().min(20, {message: 'Comments must be at least 20 characters long'});

	const sendComment = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
		if (!Auth || !Auth.user || !ZComment.safeParse(userComment).success) {
			return
		}
		const loadToast = toast.loading('Please wait...');
		const delay = 2000; //ms
		const token = localStorage.getItem('mario-blog-key') || undefined;

		if(token === undefined) {
			toast.update(loadToast, {render: 'No token present. Please save your work offsite and log in again',
				type: 'error', isLoading: false, autoClose: delay});
			return
		}

		const response = await fetch(Uri.comments, {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type' : 'application/json', 
						'Authorization' : `BEARER ${token}` },
			body: JSON.stringify({comment: userComment ,post: postId})
		});
		if (response.status !== 200) {
			console.log(await response.json());
			toast.update(loadToast, {render: 'Something went wrong. Please try again.',
				type: 'error', isLoading: false, autoClose: delay});
			return;
		}

		toast.update(loadToast, {render: 'Saved!',
			type: 'success', isLoading: false, autoClose: delay});
		setTimeout(() => window.location.reload(), delay);
		} catch(error) {
			console.log(error);
		}
	}

	return (
	<div>
		<NavBar />
		{ post &&
		<div className='blog flex flex-col w-3/4 py-16'>
			<div ref={blogRef}>
			</div>
			<div className="flex justify-center items-center gap-5">
				<span className="text-sm"> What did you think? Leave me a like if you enjoyed the post!</span>
				<div className="flex justify-center items-center gap-5">
					<button onClick={() => registerLike()}>{
						userLiked ?
						<img className="w-6 inline" src={heart} /> :
						<img className="w-6 inline" src={emptyHeart} />
						}
					</button>
					<span>{likes}</span>
				</div>
			</div>
			{ Auth && Auth.user ?
			<form onSubmit={e => e.preventDefault}>
				<label className='label' htmlFor='summary'>Comment</label>
				<textarea className='text-input resize-none h-52' id='summary' name='summary' placeholder='An interesting take...'
					maxLength={255} required
					value={userComment} onChange={e => setUserComment(e.target.value)}/>
				<div className="text-sm text-stone-400 pb-5">Minimu 20 characters</div>
				<button className="btn-primary" onClick={(e) => sendComment(e)}>Submit</button>
			</form> :
			<div className="flex flex-col jusify-center items-center mt-8">
				<p>If you'd like to leave a comment, please <NavLink to='/log-in'>Log In</NavLink></p>
				<p>Don't have an account? <NavLink to='/sign-up'>Sign up!</NavLink></p>
			</div>}
			<div className="col-span-10 flex flex-col justify-center content-center items-center my-32">
				{post.comments && <ul className="text-white flex flex-col gap-20 justify-center content-center items-center">
					{post.comments.map(comment => <li key={comment._id}>
							<CommnetCard comment={comment} />
							</li>)}
					</ul>}
			</div>
		</div>
		}
		<ToastContainer theme="dark" />
	</div>
	);
}
