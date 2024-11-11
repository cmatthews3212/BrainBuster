import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import './JoinGame.css';
import { useTheme } from '../../pages/ThemeContext';

// comment

const JoinGame = () => {
    console.log('JoinGame component rendered');

    const [gameIdInput, setGameIdInput] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const gameIdRef = useRef('');
    const { theme } = useTheme();

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

    const handleQuickPlay = () => {
        console.log('handleQuickPlay called');

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
            <div className="join-game-header">
                <h2>Join Game</h2>
            </div>
            <div className="join-game-content">
                <div className="join-game-card">
                    <h3>Quick Play</h3>
                    <p>Join an existing game session</p>
                    <input
                        type='text'
                        placeholder='Enter Game ID'
                        value={gameIdInput}
                        onChange={(e) => setGameIdInput(e.target.value)}
                    />
                    <button 
                        className="join-button"
                        onClick={handleQuickPlay}
                    >
                        Join Game
                    </button>
                </div>

                <div className="join-game-card">
                    <h3>Invite Friends</h3>
                    <p>Create a new game with friends</p>
                    <button 
                        className="invite-button"
                    >
                        Invite Friends
                    </button>
                </div>
            </div>
            {error && <p className='error-text'>{error}</p>}
        </div>
    );
};

export default JoinGame;