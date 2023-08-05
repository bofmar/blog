import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import z from 'zod';
import { AuthContext } from "../hooks/AuthContext";
import URI from "../uri";
import ErrorPar from "./ErrorPar";

const ZUser = z.object({
	username: z.string({required_error: "Please provide a username."}).trim().min(2, {message: 'Usernames must be at least 2 characters long.'}),
	password: z.string({required_error: "Pleases provide a password."}).trim().min(6, {message: 'Passwords must be at least 6 characters long.'}),
});

interface IErrors {
	username: Array<string> | undefined;
	password: Array<string> | undefined;
}

export default function LogIn() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState<IErrors>({username: [], password: []});
	const token = localStorage.getItem('mario-blog-key') || undefined;
	const Auth = useContext(AuthContext);
	const navigate = useNavigate();
	const Uri = new URI();

	useEffect(() => {
		if(token === undefined) {
			return;
		}

		const abort = new AbortController();
		async function getAuth() {
			try {
				const response = await fetch(Uri.auth, { 
					signal: abort.signal,
					mode: 'cors',
					headers: { 'Authorization' : `BEARER: ${token}` },
				});
				const resData = await response.json();
				if (resData.success) {
					Auth?.logIn();
					navigate('/control-panel');
				}
			} catch(error) {
				console.log(error);
			}
		}

		getAuth();

		return () => {
			abort.abort();
		}
	}, []);

	const validateInput = () => {
		const validationResult = ZUser.safeParse({username: username, password: password});
		if(!validationResult.success) {
			const errors = validationResult.error.flatten().fieldErrors;
			setFormErrors({username: errors.username, password: errors.password});
		}
		return validationResult.success;
	}

	const postData = async () => {
		const loadToast = toast.loading('Please wait...');
		const delay = 2000; //ms
		const payload = {
			username : username,
			password : password,
		}

		const response = await fetch(Uri.adminLogIn, {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type' : 'application/json' },
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		if (response.status === 400) {
			toast.update(loadToast, {render: 'Invalid form data. Please check the errors and try again',
				type: 'error', isLoading: false, autoClose: delay});
			const errors: IErrors = data.errors.fieldErrors;
			setFormErrors({username: errors.username, password: errors.password});
			return;
		}

		if (response.status === 403) {
			toast.update(loadToast, {render: data.data,
				type: 'error', isLoading: false, autoClose: delay});
			return;
		}


		if (response.status !== 200) {
			toast.update(loadToast, {render: 'Something went wrong. Please try again.',
				type: 'error', isLoading: false, autoClose: delay});
			return;
		}

		localStorage.setItem('mario-blog-key', data.token);
		Auth?.logIn();

		toast.update(loadToast, {render: 'Loged in successfully',
			type: 'success', isLoading: false, autoClose: delay});
		setTimeout(() => navigate('/control-panel'), delay);
	}

	const submit = (e: FormEvent) => {
		e.preventDefault();
		const valid = validateInput();
		if(!valid) {
			return
		} 
		postData();
	}

	return (
		<div className="flex items-center justify-center align-middle h-screen">
			<form method='POST' onSubmit={event => submit(event)}>
				<div>
					<label className="label" htmlFor="username">Username</label>
					<input className='text-input' type="text" id='username' name='username' value={username} onChange={e => setUsername(e.target.value)} />
					{formErrors.username && formErrors.username.map(err => <ErrorPar key={err} msg={err}/>)}
				</div>
				<div>
					<label className="label" htmlFor="password">Password</label>
					<input className='text-input' type="password" id='password' name='password' value={password} onChange={e => setPassword(e.target.value)} />
					{formErrors.password && formErrors.password.map(err => <ErrorPar key={err} msg={err}/>)}
				</div>
				<button className="btn-primary">Log In</button>
			</form>
			<ToastContainer theme='dark' />
		</div>
	);
}
