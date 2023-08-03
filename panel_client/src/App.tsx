import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import LogIn from './components/LogIn';
import { AuthContextProvider } from './hooks/AuthContext';
import RequireAuth from './components/RequireAuth';
import ControlPanel from './components/ControlPanel';
import PostHandler from './components/PostHandler';

const router = createBrowserRouter([
	{
		path: '/',
		element: <LogIn />
	},
	{
		path: '/control-panel',
		element: <RequireAuth children={<ControlPanel />} />,
		children: [
			{path: 'new', element: <PostHandler />}
		]
	}
]);

function App() {
	return (
	<div className='bg-gradient-to-br from-zinc-950 to-zinc-800 h-screen'>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</div>
	);
}

export default App
