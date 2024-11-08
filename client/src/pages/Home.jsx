import { useGlobalContext } from "../utils/GlobalState";
import { QUERY_USERS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { SET_USERS } from "../utils/actions";
import JoinGame from "../components/Game/JoinGame";
import { useNavigate } from "react-router-dom";
import AuthService from '../utils/auth';

const Home = () => {
  const navigate = useNavigate();

  const [state, dispatch] = useGlobalContext();
  const {data, loading} = useQuery(QUERY_USERS);
    
    
    const users = data?.users || []
    console.log(users)

    useEffect(() => {
        dispatch({type: SET_USERS, payload: users})
    }, [data])

    if (loading) {
        return <h3>Loading...</h3>
    }

    const handleCreateGame = () => {
      navigate('/create-game');
    }

    const handleJoinGame = () => {
      navigate('/join-game');
    }

  return (
    <div className="container">
     <div className="avatarCont"></div>
     <div className="join">
      {AuthService.loggedIn() ? (
          <div className="game-options">
            <button onClick={handleCreateGame}>Create Game</button>
            <button onClick={handleJoinGame}>Join Game</button>
          </div>
        ) : (
          <p>Please log in to create or join a game.</p>
        )}

     <JoinGame></JoinGame>

     </div>
     {/* {state.users.map(user => (<div key={user.email}>{user.email}</div>))} */}
    </div>
  );
};

export default Home;
