import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import socket from "../../socket";
import { CREATE_GAME } from '../../utils/mutations';

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

    const [createGame] = useMutation(CREATE_GAME);

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

                if (!socket.connected) {
                    socket.connect();
                    socket.on('connect', () => {
                      socket.emit('joinGameRoom', { gameId });
                    });
                  } else {
                    socket.emit('joinGameRoom', { gameId });
                  }

                navigate(`/lobby`, { state: { gameId }});
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
    <div className="create-game-container">
        <h2>Create a New Game!</h2>
        <div className='selection-group'>
            <h3>Category:</h3>
            <hr />
            <div className="category-selection">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={selectedCategory === cat.value ? 'selected' : ''}
                >
                  {cat.label}
                </button>
              ))}
            </div> 
        </div>
        <div>
        <h3>DIFFICULTY</h3>
          <hr />
          <div className="difficulty-selection">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={selectedDifficulty === diff ? 'selected' : ''}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button className="createGameBtn" onClick={handleCreateGame} disabled={loading}>
          { loading ? "Loading..." : "Start Quiz"}
        </button>
    </div>
  );
};
  export default CreateGame;