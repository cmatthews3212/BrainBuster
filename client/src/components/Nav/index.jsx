import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

function Nav() {
  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="flex-row">
          <li className="mx-1">
            {/* Logout link to clear auth and redirect to home */}
            <a className="link" href="/" onClick={() => Auth.logout()}>
              LOGOUT
            </a>
          </li>
          <li className="mx-1">
            <Link className="link" to="/dashboard">DASHBOARD</Link>
          </li>
          <li className="mx-1">
            <Link className="link" to="/profile">PROFILE</Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex-row">
          <li className="mx-1">
            <Link className="link" to="/signup">SIGNUP</Link>
          </li>
          <li className="mx-1">
            <Link className="link" to="/login">LOGIN</Link>
          </li>
          <li className="mx-1">
            <Link className="link" to="/about">ABOUT</Link>
          </li>
        </ul>
      );
    }
  }

  return (
    <div className="head-container">
    <header className="flex-row px-1">
      <h1>
        <Link className="h1" to="/">BrainBuster</Link>
      </h1>
    </header>
      <nav>
        {showNavigation()}
      </nav>
      </div>
  );
}

export default Nav;
