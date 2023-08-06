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
	like: (postId: string) => void;
	dislike: (postId: string) => void;
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

	const like = (postId: string) => {
		const newArr = [...user?.likedPostIds as Array<string>, postId];
		if (user) {
			setUser((prev) => (prev ? {...prev, likedPostIds: newArr} : null));
		}
	};

	const dislike = (postId: string) => {
		const newArr = [...user?.likedPostIds as Array<string>];
		const index = newArr.indexOf(postId);
		newArr.splice(index, 1);
		if (user) {
			setUser((prev) => (prev ? {...prev, likedPostIds: newArr} : null));
		}
	};


	return <AuthContext.Provider value={{isAuthorized, logIn, logOut, user, like, dislike}}>
			{children}
			</AuthContext.Provider>
}
