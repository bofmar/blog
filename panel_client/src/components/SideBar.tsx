import { NavLink } from "react-router-dom";
import {} from "react-router-dom";

export default function SideBar() {
	return (
	<aside>
		<nav className="text-white">
			<NavLink to='/control-panel/all'>All Posts</NavLink>
			<NavLink to='/control-panel/unpublished'>Unpablished</NavLink>
			<NavLink to='/control-panel/new'>New Post</NavLink>
			<NavLink to='/control-panel/comments'>New Post</NavLink>
			<NavLink to='/control-panel/users'>New Post</NavLink>
			<NavLink to='/control-panel/statistics'>Statistics</NavLink>
		</nav>
	</aside>
	);
}
