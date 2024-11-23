import { testData } from "./test-data.js";

let currentQuestionIndex = 0;
let answers: number[] = Array(testData.questions.length).fill(-1); // Defaulting to -1 for unanswered questions
let timer: number = 0;
let interval: any;

const introductionSection = document.getElementById("introduction")!;
const testSection = document.getElementById("test")!;
const summarySection = document.getElementById("summary")!;
const questionElement = document.getElementById("question")!;
const answersElement = document.getElementById("answers")!;
const timerElement = document.getElementById("timeElapsed")!;
const prevButton = document.getElementById("prevQuestion") as HTMLButtonElement;
const nextButton = document.getElementById("nextQuestion") as HTMLButtonElement;
const finishButton = document.getElementById("finishTest") as HTMLButtonElement;
const scoreElement = document.getElementById("score")!;

function startTest() {
  introductionSection.classList.add("hidden");
  testSection.classList.remove("hidden");
  interval = setInterval(() => {
    timer++;
    timerElement.textContent = timer.toString();
  }, 1000);
  renderQuestion();
}

function renderQuestion() {
  const questionData = testData.questions[currentQuestionIndex];
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
  nextButton.disabled = currentQuestionIndex === testData.questions.length - 1 || answers[currentQuestionIndex] === -1;
  finishButton.classList.toggle("hidden", answers.includes(-1));
}

function moveToQuestion(step: number) {
  currentQuestionIndex += step;
  renderQuestion();
  validateButtons();
}

function finishTest() {
  clearInterval(interval);
  testSection.classList.add("hidden");
  summarySection.classList.remove("hidden");

  const correctAnswers = answers.filter((ans, idx) => ans === testData.questions[idx].correct).length;
  scoreElement.textContent = `You scored ${correctAnswers}/${testData.questions.length}.`;
}

document.getElementById("startTest")!.onclick = startTest;
prevButton.onclick = () => moveToQuestion(-1);
nextButton.onclick = () => moveToQuestion(1);
finishButton.onclick = finishTest;
document.getElementById("restartTest")!.onclick = () => location.reload();