import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IReturnType<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

export default function useFetch<T>(url: string): IReturnType<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = localStorage.getItem('mario-blog-key') || undefined;
	const navigate = useNavigate();

	useEffect(() => {
		const abort = new AbortController();
		if (token === undefined) {
			navigate('/');			
			return
		}

		setLoading(true);

		async function getData() {
			try {
				const response = await fetch(url,{
					signal: abort.signal,
					headers: { 'Authorization' : `BEARER: ${token}` },
					} 
				);
				const resData = await response.json();
				setData(resData.data);
			} catch(err: unknown) {
				if(typeof err === 'string') {
					setError(err.toUpperCase);
				}else if(err instanceof Error) {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		}
		getData();

		return () => {
			abort.abort();
		}
	},[url]);	

	return { data, loading, error }
}

