import { useContext, useEffect } from "react";
import NavBar from "./NavBar";
import { AuthContext } from "../hooks/AuthContext";
import URI from "../uri";
import useFetch from "../hooks/useFetch";
import { IPost } from "../types";
import PostCard from "./PostCard";

export default function Home() {
	const Auth = useContext(AuthContext);
	const Uri = new URI();
	const token = localStorage.getItem('mario-blog-key') || undefined;
	const {data: posts, error, loading} = useFetch<Array<IPost>>(Uri.posts);

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
			abort.abort();
		}
	}, []);

	return (
	<div>
		<NavBar />
		<div className="flex flex-col justify-center content-center pb-32">
			<h1 className="text-2xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-neon-green to-off-green py-32 center">One Ordinary Dev</h1>
			{error && !posts && <p className="text-white">ERROR</p>}
			{loading && <p className="text-white">loading...</p>}
			{posts && <ul className="text-white flex flex-col gap-20 justify-center content-center items-center">
							{posts.map(post => post.status === 'PUBLISHED' ? <li key={post._id}>
								<PostCard post={post} />
							</li> : null)}
						</ul>}
		</div>
	</div>
	);
}
