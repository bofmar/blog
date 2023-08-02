import { ReactNode, useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface IRequireAuthProps {
	children: ReactNode;
}

export default function RequireAuth({ children }: IRequireAuthProps) {
  const  Auth = useContext(AuthContext);
  const location = useLocation();

  return Auth?.isAuthorized === true ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }} />
  );
}
