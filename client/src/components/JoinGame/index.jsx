import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';

const JoinGame = () => {
    const [gameIdInput, setGameIdInput] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const gameIdRef = useRef('');

    useEffect(() => {
        const handleGameNotFound = () => {
            setError('Game not found.');
        };
        
        const handleGameFull = () => {
            setError('Game is full.');
        };
        
        const handleGameStarted = () => {
            navigate(`/lobby/${gameIdRef.current}`);
        };
        
        const handleError = ({ message }) => {
            setError(message);
        };

        socket.on('gameNotFound', handleGameNotFound);
        socket.on('gameFull', handleGameFull);
        socket.on('gameStarted', handleGameStarted);
        socket.on('error', handleError);

        return () => {
            socket.off('gameNotFound', handleGameNotFound);
            socket.off('gameFull', handleGameFull);
            socket.off('gameStarted', handleGameStarted);
            socket.off('error', handleError);
        };
    }, [navigate]);

    const handleJoinGame = () => {
        if (!gameIdInput.trim()) {
            setError('Please enter a valid Game ID.')
            return;
        }

        gameIdRef.current = gameIdInput;
        setError(null);

        if (!socket.connected) {
            socket.connect();
        }
    
        socket.emit('joinGame', gameIdInput);
    };

    return (
        <div className='join-game-container'>
            <h2>Join a Game</h2>
            <input
                type='text'
                placeholder='Enter Game ID'
                value={gameIdInput}
                onChange={(e) => setGameIdInput(e.target.value)}
            />
            <button onClick={handleJoinGame}>Join Game</button>
            {error && <p className='error-text'>{error}</p>}
        </div>
    );
};

export default JoinGame;