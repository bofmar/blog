import { NavLink } from "react-router-dom";
import {} from "react-router-dom";

export default function SideBar() {
	return (
	<aside>
		<nav>
			<NavLink to='all'>All Posts</NavLink>
			<NavLink to='unpublished'>Unpablished</NavLink>
			<NavLink to='new'>New Post</NavLink>
			<NavLink to='statistics'>Statistics</NavLink>
		</nav>
	</aside>
	);
}
