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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category[0].value);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty[0]);

  const [createGame] = useMutation(CREATE_GAME);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await createGame({
        variables: {
          amount: 10,
          category: selectedCategory,
          difficulty: selectedDifficulty,
        },
      })

      setQuestions(data.createGame.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div>
      <h1>Trivia!</h1>
      <div>
        <label>
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={question.length > 0}
          >
            {category.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Difficulty:
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            disabled={question.length > 0}
          >
            {difficulty.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <button onClick={fetchQuestions} disabled={loading || questions.length > 0}>
          { loading ? "Loading..." : "Start Quiz"}
        </button>
      </div>
      {error && <p>Error: {error}</p>}
      {questions.length > 0 && (
        <div>
          {questions.map((question, index) => (
            <div key={index}>
              <h3>{decodeHtml(question.question)}</h3>
              <ul>
                {shuffleAnswers([
                  ...question.incorrectAnswers,
                  question.correctAnswer
                ]).map((answer, idx) => (
                  <li key={idx}>{decodeHtml(answer)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
