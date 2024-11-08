import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import socket from '../../socket';


const Quiz = () => {
  const location = useLocation();
  const { questions, opponentId, playerId } = location.state || {};
  const { gameId } = useParams();
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState({});
  const [error, setError] = useState(null);
  const [mySocketId, setMySocketId] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(0);

  useEffect(() => {
    setMySocketId(socket.id)

    socket.on('opponentAnswer', ({ questionIndex, playerId }) => {
      setOpponentProgress((prev) => prev + 1);
    });

    socket.on('gameOver', ({ scores }) => {
      setGameOver(true);
      setFinalScores(scores);
    });

    return () => {
      socket.off('opponentAnswer');
      socket.off('gameOver');
    };
  }, [opponentId]);
  
  const handleAnswerSelect = (questionIndex, answer) => {
    if (userAnswers[questionIndex] !== undefined) return;
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
    
    if (mySocketId) {
      socket.emit('submitAnswer', gameId, questionIndex, answer );
    };
    
    if (answer === questions[questionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };
  
  const [timeLeft, setTimeLeft] = useState(120);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      socket.emit('timeUp', { gameId });
    } else {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameId]);
  
  if (gameOver) {
    const myScore = finalScores[socket.id];
    const opponentScore = finalScores[opponentId];
    
    const result = 
      myScore > opponentScore
        ? 'You Win!'
        : myScore < opponentScore
        ? 'You Lose!'
        : "It's a Tie!";
    
    return (
      <div>
        <h2>Game Over</h2>
        <p>Your Score: {myScore}</p>
        <p>Opponent's Score: {opponentScore}</p>
        <h3>{result}</h3>
      </div>
    );
  }
  
  const isQuizComplete = Object.keys(userAnswers).length === questions.length;
  
  return (
    <>
      <p>Time Left: {timeLeft} seconds</p>
      <p>Your Progress: {Object.keys(userAnswers).length}/{questions.length}</p>
      <p>Opponent's Progress: {opponentProgress}/{questions.length}</p>

      {error && <p className="error-text">Error: {error}</p>}

      {questions.length > 0 && (
        <div>
          {!isQuizComplete &&
            questions.map((question, index) => (
              <div key={index}>
                <h3>{decodeHtml(question.question)}</h3>
                <ul>
                  {shuffleAnswers([
                    ...question.incorrectAnswers,
                    question.correctAnswer
                  ]).map((answer, idx) => (
                    <li key={idx}>
                      <button onClick={() => handleAnswerSelect(index, answer)} disabled={userAnswers[index] !== undefined}>
                        {decodeHtml(answer)}
                      </button>
                    </li>
                  ))}
                </ul>
                {userAnswers[index] !== undefined && (
                  <p>
                    {userAnswers[index] === questions[index].correctAnswer
                      ? "Correct!"
                      : `Incorrect! The correct answer is ${decodeHtml(
                        questions[index].correctAnswer
                      )}`
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
     </>
    );
  };

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const shuffleAnswers = (answers) => {
  return answers.sort(() => Math.random() - 0.5);
};

export default Quiz;
