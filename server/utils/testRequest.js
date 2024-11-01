const { fetchTriviaQuestions } = require('./requests')

const test = async () => {
    try {
        const questions = await fetchTriviaQuestions(10, "music", 'medium' );

        console.log('Fetched Questions:', questions);
    } catch (error) {
        console.error(error);
    }
}

test()