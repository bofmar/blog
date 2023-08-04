import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { Writer } from 'tinymce';
import z from 'zod';
import ErrorPar from './ErrorPar';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import URI from '../uri';

interface IPostHandlerProps {
	initialValue?: string;
	initialTitle?: string;
	initialSummary?: string;
	editPost?: boolean;
}

interface IPostErrors {
	title: Array<string> | undefined;
	summary: Array<string> | undefined;
	body: Array<string> | undefined;
}

interface IPayload {
	title: string;
	summary: string;
	body: string;
}

export default function PostHandler({
	initialValue = "<h1>What are you going to blog about today?</h1>",
	initialTitle = '',
	initialSummary = '',
	editPost = false,
	}: IPostHandlerProps ) {
	const [editing, setEditing] = useState(true);
	const editorRef = useRef<Writer | null>(null);
	const previewRef = useRef<HTMLDivElement | null>(null);
	const [title, setTitle] = useState(initialTitle);
	const [summary, setSummary] = useState(initialSummary);
	const [formErrors, setFormErrors] = useState<IPostErrors>({title: [], summary: [], body: []});
	const { postId } = useParams();
	const navigate = useNavigate();
	const Uri = new URI();
	const TINY_KEY = import.meta.env.VITE_TINY_KEY;

	const log = () => {
		if(editorRef.current && previewRef.current) {
			console.log(editorRef.current.getContent());
			previewRef.current.innerHTML = editorRef.current.getContent();
			setEditing(false);
		}
	};

	const edit = () => {
		setEditing(true);
	}

	const ZPost = z.object({
		title: z.string({required_error: "Please provide a title."}).trim().min(1, {message: 'At least one charracter needed'}),
		summary: z.string({required_error: "Pleases provide a summary."}).trim().max(255, {message: 'Maximum length is 255 characters'}),
		body: z.string({required_error: "Pleases provide a body."}).trim().min(1, {message: 'Empty bodies are not allowed'}),
	});

	const createData = async (action: string) => {
		const post: IPayload = {
			title: title,
			summary: summary,
			body: editorRef.current?.getContent() as string
		}
		const validationResult = ZPost.safeParse(post);
		if(!validationResult.success) {
			const errors = validationResult.error.flatten().fieldErrors;
			setFormErrors({title: errors.title,
					summary: errors.summary,
					body: errors.body});
			return
		}
		await sendData(post, action);
	}

	const sendData = async (payload: IPayload, action: string) => {
		try {
		const loadToast = toast.loading('Please wait...');
		const delay = 2000; //ms
		const token = localStorage.getItem('mario-blog-key') || undefined;
		const uri = action === 'POST' ? Uri.posts : Uri.postId(postId as string);

		if(token === undefined) {
			toast.update(loadToast, {render: 'No token present. Please save your work offsite and log in again',
				type: 'error', isLoading: false, autoClose: delay});
			return
		}

		const response = await fetch(uri, {
			method: action,
			mode: 'cors',
			headers: { 'Content-Type' : 'application/json', 
						'Authorization' : `BEARER ${token}` },
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		if (response.status === 400) {
			toast.update(loadToast, {render: 'Invalid form data. Please check the errors and try again',
				type: 'error', isLoading: false, autoClose: delay});
			const errors: IPostErrors = data.errors.fieldErrors;
			setFormErrors({title: errors.title,
					summary: errors.summary,
					body: errors.body});
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

		toast.update(loadToast, {render: 'Success',
			type: 'success', isLoading: false, autoClose: delay});
		setTimeout(() => navigate('/control-panel'), delay);
		} catch (error) {
			console.log(error);
		}
	}


	return (
	<div className="col-span-10 mt-3 mb-32 flex justify-center">
		<div className={`flex flex-col justify-center content-center w-8/12 ${editing? 'block' : 'hidden'}`}>
			<form onSubmit={e => e.preventDefault}>
				<div>
					<label className='label' htmlFor='title'>Title</label>
					<input className='text-input' type='text' id='title' name='title'
						placeholder='An interesting title...' required
						value={title} onChange={e => setTitle(e.target.value)}/>
					{formErrors.title && formErrors.title.map(err => <ErrorPar key={err} msg={err} />)}
				</div>
				<div>
					<label className='label' htmlFor='summary'>Summary</label>
					<textarea className='text-input resize-none h-52' id='summary' name='summary' placeholder='An interesting take...'
						maxLength={255} required
						value={summary} onChange={e => setSummary(e.target.value)}/>
					{formErrors.summary && formErrors.summary.map(err => <ErrorPar key={err} msg={err} />)}
				</div>
			</form>
			<Editor
				apiKey={TINY_KEY}
				onInit={(_evt, editor) => editorRef.current = editor as unknown as Writer}
				initialValue={initialValue}
				init={{
				height: 800,
				menubar: true,
				plugins: [
				'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
				'searchreplace', 'visualblocks', 'code', 'fullscreen',
				'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
				],
				toolbar: 'undo redo | formatselect | ' +
				'bold italic backcolor | alignleft aligncenter ' +
				'alignright alignjustify | bullist numlist outdent indent image link| ' +
				'removeformat | help',
				content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
				}}
			/>
			{formErrors.body && formErrors.body.map(err => <ErrorPar key={err} msg={err} />)}
			<div className='mt-10 flex justify-center gap-20'>
				<button className='btn-primary' onClick={log}>Preview</button>
				{editPost ?
				<button className='btn-primary' onClick={() => createData('PUT')}>Update</button>
				: <button className='btn-primary' onClick={() => createData('POST')}>Save</button>}
			</div>
		</div>
		<div className={editing? 'hidden' : 'blog flex flex-col w-3/4'}>
			<div ref={previewRef}>
			</div>
			<button className='btn-primary' onClick={edit}>Back to editing</button>
		</div>
		<ToastContainer theme='dark' />
	</div>
	);
}
