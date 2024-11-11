import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import socket from '../../socket';
import styles from './quiz.module.css';
import Auth from '../../utils/auth'
import { useMutation, useQuery } from "@apollo/client";
import { GET_ME, QUERY_USERS } from "../../utils/queries";
import { ADD_STATS } from "../../utils/mutations";



const Quiz = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('waiting');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState({});
  const [opponentId, setOpponentId] = useState(null)
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const {loading, data} = useQuery(QUERY_USERS);
  const [addStats] = useMutation(ADD_STATS)
  const usersArray = data.users
  console.log(usersArray)

  const totalQuestions = location.state?.totalQuestions || 0;
  
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

  const handleGameStarted = (data) => {
    const { totalQuestions, opponentId } = data;
    setTotalQuestions(totalQuestions);
    setOpponentId(opponentId)
    console.log(`Quiz: Total Questions set to ${totalQuestions}`);
  };

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
    setTimeLeft(10); 
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
    setTimeLeft(5); 
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
    const opponentScore = finalScores[opponentId] || 0;
    let wins = 0;
    let played = 0;
    let resultText;
    if (result.winner === socket.id) {
      resultText = 'You Win!';
      wins += 1
      played += 1
    } else if (result.winner === null) {
      resultText = "It's a Tie!";
      played += 1
    } else {
      resultText = 'You Lose!';
      played += 1
    }


    console.log('my score', myScore, 'their score', opponentScore)
    
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
                gamesWon: wins,
                gamesPlayed: played
              }
          },
        })
        console.log(data)

      } catch (err) {
        console.error(err)
      }
    }
    handleAddStat()

    return (
      <div className={styles.gameOverContainer} style={{
        marginTop: '100px'
      }}>
        <h2>Game Over</h2>
        <p>Your Score: {myScore}</p>
        <p>Opponent's Score: {opponentScore}</p>
        <h3>{resultText}</h3>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }
  
  return (
    <div className={styles.quizContainer} style={{
      marginTop: "100px"
    }}>
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
