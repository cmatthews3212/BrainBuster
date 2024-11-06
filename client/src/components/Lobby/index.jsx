import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../../socket';

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = location.state || {};
  const [gameFull, setGameFull] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gameId) return;

    socket.emit('joinGame', { gameId });

    const handleGameStarted = (data) => {
      setWaiting(false);
      setOpponent(data.opponentId);
      navigate(`/quiz/${gameId}`, {state: { questions: data.questions, opponentId: data.opponentId } });
    }

    const handleWaitingForOpponent = () => {
      setWaiting(true);
    };

    const handleGameFull = () => {
      setGameFull(true);
      setError(`Game ${gameId} is full. Please choose a different one.`);
    };

    const handleOpponentLeft = () => {
      setOpponent(null);
      alert('Your opponent left the game.');
    };

    socket.on('gameStarted', handleGameStarted);
    socket.on('waitingForOpponent', handleWaitingForOpponent);
    socket.on('gameFull', handleGameFull);
    socket.on('opponentLeft', handleOpponentLeft);

    return () => {
      socket.off('gameStarted', handleGameStarted);
      socket.off('waitingForOpponent', handleWaitingForOpponent);
      socket.off('gameFull', handleGameFull);
      socket.off('opponentLeft', handleOpponentLeft);
    };
  }, [gameId, navigate]);

  return (
    <div className='Lobby'>
      <h2>BrainBuster Lobby</h2>
      <div className="game-info">
        <p>Game ID: <strong>{gameId}</strong></p>

        {waiting && <p>Waiting for opponent to join...</p>}
    
        {opponent ? (
          <p>Game Started! Your opponent has joined.</p>
        ) : (
          <p>Waiting for an opponent to join...</p>
        )}
        {gameFull && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Lobby;