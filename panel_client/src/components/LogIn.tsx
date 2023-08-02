import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import z from 'zod';

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
	const navigate = useNavigate();
	const url = 'http://localhost:5000/api/users/admin-log-in';

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

		const response = await fetch(url, {
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
		<div>
			<form method='POST' action={url} onSubmit={event => submit(event)}>
				<div>
					<label htmlFor="username">Username</label>
					<input type="text" id='username' name='username' value={username} onChange={e => setUsername(e.target.value)} />
					{formErrors.username && formErrors.username.map(err => <p key={err}>{err}</p>)}
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input type="password" id='password' name='password' value={password} onChange={e => setPassword(e.target.value)} />
					{formErrors.password && formErrors.password.map(err => <p key={err}>{err}</p>)}
				</div>
				<button className="btn-primary">Log In</button>
			</form>
			<ToastContainer theme='dark' />
		</div>
	);
}