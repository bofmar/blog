import { ReactNode, createContext, useState } from "react";
import { IUser } from "../types";

interface IAuthProps {
	children: ReactNode;
}

interface IAuthContextType {
	isAuthorized: boolean;
	logIn: (user: IUser) => void;
	logOut: () => void;
	user: IUser | null;
}

export const AuthContext = createContext<IAuthContextType | null >(null);

export const AuthContextProvider = ({children}: IAuthProps) => {
	const [isAuthorized, setAuthorized] = useState(false);
	const [user, setUser] = useState<IUser | null>(null);

	const logIn = (user: IUser) => {
		setAuthorized(true);
		setUser(user);
	}

	const logOut = () => {
		setAuthorized(false);
		setUser(null);
		localStorage.removeItem('mario-blog-key');
	}

	return <AuthContext.Provider value={{isAuthorized, logIn, logOut, user}}>
			{children}
			</AuthContext.Provider>
}
