import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function ControlPanel() {
	return (
	<div className="grid grid-cols-12">
		<SideBar />
		<Outlet />
	</div>
	)
}
