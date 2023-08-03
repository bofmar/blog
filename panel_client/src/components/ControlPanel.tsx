import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function ControlPanel() {
	return (
	<div>
		<SideBar />
		<Outlet />
	</div>
	)
}
