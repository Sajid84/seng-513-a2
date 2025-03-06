const startButton = document.getElementById('start-button');
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const answerButtons = document.querySelectorAll('.answer');
const answerLabels = [
    document.getElementById('answer1-text'),
    document.getElementById('answer2-text'),
    document.getElementById('answer3-text'),
    document.getElementById('answer4-text')
];
const submitButton = document.getElementById('submit-button');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Lisbon"],
        correct: 2
    },
    {
        question: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correct: 1
    },
    // These are just dummy questions. We need to use a link
];

startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', submitAnswer);

function startQuiz() {
    score = 0; // Reset score at the start of the quiz
    startButton.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    currentQuestion.answers.forEach((answer, index) => {
        answerLabels[index].textContent = answer;
        answerButtons[index].value = index;
    });
}

function resetState() {
    answerButtons.forEach(button => {
        button.checked = false;
    });
}

function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        const answerIndex = parseInt(selectedAnswer.value);
        if (answerIndex === questions[currentQuestionIndex].correct) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    } else {
        alert("Please select an answer before submitting.");
    }
}

function endQuiz() {
    questionContainer.classList.add('hidden');
    scoreElement.textContent = `Score: ${score}`;
    startButton.textContent = "Restart Quiz";
    startButton.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
}