
const api = 's6yjzpy5awiXLFgyS3KqQ7xC4'

async function fetchTriviaQuestions(amount, category, difficulty) {
    // let url = `https://the-trivia-api.com/api/questions?limit=${amount || 10}`;
    let url = `https://brainbuster-12xu.onrender.com/api/questions?limit=${amount || 10}`

    if (category) {
        url += `&categories=${encodeURIComponent(category)}`;
    }

    if (difficulty) {
        url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }

    console.log(`Fetching trivia questions from URL: ${url}`);

    try {
        const response = await fetch(url);

        console.log(`API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            throw new Error('Cannot fetch trivia questions.');
        }

        const data = await response.json();
        console.log(`Fetched ${data.length} questions.`);
        console.log('Sample Question:', data[0]);

        if (!Array.isArray(data)) {
            throw new Error('API response is not an array of questions.');
        }

        data.forEach((question, index) => {
            if (
                !question ||
                typeof question.question !== 'string' ||
                typeof question.correctAnswer !== 'string' ||
                !Array.isArray(question.incorrectAnswers)
            ) {
                throw new Error(`Invalid question structure at index ${index}.`);
            }
        });

        return data
    } catch (error) {
        console.error('Error fetching questions', error);
        throw new Error('Failed to fetch questions');
    }
}

module.exports = { fetchTriviaQuestions };