const questions = [
  {
    category: "computer",
    question: "Which method adds an item to the END of a JavaScript array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0  // index 0 = "push()" sahi answer hai
  },
    {
    category: "science",
    question: "What gas do plants absorb from the air?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correct: 1  // index 1 = "Carbon Dioxide" sahi answer hai
  },
    {
    category: "science",
    question: "Which planet is known as the Red Planet?",
    options: [ "Venus", "Jupiter", "Saturn", "Mars"],
    correct: 3  // index 3 = "Mars" sahi answer hai
  },
    {
    category: "computer",
    question: "What does 'HTML' stand for?",
    options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
    correct: 0  // index 0 = "Hyper Text Markup Language" sahi answer hai
  },
    {
    category: "GK",
    question: "Who was the first Prime Minister of India?",
    options: [ "Indira Gandhi","Jawaharlal Nehru", "Rajiv Gandhi", "Manmohan Singh"],
    correct: 1  // index 1 = "Jawaharlal Nehru" sahi answer hai
  },
];
let categoryStats = {};
let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

// Start screen
const startBtn = document.getElementById("start-btn");

// Quiz screen
const progressLabel = document.getElementById("progress-label");
const timerDisplay = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const categoryTag = document.getElementById("category");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

// Results screen
const finalScore = document.getElementById("final-score");
const finalPercent = document.getElementById("final-percent");
const verdict = document.getElementById("verdict");
const breakdown = document.getElementById("breakdown");
const restartBtn = document.getElementById("restart-btn");

startBtn.addEventListener("click", function () {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  loadQuestion();
});
nextBtn.addEventListener("click", function () {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});
function loadQuestion() {
  // 1. Reset feedback aur next button
  feedback.textContent = "";
  nextBtn.classList.add("hidden");

  // 2. Current question ka data nikalo
  const current = questions[currentQuestion];

  // 3. Category aur question text dikhao
  categoryTag.textContent = current.category;
  questionText.textContent = current.question;

  // 4. Progress label aur progress bar update karo
  progressLabel.textContent = "Question " + (currentQuestion + 1) + " of " + questions.length;
  progressFill.style.width = ((currentQuestion + 1) / questions.length) * 100 + "%";

  // 5. Purane options hatao, naye options banao
  optionsContainer.innerHTML = "";
  current.options.forEach(function (optionText, index) {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = (index + 1) + ". " + optionText;

    btn.addEventListener("click", function () {
      checkAnswer(index, current.correct,current.category);
    });

    optionsContainer.appendChild(btn);
  });

  // 6. Timer reset aur start karo
startTimer(current.correct);
}
function checkAnswer(selectedIndex, correctIndex, category) {
  clearInterval(timer);

  const allButtons = document.querySelectorAll(".option");

  allButtons.forEach(function (btn, index) {
    btn.disabled = true;

    if (index === correctIndex) {
      btn.classList.add("correct");
    }
  });

  if (selectedIndex === correctIndex) {
    score++;
    feedback.textContent = "Correct!";
  } else if (selectedIndex !== -1) {
    allButtons[selectedIndex].classList.add("wrong");
    feedback.textContent = "Wrong answer!";
  } else {
    feedback.textContent = "Time's up!";
  }

  nextBtn.classList.remove("hidden");
}

function startTimer(correctIndex) {
  timeLeft = 15;
  timerDisplay.textContent = "00:" + (timeLeft < 10 ? "0" + timeLeft : timeLeft);// Reset timer display ynai ("09" na ki "9") ye  0 add bhi krgea  
 // agar 10 se chhota hai toh uske aage 0 add krdo warna timeLeft hi dikhao
  clearInterval(timer);//clearInterval(timer) ka matlab: "agar koi purana timer chal raha hai (uski ID timer variable mein store thi), use band kar do."
//setInterval ek built-in JS function hai jiska kaam hai: "ek kaam ko baar-baar, fix time gap pe, automatically dohrana."
  timer = setInterval(function () {
    timeLeft--;
    timerDisplay.textContent = "00:" + (timeLeft < 10 ? "0" + timeLeft : timeLeft);

  if (timeLeft <= 0) {
  clearInterval(timer);
  checkAnswer(-1, correctIndex);
      // time khatam, answer galat maan lo
    }
  }, 1000);//1000ms = 1 second
}
function showResults() {
  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");

  finalScore.textContent = score + "/" + questions.length;

  const percent = Math.round((score / questions.length) * 100);
 // Math.round(...) → ye number ko round karta hai (decimal hata ke). Agar calculation 66.666... aaye (jaise 2/3 questions), Math.round use 67 bana dega (nearest whole number).
  finalPercent.textContent = percent + "%";
  if (percent === 100) {
  verdict.textContent = "Perfect score! 🏆";
} else if (percent >= 60) {
  verdict.textContent = "Great job! 👏";
} else if (percent >= 40) {
  verdict.textContent = "Not bad, keep practicing! 💪";
} else {
  verdict.textContent = "Keep trying, you'll get better! 📚";
}
}

