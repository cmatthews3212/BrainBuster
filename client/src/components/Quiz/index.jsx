import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../socket';


const Quiz = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('waiting');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    if (!gameId) {
      setError('Missing game ID.');
      return;
    }

    socket.on('newQuestion', handleNewQuestion);
    socket.on('showAnswer', handleShowAnswer);
    socket.on('gameOver', handleGameOver);

    socket.on('opponentLeft', () => {
      setError('Opponent has left the game.');
      navigate('/');
    });

    socket.on('error', (data) => {
      setError(data.message);
      navigate('/');
    });

    return () => {
      socket.off('newQuestion', handleNewQuestion);
      socket.off('showAnswer', handleShowAnswer);
      socket.off('gameOver', handleGameOver);
      socket.off('opponentLeft');
      socket.off('error');
    };
  }, [gameId, navigate]);

  const handleNewQuestion = (data) => {
    const { questionIndex, question, answers } = data;

    setCurrentQuestion({
      question,
      answers,
    });
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setPhase('answering');
    setTimeLeft(20); 
  };
  
  const handleShowAnswer = (data) => {
    const { questionIndex, correctAnswer, players } = data;

    setCorrectAnswer(correctAnswer);

    const userAnswer = players[socket.id];
    if (userAnswer === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setSelectedAnswer(userAnswer);
    setPhase('feedback');
    setTimeLeft(10); 
  };
  
  const handleGameOver = (data) => {
    const { scores, result } = data;
    setFinalScores(scores);
    setResult(result);
    setGameOver(true);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);
  
  if (gameOver) {
    const myScore = finalScores[socket.id] || 0;
    const opponentId = Object.keys(finalScores).find(id => id !== socket.id);
    const opponentScore = finalScores[opponentId] || 0;

    let resultText;
    if (result.winner === socket.id) {
      resultText = 'You Win!';
    } else if (result.winner === null) {
      resultText = "It's a Tie!";
    } else {
      resultText = 'You Lose!';
    }

    return (
      <div className="game-over-container">
        <h2>Game Over</h2>
        <p>Your Score: {myScore}</p>
        <p>Opponent's Score: {opponentScore}</p>
        <h3>{resultText}</h3>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }
  
  return (
    <div className="quiz-container">
      {error && <p className="error-text">Error: {error}</p>}

      {phase === 'answering' && currentQuestion && (
        <div>
          <h3>Question {currentQuestionIndex + 1}</h3>
          <p>{decodeHtml(currentQuestion.question)}</p>
          <ul>
            {currentQuestion.answers.map((answer, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleAnswerClick(answer)}
                  disabled={selectedAnswer !== null}
                  className={selectedAnswer === answer ? 'selected' : ''}
                >
                  {decodeHtml(answer)}
                </button>
              </li>
            ))}
          </ul>
          <p>Time Left: {timeLeft} seconds</p>
        </div>
      )}

      {phase === 'feedback' && currentQuestion && (
        <div>
          <h3>Question {currentQuestionIndex + 1} Results</h3>

          {selectedAnswer ? (
            selectedAnswer === decodeHtml(correctAnswer) ? (
              <p className="correct">Correct!</p>
            ) : (
              <p className="incorrect">
                Incorrect! The correct answer is: {decodeHtml(correctAnswer)}
              </p>
            )
          ) : (
            <p className="incorrect">
              Time's up! The correct answer is: {decodeHtml(correctAnswer)}
            </p>
          )}
          <p>Next question in: {timeLeft} seconds</p>
        </div>
      )}
    </div>
  );

  function handleAnswerClick(answer) {
    if (phase !== 'answering') return;

    setSelectedAnswer(answer);
    socket.emit('submitAnswer', { gameId, questionIndex: currentQuestionIndex, answer });
  }
  
  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

};

export default Quiz;
