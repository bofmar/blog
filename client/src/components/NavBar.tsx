import { NavLink } from "react-router-dom";
import {} from "react-router-dom";

export default function NavBar() {
	return (
	<nav className="fixed w-screen h-16 bg-neon-green font-mono text-lg font-semibold flex justify-end items-center gap-5 pr-12">
		<NavLink className="hover:underline hover:scale-110" to='/'>Home</NavLink>
		<a className="hover:underline hover:scale-110" href="https://mpofilakis.netlify.app/" target="_blank">About</a>
		<NavLink className="hover:underline hover:scale-110" to='/'>Log In</NavLink>
		<NavLink className="hover:underline hover:scale-110" to='/'>Sign Up</NavLink>
	</nav>
	);
}
