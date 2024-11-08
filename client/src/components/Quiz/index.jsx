import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import socket from '../../socket';


const Quiz = () => {
  const location = useLocation();
  const { opponentId, playerId } = location.state || {};
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState({});
  const [error, setError] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionTimer, setQuestionTimer] = useState(null);
  const [resultTimer, setResultTimer] = useState(null);


  useEffect(() => {
    if (!gameId || !playerId || !opponentId) {
      console.error('Missing gameId, playerId, or opponentId');
      setError('Missing game or player information.');
      return;
    }

    socket.on('newQuestion', handleNewQuestion);
    socket.on('questionResult', handleQuestionResult);
    socket.on('gameOver', handleGameOver);
    socket.on('error', handleError);
    socket.on('opponentLeft', handleOpponentLeft);

    return () => {
      socket.off('newQuestion', handleNewQuestion);
      socket.off('questionResult', handleQuestionResult);
      socket.off('gameOver', handleGameOver);
      socket.off('error', handleError);
      socket.off('opponentLeft', handleOpponentLeft);
    };
  }, [gameId, playerId, opponentId]);

  const handleOpponentLeft = () => {
    alert('Your opponent has left the game.');
    navigate('/'); 
  };

  const handleNewQuestion = (data) => {
    const { gameId: receivedGameId, questionIndex, question, answers } = data;

    if (receivedGameId !== gameId) return;

    console.log(`Received newQuestion for gameId ${gameId}, questionIndex ${questionIndex}: ${question}`);

    setCurrentQuestion({
      questionIndex,
      question,
      answers,
    });
    setCurrentQuestionIndex(questionIndex);
  
    setCorrectAnswer('');

    setUserAnswers(prev => ({ ...prev, [questionIndex]: undefined }));

    setPhase('answering');
    setTimeLeft(20);

    if (questionTimer) {
      clearInterval(questionTimer);
    }

    if (resultTimer) {
      clearInterval(resultTimer);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('showingResults');
          
          socket.emit('timeUp', { gameId });

          console.log(`Emitted timeUp for gameId ${gameId}`);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setQuestionTimer(timer);
  }

  const handleQuestionResult = (data) => {
    const { gameId: receivedGameId, questionIndex, correctAnswer, scores, player1Correct, player2Correct } = data;

    if (receivedGameId !== gameId) return;
    if (questionIndex !== currentQuestionIndex) return;

    console.log(`Received questionResult for gameId ${gameId}, questionIndex ${questionIndex}: ${correctAnswer}`);

    if (questionTimer) {
      clearInterval(questionTimer);
      setQuestionTimer(null);
    }

    setCorrectAnswer(correctAnswer);
    setFinalScores(scores);


    setOpponentProgress((prev) => prev + 1);

    setPhase('showingResults');
    setTimeLeft(10);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('idle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setResultTimer(timer);
  };

  const handleGameOver = (data) => {
    const { scores } = data;
    console.log('Received gameOver with scores:', scores);

    setGameOver(true);
    setFinalScores(scores);
  };

  const handleError = ({ message }) => {
    setError(message);
  };
  
  
  const handleAnswerSelect = (questionIndex, answer) => {
    if (userAnswers[questionIndex] !== undefined || phase !== 'answering') return;
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
    
    socket.emit('submitAnswer', gameId, questionIndex, answer );
    console.log(`Emitted submitAnswer for gameId ${gameId}, questionIndex ${questionIndex}, answer "${answer}"`);
  };

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (gameOver) {
    const myScore = finalScores[playerId];
    const opponentScore = finalScores[opponentId];

    console.log('Final Scores:', finalScores);
    console.log('My Score:', myScore);
    console.log('Opponent Score:', opponentScore);
    
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
  
  return (
    <div className='Quiz'>
      {phase === 'answering' && currentQuestion && (
        <div>
          <p>Time Left: {timeLeft} seconds</p>
          <p>Your Progress: {userAnswers[currentQuestionIndex] !== undefined ? 1 : 0}/1</p>
          <p>Opponent's Progress: {opponentProgress}/1</p>

          <h3>{decodeHtml(currentQuestion.question)}</h3>
          <ul>
            {currentQuestion.answers.map((answer, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => handleAnswerSelect(currentQuestion.questionIndex, answer)} 
                  disabled={userAnswers[currentQuestionIndex] !== undefined || phase !== 'answering'}
                >
                  {decodeHtml(answer)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === 'showingResults' && currentQuestion && (
        <div>
          <p>Time Left: {timeLeft} seconds</p>
          <p>Your Progress: 1/1</p>
          <p>Opponent's Progress: {opponentProgress}/1</p>

          <h3>{decodeHtml(currentQuestion.question)}</h3>
          <p>Correct Answer: {decodeHtml(correctAnswer)}</p>
          <p>Your Answer: {userAnswers[currentQuestionIndex] !== undefined ? decodeHtml(userAnswers[currentQuestionIndex]) : 'No Answer'}</p>
          {userAnswers[currentQuestionIndex] === correctAnswer ? <p>Correct!</p> : <p>Incorrect!</p>}
          <p>Current Score: You - {finalScores[playerId]} | Opponent - {finalScores[opponentId]}</p>
        </div>
      )}

      {phase === 'idle' && (
        <div>
          <p>Waiting for the next question...</p>
          <p>Opponent's Progress: {opponentProgress}/1</p>
        </div>
      )}

      {error && <p className="error-text">Error: {error}</p>}
    </div>
  );
};

export default Quiz;
