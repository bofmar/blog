import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { Writer } from 'tinymce';

export default function NewPost() {
	const editorRef = useRef<Writer | null>(null);
	const log = () => {
		if(editorRef.current) {
			console.log(editorRef.current.getContent());
		}
	};

	const TINY_KEY = import.meta.env.VITE_TINY_KEY;
	console.log(TINY_KEY);

	return (
	<div>
		<Editor
			apiKey={TINY_KEY}
			onInit={(_evt, editor) => editorRef.current = editor as unknown as Writer}
			initialValue="<p>This is the initial content of the editor.</p>"
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
       <button onClick={log}>Log editor content</button>
	</div>
	);
}
