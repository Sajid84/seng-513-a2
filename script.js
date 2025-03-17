class Quiz {
    constructor() {
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
        this.questionsAnswered = 0;
        this.maxQuestions = 10;

        this.startButton.addEventListener("click", this.startQuiz.bind(this));
    }

    async fetchQuestions() {
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
        while (this.questionsAnswered < this.maxQuestions) {
            let questions = this.getQuestionsByDifficulty();
            if (questions.length === 0) return;
            yield questions.shift();
        }
    }

    getQuestionsByDifficulty() {
        if (this.currentDifficulty === "easy") return this.easyQuestions;
        if (this.currentDifficulty === "medium") return this.mediumQuestions;
        return this.hardQuestions;
    }

    async startQuiz() {
        this.easyQuestions = [];
        this.mediumQuestions = [];
        this.hardQuestions = [];
        this.currentDifficulty = "medium";
        this.correctStreak = 0;
        this.incorrectStreak = 0;
        this.questionsAnswered = 0;
        await this.fetchQuestions();
        
        this.score = 0;
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.startButton.classList.add("hidden");
        this.questionContainer.classList.remove("hidden");
        
        this.generator = this.questionGenerator();
        this.showQuestion();
    }

    showQuestion() {
        this.resetState();
        const questionObj = this.generator.next().value;
        if (!questionObj || this.questionsAnswered >= this.maxQuestions) return this.endQuiz();
    
        // Remove existing question number if any
        const existingQuestionNumber = this.questionContainer.querySelector(".question-number");
        if (existingQuestionNumber) {
            existingQuestionNumber.remove();
        }
    
        // Create and insert new question number
        const questionNumber = document.createElement("p");
        questionNumber.textContent = `Question ${this.questionsAnswered + 1} of ${this.maxQuestions}`;
        questionNumber.classList.add("question-number");
        this.questionContainer.insertBefore(questionNumber, this.questionText);
    
        // Set question text
        this.questionText.textContent = questionObj.question;
    
        // Create answer buttons
        questionObj.answers.forEach(answer => {
            const button = document.createElement("button");
            button.classList.add("answer-btn");
            button.textContent = answer;
            button.onclick = this.selectAnswer.bind(this, button, answer, questionObj.correct);
            this.answerButtonsContainer.appendChild(button);
        });
    }
    

    resetState() {
        this.answerButtonsContainer.innerHTML = "";
        document.removeEventListener("keydown", this.continueQuiz);
    }

    selectAnswer(button, selected, correct) {
        this.questionsAnswered++;
        
        if (selected === correct) {
            button.classList.add("correct");
            this.score++;
            this.correctStreak++;
            this.incorrectStreak = 0;
            if (this.correctStreak >= 2) this.increaseDifficulty();
        } else {
            button.classList.add("incorrect");
            this.correctStreak = 0;
            this.incorrectStreak++;
            if (this.incorrectStreak >= 2) this.decreaseDifficulty();
            
            Array.from(this.answerButtonsContainer.children).forEach(btn => {
                if (btn.textContent === correct) btn.classList.add("correct");
            });
        }

        this.scoreElement.textContent = `Score: ${this.score}`;
        
        const continueText = document.createElement("p");
        continueText.textContent = "Press any key to continue...";
        continueText.classList.add("continue-text");
        this.answerButtonsContainer.appendChild(continueText);
        Array.from(this.answerButtonsContainer.children).forEach(btn => {
            btn.disabled = true;
        });
        if (selected !== correct) {
            button.style.backgroundColor = "rgba(242, 43, 43, 0.5)";


        }
        Array.from(this.answerButtonsContainer.children).forEach(btn => {
            if (btn.textContent === correct) btn.style.backgroundColor = "green";
        });
        this.continueQuiz = this.showQuestion.bind(this);
        document.addEventListener("keydown", this.continueQuiz, { once: true });

    }

    increaseDifficulty() {
        if (this.currentDifficulty === "medium") this.currentDifficulty = "hard";
        else if (this.currentDifficulty === "easy") this.currentDifficulty = "medium";
        this.correctStreak = 0;
        this.generator = this.questionGenerator();
    }

    decreaseDifficulty() {
        if (this.currentDifficulty === "hard") this.currentDifficulty = "medium";
        else if (this.currentDifficulty === "medium") this.currentDifficulty = "easy";
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