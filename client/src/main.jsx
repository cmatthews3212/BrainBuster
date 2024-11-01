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

//additional pages for the trivia game 
import Dashboard from './pages/Dashboard.jsx';
import PlayerProfiles from './pages/PlayerProfiles.jsx';
import Rankings from './pages/Rankings.jsx';
import Stats from './pages/Stats.jsx';
import JoinGame from './pages/JoinGame.jsx';
import Gameplay from './pages/Gameplay.jsx';
import Settings from './pages/Settings.jsx';
import QuestionDatabase from './pages/QuestionDatabase.jsx';


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
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/profiles',
        element: <PlayerProfiles />
      },
      {
        path: '/rankings',
        element: <Rankings />
      },
      {
        path: '/stats',
        element: <Stats />
      },
      {
        path: '/join-game',
        element: <JoinGame />
      },
      {
        path: '/gameplay',
        element: <Gameplay />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/question-database',
        element: <QuestionDatabase />
      }
    ],
  },
]);
      

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
