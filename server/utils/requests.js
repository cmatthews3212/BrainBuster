const api = 'https://opentdb.com/api.php?amount=10&type=multiple'

export const getQuestions = ({ category, difficulty }) => {
    return fetch(`${api}&difficulty=${difficulty}&category=${category}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network error');
        }
        return response.json();
    });
};

export const category = [
    { label: 'Video Games', value: 14},
    { label: 'Sports', value: 21},
    { label: 'Books', value: 10},
];

export const difficulty = [ 'easy', 'medium', 'hard']