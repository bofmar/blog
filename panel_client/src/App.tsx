import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import LogIn from './components/LogIn';
import { AuthContextProvider } from './hooks/AuthContext';
import RequireAuth from './components/RequireAuth';
import ControlPanel from './components/ControlPanel';
import PostHandler from './components/PostHandler';
import AllPosts from './components/AllPosts';
import EditPost from './components/EditPost';
import Unpublished from './components/Unpablished';
import AllComments from './components/AllComments';
import AllUsers from './components/AllUsers';

const router = createBrowserRouter([
	{
		path: '/',
		element: <LogIn />
	},
	{
		path: '/control-panel',
		element: <RequireAuth children={<ControlPanel />} />,
		children: [
			{index: true, element: <AllPosts />},
			{path: 'new', element: <PostHandler />},
			{path: 'all', element: <AllPosts />},
			{path: 'unpublished', element: <Unpublished />},
			{path: 'comments', element: <AllComments />},
			{path: 'users', element: <AllUsers />},
		]
	},
	{
		path: '/posts/:postId',
		element: <RequireAuth children={<EditPost />} />
	}
]);

function App() {
	return (
	<div className='bg-gradient-to-br from-zinc-950 to-zinc-800 min-h-screen'>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</div>
	);
}

export default App
