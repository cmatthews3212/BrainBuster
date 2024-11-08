import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';

// comment

const JoinGame = () => {
    console.log('JoinGame component rendered');

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
        
        const handleGameJoined = () => {
            console.log('Received gameJoined event');
            navigate(`/lobby/${gameIdRef.current}`);
        };
        
        const handleError = ({ message }) => {
            setError(message);
        };

        socket.on('gameNotFound', handleGameNotFound);
        socket.on('gameFull', handleGameFull);
        socket.on('gameJoined', handleGameJoined);
        socket.on('error', handleError);

        return () => {
            socket.off('gameNotFound', handleGameNotFound);
            socket.off('gameFull', handleGameFull);
            socket.off('gameJoined', handleGameJoined);
            socket.off('error', handleError);
        };
    }, [navigate]);

    const handleJoinGame = () => {
        console.log('handleJoinGame called');

        if (!gameIdInput.trim()) {
            setError('Please enter a valid Game ID.')
            return;
        }

        gameIdRef.current = gameIdInput;
        setError(null);


        if (!socket.connected) {
            socket.connect();
        }

        console.log('Emitting joinGame with:', { gameId: gameIdInput });
    
        socket.emit('joinGame', { gameId: gameIdInput });
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