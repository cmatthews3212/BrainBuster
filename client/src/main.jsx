import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./avatar.css";
import "./profile.css";

import App from "./App.jsx";
import Home from "./pages/Home";
import NoMatch from "./pages/NoMatch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import Avatars from "./pages/Avatars.jsx";
import Quiz from "./components/Quiz/index.jsx";
import CreateGame from "./components/CreateGame/index.jsx";
import JoinGame from "./components/JoinGame/index.jsx";
import Lobby from "./components/Lobby/index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leaderboard from "./components/Leaderboard/Leaderboard.jsx";

import FindFriends from "./components/Friends/Find.jsx";
import FriendProfile from "./pages/FriendProfile.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "./utils/auth.js";
import Themes from "./pages/Themes.jsx";
import { ThemeProvider } from "@emotion/react";
// import AvatarDisplay  from './components/Avatar/AvatarDisplay.jsx';

//additional pages for the trivia game
// import Dashboard from './pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NoMatch />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/avatars",
        element: <Avatars />,
      },
      {
        path: "/quiz/:gameId",
        element: <Quiz />,
      },
      {
        path: "/find",
        element: <FindFriends />,
      },
      {
        path: "/friend",
        element: <FriendProfile />,
      },
      {
        path: "/create-game",
        element: <CreateGame />,
      },
      {
        path: "/join-game",
        element: <JoinGame />,
      },
      {
        path: "/lobby/:gameId",
        element: <Lobby />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/profile/:id",
        element: <FriendProfile />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/themes",
        element: <Themes />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
