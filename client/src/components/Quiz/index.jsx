import { useState, useEffect } from "react";
import {
  getQuestions,
  category,
  difficulty,
} from "../../../../server/utils/requests";

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

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category[0].value);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty[0]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTriviaQuestions(10, selectedCategory, selectedDifficulty)
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, selectedDifficulty]);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div>
      <h1>Trivia!</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <div>
            <label>
              Category:
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              >
                {difficulty.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={fetchQuestions}>Fetch Questions</button>
          </div>
          <div>
            {questions.map((question, index) => (
              <div key={index}>
                <h3>{decodeHtml(question.question)}</h3>
                <ul>
                  {[...question.incorrect_answers, question.correct_answer].map(
                    (answer, idx) => (
                      <li key={idx}>{decodeHtml(answer)}</li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
