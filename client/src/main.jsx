import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './avatar.css'

import App from './App.jsx';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx'
import Avatars from './pages/Avatars.jsx';
import AvatarDisplay  from './components/Avatar/AvatarDisplay.jsx';
import CustomizeAvatar from './components/Avatar/CustomizeAvatar.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NoMatch />,
    children: [
      {
        index: true,
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/about',
        element: <About />
      }, {
        path: '/profile',
        element: <Profile />
      },{
        path: '/avatars',
        element: <Avatars />
      }, {
        path: '/avatar/:src',
        element: <AvatarDisplay />
      }, 
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
