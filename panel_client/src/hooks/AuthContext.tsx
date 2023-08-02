import { ReactNode, createContext, useState } from "react";

interface IAuthProps {
	children: ReactNode;
}

interface IAuthContextType {
	isAuthorized: boolean;
	logIn: () => void;
	logOut: () => void;
}

export const AuthContext = createContext<IAuthContextType | null >(null);

export const AuthContextProvider = ({children}: IAuthProps) => {
	const [isAuthorized, setAuthorized] = useState(false);

	const logIn = () => {
		setAuthorized(true);
	}

	const logOut = () => {
		setAuthorized(false);
	}

	return <AuthContext.Provider value={{isAuthorized, logIn, logOut}}>
			{children}
			</AuthContext.Provider>
}
