// const api = 'https://opentdb.com/api.php?amount=10&type=multiple'

// export const getQuestions = ({ category, difficulty }) => {
//     return fetch(`${api}&difficulty=${difficulty}&category=${category}`)
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error('Network error');
//         }
//         return response.json();
//     });
// };

// export const category = [
//     { label: 'Video Games', value: 14},
//     { label: 'History', value: 23},
//     { label: 'Books', value: 10},
//     { label: 'Entertainment: Music', value: 12},
//     { label: 'Entertainment: Film', value: 11},
//     { label: 'Sports', value: 21},
// ];

// export const difficulty = [ 'easy', 'medium', 'hard']

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