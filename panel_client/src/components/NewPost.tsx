import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { Writer } from 'tinymce';

export default function NewPost() {
	const [editing, setEditing] = useState(true);
	const editorRef = useRef<Writer | null>(null);
	const previewRef = useRef<HTMLDivElement | null>(null);

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

	const TINY_KEY = import.meta.env.VITE_TINY_KEY;

	return (
	<div>
		<div className={editing? 'block' : 'hidden'}>
			<Editor
				apiKey={TINY_KEY}
				onInit={(_evt, editor) => editorRef.current = editor as unknown as Writer}
				initialValue="<h1>What are you going to blog about today?</h1>"
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
			<button className='btn-primary' onClick={log}>Preview</button>
		</div>
		<div className={editing? 'hidden' : 'block blog blog-root'}>
			<div ref={previewRef}>
			</div>
			<button className='btn-primary' onClick={edit}>Back to editing</button>
		</div>
	</div>
	);
}
