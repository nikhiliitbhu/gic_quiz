/* ================================================================
   QUIZ MASTER  -  Game logic
   ----------------------------------------------------------------
   The questions live in questions.js (loaded before this file),
   so the variable `questionBank` is already available here.

   This file is commented so you can see WHERE and WHY each concept
   is used:  String, Objects, Class, Array, Set, Map, Math,
             HTML DOM, Events, Functions
   Read top-to-bottom like a story.
   ================================================================ */


/* ================================================================
   PART 1 - HELPER FUNCTIONS  (pure functions: input -> output)
   ----------------------------------------------------------------
   These don't touch the page. They just compute and return.
   Good habit: keep "thinking" functions separate from
   "drawing on the screen" functions.
   ================================================================ */

// FUNCTION + MATH: shuffle an array using the Fisher-Yates method.
// Math.random() gives a number 0-1; Math.floor() rounds it down.
function shuffle(array) {
  const copy = [...array];                 // ARRAY: copy so we don't damage the original
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));   // MATH
    [copy[i], copy[j]] = [copy[j], copy[i]];         // swap
  }
  return copy;
}

// FUNCTION + STRING + MATH: turn 75 seconds into "01:15"
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);     // MATH
  const seconds = totalSeconds % 60;
  // STRING: padStart adds a leading "0" so we always show two digits
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return mm + ":" + ss;                              // STRING joining
}

// FUNCTION + MATH: percentage, rounded to a whole number
function calculatePercentage(score, total) {
  return Math.round((score / total) * 100);          // MATH
}

// FUNCTION + STRING: pick a message based on the percentage
function getVerdict(percent) {
  if (percent === 100) return "Perfect score! You're a Quiz Master!";
  if (percent >= 60)  return "Well done - solid knowledge!";
  if (percent >= 40)  return "Not bad. A little more practice!";
  return "Keep learning - you'll get there!";
}


/* ================================================================
   PART 2 - THE QUIZ CLASS  (state + behaviour together)
   ----------------------------------------------------------------
   A CLASS bundles DATA (the questions, the score) with the
   ACTIONS that change that data (answer, next, results).
   ================================================================ */
class Quiz {
  constructor(questions) {
    this.questions = shuffle(questions);   // ARRAY of question OBJECTS, shuffled
    this.currentIndex = 0;                 // which question we're on
    this.score = 0;                        // how many correct so far

    // SET: remember the IDs of questions answered correctly.
    // A Set automatically ignores duplicates - perfect for "unique IDs".
    this.correctIds = new Set();

    // MAP: category name  ->  { correct, total }
    // A Map is ideal when the "keys" are words (categories), not numbers.
    this.categoryScores = new Map();
    for (const q of this.questions) {
      if (!this.categoryScores.has(q.category)) {
        this.categoryScores.set(q.category, { correct: 0, total: 0 });
      }
      this.categoryScores.get(q.category).total += 1;
    }
  }

  // Return the current question OBJECT
  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  // Are we on the last question?
  isLastQuestion() {
    return this.currentIndex === this.questions.length - 1;
  }

  // Record an answer. `chosenIndex` is which option the user clicked,
  // or -1 if the timer ran out. Returns true/false (was it correct?).
  submitAnswer(chosenIndex) {
    const q = this.getCurrentQuestion();
    const isCorrect = chosenIndex === q.correct;

    // Read the category's record from the MAP
    const catRecord = this.categoryScores.get(q.category);  // MAP read

    if (isCorrect) {
      this.score += 1;
      this.correctIds.add(q.id);          // SET add (no duplicates possible)
      catRecord.correct += 1;             // MAP update
    }
    return isCorrect;
  }

  // Move to the next question
  next() {
    this.currentIndex += 1;
  }

  // Build a results OBJECT to show on the final screen
  getResults() {
    const total = this.questions.length;
    const percent = calculatePercentage(this.score, total);
    return {
      score: this.score,
      total: total,
      percent: percent,
      verdict: getVerdict(percent),
      categoryScores: this.categoryScores   // the MAP
    };
  }
}


/* ================================================================
   PART 3 - GRAB THE HTML ELEMENTS  (HTML DOM)
   ----------------------------------------------------------------
   document.getElementById finds elements so JS can read/change them.
   ================================================================ */
const startScreen   = document.getElementById("start-screen");
const quizScreen    = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn   = document.getElementById("start-btn");
const nextBtn    = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const progressLabel = document.getElementById("progress-label");
const progressFill  = document.getElementById("progress-fill");
const timerEl       = document.getElementById("timer");
const categoryEl    = document.getElementById("category");
const questionTextEl= document.getElementById("question-text");
const optionsEl     = document.getElementById("options");
const feedbackEl    = document.getElementById("feedback");

const finalScoreEl   = document.getElementById("final-score");
const finalPercentEl = document.getElementById("final-percent");
const verdictEl      = document.getElementById("verdict");
const breakdownEl    = document.getElementById("breakdown");


/* ================================================================
   PART 4 - APP-WIDE STATE  (variables the whole game shares)
   ================================================================ */
let quiz = null;            // will hold our Quiz object
let answered = false;       // has the current question been answered?
let timeLeft = 15;          // seconds remaining on this question
let timerId = null;         // id from setInterval, so we can stop it
const SECONDS_PER_QUESTION = 15;

// Keys shown next to each option
const KEYS = ["1", "2", "3", "4"];


/* ================================================================
   PART 5 - SCREEN SWITCHING  (HTML DOM: classList)
   ================================================================ */
function showScreen(screenToShow) {
  // Hide all three, then reveal the one we want
  [startScreen, quizScreen, resultsScreen].forEach(function (screen) {
    screen.classList.add("hidden");        // HTML DOM
  });
  screenToShow.classList.remove("hidden");
}


/* ================================================================
   PART 6 - DRAW THE CURRENT QUESTION  (HTML DOM + Array + Events)
   ================================================================ */
function renderQuestion() {
  answered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.classList.add("hidden");

  const q = quiz.getCurrentQuestion();
  const questionNumber = quiz.currentIndex + 1;
  const totalQuestions = quiz.questions.length;

  // STRING (template literal) + HTML DOM
  progressLabel.textContent = `Question ${questionNumber} of ${totalQuestions}`;
  categoryEl.textContent = q.category;
  questionTextEl.textContent = q.question;

  // MATH: how full should the progress bar be?
  const percentDone = Math.round((questionNumber / totalQuestions) * 100);
  progressFill.style.width = percentDone + "%";

  // Clear old option buttons, then build new ones from the ARRAY
  optionsEl.innerHTML = "";
  q.options.forEach(function (optionText, index) {
    const btn = document.createElement("button");   // HTML DOM: create element
    btn.className = "option";
    btn.dataset.index = index;                       // remember which option this is

    // Each option shows a little key number + the text
    const keySpan = document.createElement("span");
    keySpan.className = "key";
    keySpan.textContent = KEYS[index];

    const textSpan = document.createElement("span");
    textSpan.textContent = optionText;

    btn.appendChild(keySpan);
    btn.appendChild(textSpan);

    // EVENT: clicking this option answers the question
    btn.addEventListener("click", function () {
      handleAnswer(index);
    });

    optionsEl.appendChild(btn);                      // HTML DOM: add to page
  });

  // Start the countdown for this question
  startTimer();
}


/* ================================================================
   PART 7 - THE TIMER  (Math + String + setInterval)
   ================================================================ */
function startTimer() {
  timeLeft = SECONDS_PER_QUESTION;
  updateTimerDisplay();

  // setInterval runs the function every 1000ms (1 second)
  timerId = setInterval(function () {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      stopTimer();
      // Timer ran out: treat as a wrong answer (chosenIndex = -1)
      handleAnswer(-1);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function updateTimerDisplay() {
  timerEl.textContent = formatTime(timeLeft);    // STRING formatting
  // Turn the timer red in the final 5 seconds (HTML DOM: classList)
  if (timeLeft <= 5) {
    timerEl.classList.add("low");
  } else {
    timerEl.classList.remove("low");
  }
}


/* ================================================================
   PART 8 - HANDLE AN ANSWER  (Class + HTML DOM + Array)
   ================================================================ */
function handleAnswer(chosenIndex) {
  if (answered) return;        // ignore extra clicks / double answers
  answered = true;
  stopTimer();

  const q = quiz.getCurrentQuestion();
  const isCorrect = quiz.submitAnswer(chosenIndex);   // CLASS method

  // Disable all buttons and colour them (HTML DOM)
  const optionButtons = optionsEl.querySelectorAll(".option");
  optionButtons.forEach(function (btn) {
    btn.disabled = true;
    const idx = Number(btn.dataset.index);

    if (idx === q.correct) {
      btn.classList.add("correct");        // always show the right answer
    } else if (idx === chosenIndex) {
      btn.classList.add("wrong");          // mark the user's wrong pick
    }
  });

  // Feedback message (STRING)
  if (isCorrect) {
    feedbackEl.textContent = "Correct! Well done.";
    feedbackEl.className = "feedback good";
  } else if (chosenIndex === -1) {
    feedbackEl.textContent = "Time's up! The correct answer is highlighted.";
    feedbackEl.className = "feedback bad";
  } else {
    feedbackEl.textContent = "Not quite - the correct answer is highlighted.";
    feedbackEl.className = "feedback bad";
  }

  // Show "Next" (or finish on the last question)
  nextBtn.textContent = quiz.isLastQuestion() ? "See results" : "Next question";
  nextBtn.classList.remove("hidden");
}


/* ================================================================
   PART 9 - SHOW RESULTS  (Map iteration + HTML DOM + Array)
   ================================================================ */
function showResults() {
  const results = quiz.getResults();      // results OBJECT from the CLASS

  finalScoreEl.textContent   = `${results.score}/${results.total}`;  // STRING
  finalPercentEl.textContent = results.percent + "%";
  verdictEl.textContent      = results.verdict;

  // Build the per-category breakdown from the MAP
  breakdownEl.innerHTML = "";
  // MAP: loop over each [key, value] pair with for...of
  for (const [category, record] of results.categoryScores) {
    const row = document.createElement("div");   // HTML DOM
    row.className = "cat-row";

    const name = document.createElement("span");
    name.textContent = category;

    const score = document.createElement("span");
    score.className = "cat-score";
    score.textContent = `${record.correct}/${record.total}`;   // STRING

    row.appendChild(name);
    row.appendChild(score);
    breakdownEl.appendChild(row);
  }

  showScreen(resultsScreen);
}


/* ================================================================
   PART 10 - WIRE UP THE BUTTONS  (Events)
   ================================================================ */

// EVENT: Start the quiz
startBtn.addEventListener("click", function () {
  quiz = new Quiz(questionBank);     // create a fresh Quiz OBJECT from the CLASS
  showScreen(quizScreen);
  renderQuestion();
});

// EVENT: Go to the next question (or to results)
nextBtn.addEventListener("click", function () {
  if (quiz.isLastQuestion()) {
    showResults();
  } else {
    quiz.next();          // CLASS method
    renderQuestion();
  }
});

// EVENT: Restart from the results screen
restartBtn.addEventListener("click", function () {
  showScreen(startScreen);
});

// EVENT (keyboard): press 1-4 to answer, Enter for Next.
document.addEventListener("keydown", function (e) {
  // Only react while the quiz screen is visible
  if (quizScreen.classList.contains("hidden")) return;

  if (KEYS.includes(e.key) && !answered) {
    const index = KEYS.indexOf(e.key);    // "1" -> 0, "2" -> 1, ...
    const q = quiz.getCurrentQuestion();
    if (index < q.options.length) {
      handleAnswer(index);
    }
  } else if (e.key === "Enter" && answered) {
    nextBtn.click();   // trigger the Next button
  }
});

// Start on the welcome screen
showScreen(startScreen);
