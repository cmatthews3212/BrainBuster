import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { useSocket } from '../../contexts/SocketContext'; 
import Auth from '../../utils/auth';
import socket from '../../socket';
const Lobby = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [gameFull, setGameFull] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [opponent, setOpponent] = useState(null);
  const [error, setError] = useState('');
  const [inviteReceived, setInviteReceived] = useState(false);
  const [invitingPlayer, setInvitingPlayer] = useState(null);
  const [inviterId, setInviterId] = useState(null); // New state to store inviterId
  const [inviteSent, setInviteSent] = useState(false);
  const { loading, data } = useQuery(GET_ME);
  const me = data?.me || {};
  const socket = useSocket();
  
  useEffect(() => {
    if (!socket || !gameId) return;
    
    console.log('Lobby useEffect triggered with gameId:', gameId);
    if (me._id) {
      socket.emit('authenticated', me._id);
      console.log(`Emitted 'authenticated' with user ID: ${me._id}`);
    }
    
    const handleGameStarted = (gameData) => {
      console.log('Received gameStarted event with data:', gameData);

      if (!gameData.opponentId) {
        console.error('Opponent ID is undefined. Redirecting to home.');
  
        navigate('/');

        return;
      }
      
      setWaiting(false);
      setOpponent(gameData.opponentId);

      console.log(`Navigating to quiz page for gameId: ${gameId}`);
      
      navigate(`/quiz/${gameId}`,{ 
        state: { 
          totalQuestions: gameData.totalQuestions,
        } 
      });
    };
    
    const handleOpponentLeft = () => {
      setOpponent(null);
      console.log('Opponent left game.');
      navigate('/'); 
    };
    
    
    const handleGameInviteReceived = (gameData) => {
      console.log('Game invite received:', gameData);
      setInviteReceived(true);
      setInvitingPlayer(gameData.senderName);
      setInviterId(gameData.inviterId);
    };
  
    
    socket.on('gameInviteReceived', handleGameInviteReceived);
    socket.on('gameStarted', handleGameStarted);
    socket.on('opponentLeft', handleOpponentLeft);
    
    return () => {
      socket.off('gameInviteReceived', handleGameInviteReceived);
      socket.off('gameStarted', handleGameStarted);
      socket.off('opponentLeft', handleOpponentLeft);
    };
  }, [gameId, navigate, me._id]);
  const handleInvite = (friendId) => {
    const inviterId = me._id;
    socket.emit('gameInvite', {
      gameId,
      friendId,
      inviterId,
      senderName: `${Auth.getProfile().data.firstName} ${me.lastName}`
    })
    console.log('invite send', { gameId, friendId, inviterId })
    setInviteSent(true)
  }
  const handleAcceptInvite = () => {
    console.log(`Accepting invite from ${invitingPlayer}`);
    socket.emit('acceptGameInvite', {
      gameId,
      opponentId: invitingPlayer,
    })
  }
  console.log(data)
  
  const handleDeclineInvite = () => {
    console.log(`Declining invite from ${invitingPlayer}`) 
    setInviteReceived(false);
  }
  
  // console.log(me)
  
  if (loading){
    return <p>loading...</p>
  }
  
  return (
    <div className='Lobby'>
      <h2>BrainBuster Lobby</h2>
      <div className='game-info'>
        <p>
          Game ID: <strong>{gameId}</strong>
        </p>
        {waiting ? (
          <p>Waiting for the game to start...</p>
        ) : (
          <p>Your opponent has joined. The game is starting...</p>
        )}
        {gameFull && <p className='error'>{error}</p>}
      </div>
      <div>
        {/* <h3>{invitingPlayer} has invited you to join their quiz!</h3>
        <button onClick={handleAcceptInvite}>Accept</button>
        <button onClick={handleDeclineInvite}>Decline</button> */}
      </div>
      <div>
        <h3>Your Friends</h3>
        <div  style={{
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
          // margin: '0 auto'
        }}>
        {me.friends ? (
            me.friends.map((friend) =>(
              <button 
                key={friend._id}
                onClick={() => handleInvite(friend._id)} 
                style={{margin: '10px'}}>
                  Invite {friend.firstName} {friend.lastName} to this game!
              </button>
          ) )
        ) : (
          <p>You have no friends to invite</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;