function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function displayResults() {
    const score = parseInt(getUrlParameter('score'));
    const total = parseInt(getUrlParameter('total'));
    const timeTaken = parseInt(getUrlParameter('time'));
    const userAnswers = JSON.parse(getUrlParameter('answers'));

    const resultsSummary = document.getElementById('results-summary');
    resultsSummary.innerHTML = `
        <p class="text-xl mb-2">Your score: ${score} out of ${total}</p>
        <p class="text-lg mb-4">Time taken: ${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</p>
    `;

    fetchQuestions().then(questions => {
        const questionReview = document.getElementById('question-review');
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.answer;
            const reviewHtml = `
                <div class="mb-6 p-4 border rounded ${isCorrect ? 'bg-green-100' : 'bg-red-100'}">
                    <p class="font-bold mb-2">${index + 1}. ${question.question}</p>
                    <ul class="list-disc pl-5">
                        ${['choice1', 'choice2', 'choice3', 'choice4'].map((choice, i) => `
                            <li class="${i + 1 === question.answer ? 'text-green-700 font-bold' : ''} ${i + 1 === userAnswer && !isCorrect ? 'text-red-700 line-through' : ''}">
                                ${question[choice]}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            questionReview.innerHTML += reviewHtml;
        });
    });
}

function fetchQuestions() {
    // Assuming the questions are stored in session storage after the quiz
    const questions = JSON.parse(sessionStorage.getItem('quizQuestions'));
    if (questions) {
        return Promise.resolve(questions);
    } else {
        // If not in session storage, fetch from the server
        // You'll need to adjust this to fetch the correct group of questions
        return fetch('questions/group1.json').then(response => response.json());
    }
}

function retakeQuiz() {
    // Redirect to the quiz page with the same group
    const group = getUrlParameter('group') || '1';
    window.location.href = `quiz.html?group=${group}`;
}

function chooseAnotherGroup() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', displayResults);