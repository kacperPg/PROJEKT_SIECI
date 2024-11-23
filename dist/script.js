import { testData } from "./test-data.js";
let currentQuestionIndex = 0;
let answers = [];
let randomizedQuestions = [];
let timer = 0;
let interval;
let questionTimes = [];
let lastQuestionTimestamp = 0;
const introductionSection = document.getElementById("introduction");
const testSection = document.getElementById("test");
const summarySection = document.getElementById("summary");
const questionNumberElement = document.getElementById("questionNumber");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const timerElement = document.getElementById("timeElapsed");
const prevButton = document.getElementById("prevQuestion");
const nextButton = document.getElementById("nextQuestion");
const finishButton = document.getElementById("finishTest");
const scoreElement = document.getElementById("score");
const summaryDetails = document.createElement("div");
function startTest() {
    randomizedQuestions = [...testData.questions].sort(() => Math.random() - 0.5);
    answers = Array(randomizedQuestions.length).fill(-1);
    questionTimes = Array(randomizedQuestions.length).fill(0);
    const startButton = document.getElementById("startTest");
    if (startButton) {
        startButton.remove(); // Usunięcie przycisku z DOM
    }
    introductionSection.classList.remove("hidden");
    testSection.classList.remove("hidden");
    lastQuestionTimestamp = Date.now();
    interval = setInterval(() => {
        timer++;
        timerElement.textContent = `${timer} sekund`;
    }, 1000);
    renderQuestion();
}
function renderQuestion() {
    const now = Date.now();
    if (lastQuestionTimestamp > 0) {
        questionTimes[currentQuestionIndex] += Math.floor((now - lastQuestionTimestamp) / 1000);
    }
    lastQuestionTimestamp = now;
    const questionData = randomizedQuestions[currentQuestionIndex];
    questionNumberElement.textContent = `Pytanie ${currentQuestionIndex + 1}/${randomizedQuestions.length}`;
    questionElement.textContent = questionData.question;
    answersElement.innerHTML = "";
    questionData.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => {
            answers[currentQuestionIndex] = index;
            validateButtons();
        };
        if (answers[currentQuestionIndex] === index) {
            button.style.backgroundColor = "lightgreen";
        }
        answersElement.appendChild(button);
    });
}
function validateButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === randomizedQuestions.length - 1;
    finishButton.classList.toggle("hidden", answers.includes(-1));
}
function moveToQuestion(step) {
    currentQuestionIndex += step;
    renderQuestion();
    validateButtons();
}
function finishTest() {
    clearInterval(interval);
    const now = Date.now();
    questionTimes[currentQuestionIndex] += Math.floor((now - lastQuestionTimestamp) / 1000);
    testSection.classList.add("hidden");
    summarySection.classList.remove("hidden");
    const correctAnswers = answers.filter((ans, idx) => ans === randomizedQuestions[idx].correct).length;
    scoreElement.textContent = `Twój wynik: ${correctAnswers}/${randomizedQuestions.length}.`;
    summaryDetails.innerHTML = "<h3>Podsumowanie odpowiedzi</h3>";
    randomizedQuestions.forEach((question, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = userAnswer === question.correct;
        const result = document.createElement("p");
        result.textContent = `${idx + 1}. ${question.question} 
      - Twoja odpowiedź: ${userAnswer !== -1 ? question.options[userAnswer] : "Brak odpowiedzi"} 
      - Poprawna odpowiedź: ${question.options[question.correct]} 
      - ${isCorrect ? "Poprawna" : "Błędna"}
      - Czas: ${questionTimes[idx]} sekund`;
        result.style.color = isCorrect ? "green" : "red";
        summaryDetails.appendChild(result);
    });
    const totalTime = questionTimes.reduce((acc, time) => acc + time, 0);
    const totalTimeElement = document.createElement("p");
    totalTimeElement.textContent = `Łączny czas spędzony na teście: ${totalTime} sekund`;
    summaryDetails.appendChild(totalTimeElement);
    summarySection.appendChild(summaryDetails);
}
document.getElementById("startTest").onclick = startTest;
prevButton.onclick = () => moveToQuestion(-1);
nextButton.onclick = () => moveToQuestion(1);
finishButton.onclick = finishTest;
document.getElementById("restartTest").onclick = () => location.reload();
