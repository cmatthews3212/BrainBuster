import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import socket from '../../socket';


const Quiz = () => {
  const location = useLocation();
  const { questions, opponentId, playerId } = location.state || {};
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [processedQuestions, setProcessedQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState({});
  const [error, setError] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(0);

  useEffect(() => {
    console.log('Quiz component received location.state:', location.state);
    console.log('Quiz component playerId:', playerId);
    console.log('Quiz component opponentId:', opponentId);
    console.log('Quiz component gameId:', gameId);

    if (!gameId || !playerId || !opponentId) {
      console.error('Quiz: Missing gameId, playerId, or opponentId');
      setError('Missing game or player information.');
      return;
    }

    if (questions && questions.length > 0) {
      const shuffled = questions.map((question) => {
        const shuffledAnswers = shuffleAnswers([
          ...question.incorrectAnswers,
          question.correctAnswer,
        ]);

        return {
          ...question,
          shuffledAnswers,
        };
      });
      setProcessedQuestions(shuffled);
    }
  }, [questions, gameId, playerId, opponentId, location.state]);

  useEffect(() => {
    socket.on('opponentAnswer', ({ questionIndex, playerId: answeringPlayerId }) => {
      console.log("Received opponentAnswer:", { questionIndex, answeringPlayerId });
      setOpponentProgress((prev) => prev + 1);
    });

    socket.on('gameOver', ({ scores }) => {
      console.log("Received gameOver with scores:", scores);
      setGameOver(true);
      setFinalScores(scores);
    });

    return () => {
      socket.off('opponentAnswer');
      socket.off('gameOver');
    };
  }, []);
  
  const handleAnswerSelect = (questionIndex, answer) => {
    if (userAnswers[questionIndex] !== undefined) return;
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
    
    socket.emit('submitAnswer', gameId, questionIndex, answer );
    console.log(`Emitted submitAnswer for gameId ${gameId}, questionIndex ${questionIndex}, answer "${answer}"`);
    
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

      {processedQuestions.length > 0 && (
        <div>
          {!isQuizComplete &&
            processedQuestions.map((question, index) => (
              <div key={index}>
                <h3>{decodeHtml(question.question)}</h3>
                <ul>
                {question.shuffledAnswers.map((answer, idx) => (
                    <li key={idx}>
                      <button onClick={() => handleAnswerSelect(index, answer)} disabled={userAnswers[index] !== undefined}>
                        {decodeHtml(answer)}
                      </button>
                    </li>
                  ))}
                </ul>
                {userAnswers[index] !== undefined && (
                  <p>
                    {userAnswers[index] === question.correctAnswer
                      ? "Correct!"
                      : `Incorrect! The correct answer is ${decodeHtml(
                        question.correctAnswer
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
