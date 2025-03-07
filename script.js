const startButton = document.getElementById("start-button");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer");
const answerLabels = [
  document.getElementById("answer1-text"),
  document.getElementById("answer2-text"),
  document.getElementById("answer3-text"),
  document.getElementById("answer4-text"),
];
const submitButton = document.getElementById("submit-button");
const scoreElement = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;

const questions = [
  {
    question: "What is the capital of France?",
    answers: ["Berlin", "Madrid", "Paris", "Lisbon"],
    correct: 2,
  },
  {
    question: "What is 2 + 2?",
    answers: ["3", "4", "5", "6"],
    correct: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    answers: ["Elephant", "Blue Whale", "Great White Shark", "Giraffe"],
    correct: 1,
  },
  {
    question: "How many continents are there on Earth?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
  },
  {
    question: "What is the chemical symbol for water?",
    answers: ["H2O", "CO2", "O2", "NaCl"],
    correct: 0,
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Claude Monet",
    ],
    correct: 1,
  },
  {
    question: "Which is the longest river in the world?",
    answers: [
      "Amazon River",
      "Yangtze River",
      "Mississippi River",
      "Nile River",
    ],
    correct: 3,
  },
  {
    question: "What is the tallest mountain in the world?",
    answers: ["Mount Kilimanjaro", "Mount Everest", "K2", "Denali"],
    correct: 1,
  },
  {
    question: "How many legs does a spider have?",
    answers: ["6", "8", "10", "12"],
    correct: 1,
  },
  {
    question: "What is the capital of Japan?",
    answers: ["Beijing", "Seoul", "Bangkok", "Tokyo"],
    correct: 3,
  },
];

startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", submitAnswer);

function startQuiz() {
  score = 0; // Reset score at the start of the quiz
  startButton.classList.add("hidden");
  questionContainer.classList.remove("hidden");
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
  answerButtons.forEach((button) => {
    button.checked = false;
  });
}

function submitAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    const answerIndex = parseInt(selectedAnswer.value);

    if (answerIndex === questions[currentQuestionIndex].correct) {
      score++;
      scoreElement.textContent = `Score: ${score}`; // Update score immediately
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
  questionContainer.classList.add("hidden");
  startButton.textContent = "Restart Quiz";
  startButton.classList.remove("hidden");

  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  scoreElement.textContent = `Score: ${score}`; // Reset score immediately
}
