class Quiz {
    constructor() {
        // All our variables that are needed
        this.startButton = document.getElementById("start-button");
        this.questionContainer = document.getElementById("question-container");
        this.questionText = document.getElementById("question-text");
        this.answerButtonsContainer = document.getElementById("answer-buttons");
        this.scoreElement = document.getElementById("score");
        this.score = 0;
        this.easyQuestions = [];
        this.mediumQuestions = [];
        this.hardQuestions = [];
        this.currentDifficulty = "medium";
        this.correctStreak = 0;
        this.incorrectStreak = 0;

        // Start quiz when button is pressed (uses bind)
        this.startButton.addEventListener("click", this.startQuiz.bind(this));
    }
  
    async fetchQuestions() {
        // Pull in questions from API
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=50&encode=url3986");
            const data = await response.json();
            
            data.results.forEach((item) => {
            const decodedQuestion = decodeURIComponent(item.question);
            const decodedCorrectAnswer = decodeURIComponent(item.correct_answer);
            let answers = [...item.incorrect_answers.map(a => decodeURIComponent(a)), decodedCorrectAnswer];
            
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }
            
            const questionObj = { question: decodedQuestion, answers, correct: decodedCorrectAnswer };

            // Set questions based on their difficulty
            if (item.difficulty === "easy") {
                this.easyQuestions.push(questionObj);
            } else if (item.difficulty === "medium") {
                this.mediumQuestions.push(questionObj);
            } else {
                this.hardQuestions.push(questionObj);
            }
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
  
    *questionGenerator() {
        // Generate to give questions 1 by 1, uses yield
        while (true) {
            let questions = this.getQuestionsByDifficulty();
            if (questions.length === 0) return;
            // Shift to make sure we don't see same questions when coming back to a difficulty
            yield questions.shift();
        }
    }
  
    getQuestionsByDifficulty() {
        // Changes question based on current difficulty
        if (this.currentDifficulty === "easy") return this.easyQuestions;
        if (this.currentDifficulty === "medium") return this.mediumQuestions;
        return this.hardQuestions;
    }
  
    async startQuiz() {
        // Resets all quiz variables and pulls in new questions to populate them
        this.easyQuestions = [];
        this.mediumQuestions = [];
        this.hardQuestions = [];
        this.currentDifficulty = "medium";
        this.correctStreak = 0;
        this.incorrectStreak = 0;
        await this.fetchQuestions();

        console.log(this.easyQuestions);
        console.log(this.mediumQuestions);
        console.log(this.hardQuestions);
        
        this.score = 0;
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.startButton.classList.add("hidden");
        this.questionContainer.classList.remove("hidden");

        // Uses generator to pull in questions
        this.generator = this.questionGenerator();
        this.showQuestion();
    }
  
    showQuestion() {
        // Shows questions
        this.resetState();
        const questionObj = this.generator.next().value;
        if (!questionObj) return this.endQuiz();

        console.log(this.currentDifficulty);
        console.log(questionObj);
        
        this.questionText.textContent = questionObj.question;
        questionObj.answers.forEach(answer => {
            const button = document.createElement("button");
            button.classList.add("answer-btn");
            button.textContent = answer;
            button.onclick = this.selectAnswer.bind(this, answer, questionObj.correct);
            this.answerButtonsContainer.appendChild(button);
        });
    }
  
    resetState() {
      this.answerButtonsContainer.innerHTML = "";
    }
  
    selectAnswer(selected, correct) {
        // Once a answer is selected it checks if it is right
        // If the user gets 2 wrong, difficulty goes down
        // If the user gets 2 right, difficulty foes up
        if (selected === correct) {
            this.score++;
            this.correctStreak++;
            this.incorrectStreak = 0;
            if (this.correctStreak >= 2) {
            this.increaseDifficulty();
            }
        } else {
            this.correctStreak = 0;
            this.incorrectStreak++;
            if (this.incorrectStreak >= 2) {
            this.decreaseDifficulty();
            }
        }
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.showQuestion();
    }
  
    increaseDifficulty() {
        // Increasing difficulty of questions
        if (this.currentDifficulty === "medium") {
            this.currentDifficulty = "hard";
        } else if (this.currentDifficulty === "easy") {
            this.currentDifficulty = "medium";
        }
        this.correctStreak = 0;
        this.generator = this.questionGenerator();
    }
  
    decreaseDifficulty() {
        // Decreasing difficulty of questions
        if (this.currentDifficulty === "hard") {
            this.currentDifficulty = "medium";
        } else if (this.currentDifficulty === "medium") {
            this.currentDifficulty = "easy";
        }
        this.incorrectStreak = 0;
        this.generator = this.questionGenerator();
    }
  
    endQuiz() {
      this.questionContainer.classList.add("hidden");
      this.startButton.textContent = "Restart Quiz";
      this.startButton.classList.remove("hidden");
      this.scoreElement.classList.add("final-score");
      this.scoreElement.textContent = `Final Score: ${this.score}`;
      this.startButton.onclick = () => location.reload();
    }
  }
  
  const quiz = new Quiz();
  