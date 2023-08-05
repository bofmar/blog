import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {} from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

export default function NavBar() {
	const Auth = useContext(AuthContext);

	return (
	<nav className="fixed w-screen h-16 bg-neon-green font-mono text-lg font-semibold flex justify-end items-center gap-5 pr-12">
		<NavLink className="hover:underline hover:scale-110" to='/'>Home</NavLink>
		<a className="hover:underline hover:scale-110" href="https://mpofilakis.netlify.app/" target="_blank">About</a>
		{Auth && !Auth.user &&
		<NavLink className="hover:underline hover:scale-110" to='/'>Log In</NavLink>
		}
		{Auth && !Auth.user &&
		<NavLink className="hover:underline hover:scale-110" to='/'>Sign Up</NavLink>
		}
		{Auth && Auth.user &&
		<NavLink className="hover:underline hover:scale-110" to='/'>Log Out</NavLink>
		}
	</nav>
	);
}
