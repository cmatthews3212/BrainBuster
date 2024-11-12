import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import socket from '../../socket';
import styles from './quiz.module.css';
import Auth from '../../utils/auth';
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_USERS, GET_ME } from "../../utils/queries";
import { ADD_STATS } from "../../utils/mutations";


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
  // const {loading, data} = useQuery(QUERY_USERS);
  const [addStats] = useMutation(ADD_STATS);
  const [wins, setWins] = useState(0);
  const [plays, setPlays] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(location.state?.totalQuestions || 0);
  const [opponentId, setOpponentId] = useState(null);
  const {loading, data} = useQuery(GET_ME)

  const currentGamesWon = data?.me?.stats?.gamesWon || 0
  const currentGamesPlayed = data?.me?.stats?.gamesPlayed || 0

  const handleGameStarted = (data) => {
    const { totalQuestions, opponentId } = data;
    setTotalQuestions(totalQuestions);
    setOpponentId(opponentId);
    console.log(`Quiz: Total Questions set to ${totalQuestions}`);
    console.log(`Quiz: Opponent ID set to ${opponentId}`);
  };
  
  const handleNewQuestion = (data) => {
    const { questionIndex, question, answers, totalQuestions: tq } = data;

    if (tq && tq !== totalQuestions) {
      setTotalQuestions(tq);
    }
    
    setCurrentQuestion({
      question,
      answers,
    });
    setCurrentQuestionIndex(questionIndex);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setPhase('answering');
    setTimeLeft(10); 
  };
  
  const handleShowAnswer = (data) => {
    const { questionIndex, correctAnswer, players } = data;

    setCorrectAnswer(correctAnswer);

    const userAnswer = players[socket.id] || '';

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

    // Update wins and plays
    if (result.winner === socket.id) {
      setWins((prevWins) => prevWins + 1);
    }

    setPlays((prevPlays) => prevPlays + 1);
  };

  useEffect(() => {
    if (!gameId) {
      console.log('Missing game ID.');
      return;
    }
    
    socket.on('gameStarted', handleGameStarted);
    socket.on('newQuestion', handleNewQuestion);
    socket.on('showAnswer', handleShowAnswer);
    socket.on('gameOver', handleGameOver);
    socket.on('opponentLeft', () => {
      console.log('Opponent has left the game.');
      navigate('/');
    });

    socket.on('error', (data) => {
      console.log(data.message);
      navigate('/');
    });

    return () => {
      socket.off('gameStarted', handleGameStarted);
      socket.off('newQuestion', handleNewQuestion);
      socket.off('showAnswer', handleShowAnswer);
      socket.off('gameOver', handleGameOver);
      socket.off('opponentLeft');
      socket.off('error');
    };
  }, [gameId, navigate]);

  // Timer logic for countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Handle stats update when game over and stats have been updated
  useEffect(() => {
    if (gameOver && (wins > 0 || plays > 0)) {
      handleAddStat();
    }
  }, [gameOver, wins, plays]);

  const handleAddStat = async () => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      return false;
    }

    try {
      const { data } = await addStats({
        variables: {
          userId: Auth.getProfile().data._id,
          stats: {
            gamesWon: currentGamesWon + wins,
            gamesPlayed: currentGamesPlayed + plays
          }
        },
      });
      console.log(data);

    } catch (err) {
      console.error(err);
    }
  };

  if (gameOver) {
    const myScore = finalScores[socket.id] || 0;
    const opponentEntry = Object.entries(finalScores).find(([id, score]) => id !== socket.id);
    const opponentScore = opponentEntry ? opponentEntry[1] : 0;

    let resultText;
    if (result.winner === socket.id) {
      resultText = 'You Win!';
    } else if (result.winner === null) {
      resultText = "It's a Tie!";
    } else {
      resultText = 'You Lose!';
    }

    return (
      <div className={styles.gameOverContainer} style={{ marginTop: '100px' }}>
        <h2>Game Over</h2>
        <p>Your Score: {myScore}</p>
        <p>Opponent's Score: {opponentScore}</p>
        <h3>{resultText}</h3>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer} style={{ marginTop: "100px" }}>
      {error && <p className={styles.errorText}>Error: {error}</p>}

      {phase === 'answering' && currentQuestion && (
        <div>
          <h3>Question {currentQuestionIndex + 1} of {totalQuestions}</h3>
          <p>{decodeHtml(currentQuestion.question)}</p>
          <ul className={styles.answersList}>
            {currentQuestion.answers.map((answer, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleAnswerClick(answer)}
                  disabled={selectedAnswer !== null}
                  className={`${styles.answerButton} ${selectedAnswer === answer ? styles.selected : ''}`}
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
          <h3>Question {currentQuestionIndex + 1} of {totalQuestions} Results</h3>
          {selectedAnswer ? (
            selectedAnswer === decodeHtml(correctAnswer) ? (
              <p className={styles.correct}>Correct!</p>
            ) : (
              <p className={styles.incorrect}>
                Incorrect! The correct answer is: {decodeHtml(correctAnswer)}
              </p>
            )
          ) : (
            <p className={styles.incorrect}>
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
