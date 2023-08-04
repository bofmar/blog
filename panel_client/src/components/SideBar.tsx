import { NavLink } from "react-router-dom";
import {} from "react-router-dom";

export default function SideBar() {
	return (
	<aside>
		<nav className="text-white">
			<NavLink to='/control-panel/all'>All Posts</NavLink>
			<NavLink to='/control-panel/unpublished'>Unpablished</NavLink>
			<NavLink to='/control-panel/new'>New Post</NavLink>
			<NavLink to='/control-panel/comments'>Comments</NavLink>
			<NavLink to='/control-panel/users'>Users</NavLink>
		</nav>
	</aside>
	);
}
