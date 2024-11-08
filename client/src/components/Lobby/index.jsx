import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

  useEffect(() => {
    if (!gameId) return;

    console.log('Lobby useEffect triggered with gameId:', gameId);

    const handleGameStarted = (data) => {
      console.log('Received gameStarted event with data:', data);

      setWaiting(false);
      setOpponent(data.opponentId);

      navigate(`/quiz/${gameId}`,{ 
        state: { 
          questions: [], 
          opponentId: data.opponentId,
          playerId: data.playerId
        } 
      });
    };

    const handleOpponentLeft = () => {
      setOpponent(null);
      console.log('Opponent left game.')
    };

    

    const handleGameInviteRecieved = (data) => {
      console.log('Game invite recieved:', data);
      setInviteReceived(true)
      setInvitingPlayer(data.senderName)
    }

    socket.on('gameInviteReceived', handleGameInviteRecieved);
    socket.on('gameStarted', handleGameStarted);
    socket.on('opponentLeft', handleOpponentLeft);

    return () => {
      socket.off('gameInviteReceived', handleGameInviteRecieved);
      socket.off('gameStarted', handleGameStarted);
      socket.off('opponentLeft', handleOpponentLeft);
    };
  }, [gameId, navigate]);

  const handleAcceptInvite = () => {
    console.log(`Accepting invite from ${invitingPlayer}`);
    socket.emit('acceptGameInvite', {
      gameId,
      opponentId: invitingPlayer,
    })
  }

  const handleDeclineInvite = () => {
    console.log(`Declining invite from ${invitingPlayer}`) 
      setInviteReceived(false);
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
        <h3>{invitingPlayer} has invited you to join their quiz!</h3>
        <button onClick={handleAcceptInvite}>Accept</button>
        <button onClick={handleDeclineInvite}>Decline</button>
      </div>
    </div>
  );
};

export default Lobby;