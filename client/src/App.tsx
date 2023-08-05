import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Home from './components/Home';
import { AuthContextProvider } from './hooks/AuthContext';
import LogIn from './components/LogIn';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />
		},
		{
			path: '/log-in',
			element: <LogIn />
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
