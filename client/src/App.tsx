import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import { AuthContextProvider } from './hooks/AuthContext';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />
		},
	]);

	return (
		<div className='bg-gradient-to-br from-zinc-950 to-zinc-800 min-h-screen'>
			<AuthContextProvider>
				<RouterProvider router={router} />
			</AuthContextProvider>
		</div>
	);
}

export default App
