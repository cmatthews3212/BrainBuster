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

  useEffect(() => {
    if (!gameId) return;

    console.log('Lobby useEffect triggered with gameId:', gameId);

    const handleGameStarted = (data) => {
      console.log('Received gameStarted event with data:', data);
      setWaiting(false);
      setOpponent(data.opponentId);
      navigate(`/quiz/${gameId}`,{ 
        state: { 
          questions: data.questions, 
          opponentId: data.opponentId 
        } 
      });
    };

    const handleOpponentLeft = () => {
      setOpponent(null);
      alert('Your opponent left the game.');
    };

    socket.on('gameStarted', handleGameStarted);
    socket.on('opponentLeft', handleOpponentLeft);

    return () => {
      socket.off('gameStarted', handleGameStarted);
      socket.off('opponentLeft', handleOpponentLeft);
    };
  }, [gameId, navigate]);

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
    </div>
  );
};

export default Lobby;