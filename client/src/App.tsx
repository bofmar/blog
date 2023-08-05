import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import Home from './components/Home';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />
		},
	]);

	return (
		<div className='bg-gradient-to-br from-zinc-950 to-zinc-800 min-h-screen'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App
