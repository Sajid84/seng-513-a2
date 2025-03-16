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
const scoreElement = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;
const questions = [];

startButton.addEventListener("click", startQuiz);

async function getQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=5&encode=url3986"
    );
    const data = await response.json();
    console.log(data);

    data.results.forEach((item) => {
      const decodedQuestion = decodeURIComponent(item.question);
      const decodedCorrectAnswer = decodeURIComponent(item.correct_answer);

      if (item.type === "multiple") {
        // Create array with all answers
        const allAnswers = [
          ...item.incorrect_answers.map((answer) => decodeURIComponent(answer)),
          decodedCorrectAnswer,
        ];

        // Shuffle answers
        for (let i = allAnswers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }

        questions.push({
          question: decodedQuestion,
          answers: allAnswers,
          correct: decodedCorrectAnswer,
        });
      } else {
        questions.push({
          question: decodedQuestion,
          answers: ["True", "False"],
          correct: decodedCorrectAnswer,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function startQuiz() {
  // Once start or restart is clicked, clear questions and pull in new ones
  questions.splice(0, questions.length);
  await getQuestions();

  // reset score
  score = 0;
  scoreElement.textContent = `Score: ${score}`;

  currentQuestionIndex = 0;
  startButton.classList.add("hidden");
  questionContainer.classList.remove("hidden");

  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.classList.add("answer-btn");
    button.textContent = answer;
    button.dataset.index = index;

    button.addEventListener("click", () => selectAnswer(answer));

    document.getElementById("answer-buttons").appendChild(button);
  });
}

function resetState() {
  document.getElementById("answer-buttons").innerHTML = ""; // Clears previous answers
}

function selectAnswer(selectedAnswer) {
  if (selectedAnswer === questions[currentQuestionIndex].correct) {
    score++;
    scoreElement.textContent = `Score: ${score}`; // Update score immediately
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  questionContainer.classList.add("hidden");
  startButton.textContent = "Restart Quiz";
  startButton.classList.remove("hidden");

  // Style the score prominently at the end screen
  scoreElement.classList.add("final-score");
  scoreElement.textContent = `Final Score: ${score}`;
  startButton.onclick = () => location.reload();
}

// ------------------- Unused Below (just keeping for now incase we need it)

// function submitAnswer() {
//   const selectedAnswer = document.querySelector('input[name="answer"]:checked');
//   if (selectedAnswer) {
//     const answerIndex = parseInt(selectedAnswer.value);

//     if (answerIndex === questions[currentQuestionIndex].correct) {
//       score++;
//       scoreElement.textContent = `Score: ${score}`; // Update score immediately
//     }

//     currentQuestionIndex++;
//     if (currentQuestionIndex < questions.length) {
//       showQuestion();
//     } else {
//       endQuiz();
//     }
//   } else {
//     alert("Please select an answer before submitting.");
//   }
// }
