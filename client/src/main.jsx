import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './avatar.css'
import './profile.css';

import App from './App.jsx';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx'
import Avatars from './pages/Avatars.jsx';
import Quiz from './components/Quiz/index.jsx';
import CreateGame from './components/CreateGame/index.jsx'
import JoinGame from './components/JoinGame/index.jsx';
import Lobby from './components/Lobby/index.jsx';
import Dashboard from './pages/Dashboard.jsx';


import FindFriends from './components/Friends/Find.jsx';
import FriendProfile from './components/Friends/Friend.jsx';
// import AvatarDisplay  from './components/Avatar/AvatarDisplay.jsx';


//additional pages for the trivia game 
// import Dashboard from './pages/Dashboard.jsx';


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
        path: '/quiz',
        element: <Quiz />
      }, {
        path: '/find',
        element: <FindFriends />
      }, {
        path: '/friend',
        element: <FriendProfile />
      },{
        path: '/create-game',
        element: <CreateGame />
      }, {
        path: '/join-game',
        element: <JoinGame />
      }, {
        path: '/lobby',
        element: <Lobby />
      },
       {
       path: '/dashboard',
      element: <Dashboard />
       },
    ],
  },
]);
      

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
