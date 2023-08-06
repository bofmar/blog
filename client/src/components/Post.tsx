import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import URI from "../uri";
import { useContext, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import heart from '/heart.png';
import emptyHeart from '../svg/empty-heart.svg';
import { AuthContext } from "../hooks/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function Post() {
	const Auth = useContext(AuthContext);
	const { postId } = useParams();
	const Uri = new URI();
	const { data: post } = useFetch<IPost>(Uri.postId(postId as string));
	const [likes, setLikes] = useState(post?.likes);
	const blogRef = useRef<HTMLDivElement | null>(null);
	const [userLiked, setUserLiked] = useState(liked());

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
		</div>
		}
		<ToastContainer theme="dark" />
	</div>
	);
}
