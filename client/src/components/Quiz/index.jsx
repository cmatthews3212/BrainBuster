import { useState, useEffect } from "react";
import {
  getQuestions,
  category,
  difficulty,
} from "../../../../server/utils/requests";

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
      const data = await getQuestions({
        category: selectedCategory,
        difficulty: selectedDifficulty,
      });
      setQuestions(data.results);
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
