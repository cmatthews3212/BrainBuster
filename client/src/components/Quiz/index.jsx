import { useState, useEffect } from "react";
import { useMutation } from '@apollo/client';
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

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(categories[0].value);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);

  const [createGame] = useMutation(CREATE_GAME);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    setUserAnswers({});
    setScore(0);

    const categoryExists = categories.some(cat => cat.value === selectedCategory);
    const difficultyExists = difficulties.includes(selectedDifficulty);

    if (!categoryExists) {
      setError('Invalid category selected.');
      setLoading(false);
      return;
    }

    if (!difficultyExists) {
      setError('Invalid difficulty selected.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await createGame({
        variables: {
          amount: 10,
          category: selectedCategory,
          difficulty: selectedDifficulty,
        },
      });

      if (data && data.createGame && data.createGame.questions) {
        setQuestions(data.createGame.questions);
      } else {
        throw new Error('No questions received from the server.');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      const errorMessage = err?.graphQLErrors?.[0]?.message || err.message || 'An error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleAnswers = (answers) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    if (userAnswers[questionIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));

    if (answer === questions[questionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const isQuizComplete = Object.keys(userAnswers).length === questions.length;

  return (
    <>
      <div className="quiz-container">
        <h2>Chose your Game!</h2>
        <div>
          <h3>CATEGORY</h3>
          <hr />
            <div className="category-selection">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  disabled={questions.length > 0}
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
                disabled={questions.length > 0}
                className={selectedDifficulty === diff ? 'selected' : ''}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="quizBtn" onClick={fetchQuestions} disabled={loading || questions.length > 0}>
          { loading ? "Loading..." : "Create Game"}
        </button>
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      {questions.length > 0 && (
      <div>
        <p>Score: {score}/{questions.length}</p>
        {isQuizComplete && (
          <div>
            <h2>Quiz Complete!</h2>
            <p>Your final score is {score} out of {questions.length}</p>
            <button onClick={() => window.location.reload()}>Play Again</button>
          </div>
        )}
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

export default Quiz;
