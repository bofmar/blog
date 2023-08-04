import { NavLink } from "react-router-dom";
import {} from "react-router-dom";

export default function SideBar() {
	return (
	<aside className="col-span-2">
		<nav className="bg-neon-green font-mono text-lg font-semibold flex flex-col pt-52 gap-5 min-h-screen h-full pl-10">
			<NavLink className="hover:underline hover:scale-110" to='/control-panel/all'>All Posts</NavLink>
			<NavLink className="hover:underline hover:scale-110" to='/control-panel/unpublished'>Unpablished</NavLink>
			<NavLink className="hover:underline hover:scale-110" to='/control-panel/new'>New Post</NavLink>
			<NavLink className="hover:underline hover:scale-110" to='/control-panel/comments'>Comments</NavLink>
			<NavLink className="hover:underline hover:scale-110" to='/control-panel/users'>Users</NavLink>
		</nav>
	</aside>
	);
}
