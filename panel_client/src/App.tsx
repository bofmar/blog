import './App.css'
import NewPost from './components/NewPost';

function App() {
	return (
	<div className='bg-zinc-900 h-screen'>
		<h1 className="text-3xl font-bold underline text-yellow-300" >Hello world!</h1>
		<NewPost />
	</div>
	);
}

export default App
