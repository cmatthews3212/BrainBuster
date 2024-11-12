import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useSocket } from '../../contexts/SocketContext';
import { CREATE_GAME } from '../../utils/mutations';
import './CreateGame.css';

const categories = [
    { label: 'Music', value: 'music'},
    { label: 'Sport and Leisure', value: 'sport_and_leisure'},
    { label: 'Film and TV', value: 'film_and_tv'},
    { label: 'Arts and Literature', value: 'arts_and_literature'},
    { label: 'History', value: 'history'},
    { label: 'Society and Culture', value: 'society_and_culture'},
    { label: 'Science', value: 'science'},
    { label: 'Geography', value: 'geography'},
    { label: 'Food and Drink', value: 'food_and_drink'},
    { label: 'General Knowledge', value: 'general_knowledge'},
  ]
  
const difficulties = ['easy', 'medium', 'hard'];

const CreateGame = () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0].value);
    const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const socket = useSocket();

    const [createGame] = useMutation(CREATE_GAME);

    useEffect(() => {
        if (socket && !socket.connected) {
            socket.connect();
        }
      
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

      return () => {
        socket.off('connect');
      }
    }, [socket]);

    const handleCreateGame = async () => {
        setLoading(true);

        try {
            const { data } = await createGame({
                variables: {
                  amount: 10,
                  category: selectedCategory,
                  difficulty: selectedDifficulty,
                },
            });

            if (data && data.createGame) {
                const gameId = data.createGame._id;

                socket.emit('createGame', { gameId, category: selectedCategory, difficulty: selectedDifficulty });
                console.log('Emitted createGame with gameId:', gameId);
                
                navigate(`/lobby/${gameId}`);
            } else {
                throw new Error('Failed to create game.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error creating game:', error);
            alert(error.message || 'An error occurred while creating the game.');
        }
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh' 
        }}>
            <div style={{ 
                backgroundColor: '#A7FFEB',
                flex: 1,
                padding: '2rem',
                marginTop: '64px'
            }}>
                <div style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>Create a New Game!</h2>
                    
                    <div className='selection-group' style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: '#7E57C2', marginBottom: '1rem' }}>Category:</h3>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1rem'
                        }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    style={{ 
                                        backgroundColor: selectedCategory === cat.value ? '#FF4081' : '#F5F5F5',
                                        color: selectedCategory === cat.value ? '#FFFFFF' : '#7E57C2',
                                        padding: '1rem',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div> 
                    </div>

                    <div className='selection-group' style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: '#7E57C2', marginBottom: '1rem' }}>Difficulty:</h3>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1rem'
                        }}>
                            {difficulties.map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setSelectedDifficulty(diff)}
                                    style={{ 
                                        backgroundColor: selectedDifficulty === diff ? '#FF4081' : '#F5F5F5',
                                        color: selectedDifficulty === diff ? '#FFFFFF' : '#7E57C2',
                                        padding: '1rem',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleCreateGame} 
                        disabled={loading}
                        style={{ 
                            backgroundColor: loading ? '#cccccc' : '#FF4081',
                            color: '#FFFFFF',
                            padding: '1rem 2rem',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            width: '100%',
                            maxWidth: '200px',
                            transition: 'transform 0.2s'
                        }}
                    >
                        {loading ? "Loading..." : "Start Quiz"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGame;