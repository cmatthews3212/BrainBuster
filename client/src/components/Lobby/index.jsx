import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io()

const Lobby = ({ setGameStarted }) => {
    const location = useLocation();
    const { gameId } = location.state || {};
    const [gameFull, setGameFull] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!gameId) return;

        socket.emit('joinGameRoom', { gameId });
        
        socket.on('gameStarted' , (data) => {
            setOpponent(data.opponentId);
            setGameStarted(true);
            console.log('Game started with opponent:', data.opponentId);
        })

        socket.on('waitingForOpponent' , () => {
            setWaiting(true);
        })

        socket.on('gameFull', (gameId) => {
            setGameFull(true);
            setError(`Game ${gameId} is full. Please choose a different one.`);
        })

        socket.on('opponentLeft' , () => {
            setOpponent(null);
            alert('Your opponent left the game.')
        })

        return () => {
            socket.off('gameStarted');
            socket.off('waitingForOpponent');
            socket.off('gameFull');
            socket.off("opponentLeft")
        };
    }, [gameId, setGameStarted]);

    const startGame = () => {
        setGameStarted(true);
    };

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

        {opponent && !gameFull && !waiting && (
          <button onClick={startGame}>Start Game</button>
        )}
      </div>
    </div>
  );
};

export default Lobby;