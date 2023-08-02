import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import LogIn from './components/LogIn';
import NewPost from './components/NewPost';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
	{
		path: '/',
		element: <LogIn />
	},
	{
		path: '/control-panel',
		element: <NewPost />
	}
]);

function App() {
	return (
	<div className='bg-gradient-to-br from-zinc-950 to-zinc-800 h-screen'>
		<RouterProvider router={router} />
	</div>
	);
}

export default App
