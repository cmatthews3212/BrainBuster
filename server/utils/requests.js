
const api = 's6yjzpy5awiXLFgyS3KqQ7xC4'

async function fetchTriviaQuestions(amount, category, difficulty) {
    let url = `https://the-trivia-api.com/api/questions?limit=${amount || 10}`;

    if (category) {
        url += `&categories=${encodeURIComponent(category)}`;
    }

    if (difficulty) {
        url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Cannot fetch trivia questions.');
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching questions', error);
        throw new Error('Failed to fetch questions');
    }
}

module.exports = { fetchTriviaQuestions };