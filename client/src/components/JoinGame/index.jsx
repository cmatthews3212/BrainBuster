import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';

const JoinGame = () => {
    const [gameIdInput, setGameIdInput] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleJoinGame = () => {
        if (!gameIdInput.trim()) {
            setError('Please enter a valid Game ID.')
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('joinGame', gameIdInput);

        socket.on('gameNotFound', () => {
            setError('Game not found.')
        });

        socket.on('gameFull', () => {
            setError('Game is full.')
        });

        socket.on('gameStarted', () => {
            navigate(`/lobby/${gameIdInput}`);
        });

        socket.on('error', ({ message }) => {
            setError(message);
        });
    };

    React.useEffect(() => {
        return () => {
            socket.off('gameNotFound');
            socket.off('gameFull');
            socket.off('gameStarted');
            socket.off('error'); 
        };
    }, []);

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