# Quiz Master

A small trivia quiz app built with plain HTML, CSS and JavaScript.
No libraries, no installation.

## Files

| File            | What it holds                                              |
|-----------------|------------------------------------------------------------|
| `index.html`    | The page structure (the three screens and their elements). |
| `style.css`     | All the styling (colours, layout, buttons).                |
| `questions.js`  | The quiz questions, as an array of objects. Edit me!       |
| `script.js`     | The game logic (the Quiz class, timer, scoring, DOM).      |

The HTML loads them in order: `questions.js` first (so the data
exists), then `script.js` (which uses that data).

## How to run

Just open `index.html` in any web browser (double-click it).
Everything runs locally.

## How to play

- Click **Start quiz**.
- Answer each question by clicking an option, or pressing keys **1-4**.
- You have **15 seconds** per question.
- Correct answers turn green, wrong ones turn red.
- At the end you see your score, percentage, and a category breakdown.
- Press **Enter** to move to the next question after answering.

## JavaScript concepts used (and where)

All inside `script.js`, split into numbered `PART` sections:

- **Objects & Array** - `questionBank` in `questions.js`
- **Class** - the `Quiz` class (Part 2)
- **Set** - `correctIds`, the unique IDs of correct answers (Part 2, 8)
- **Map** - `categoryScores`, score per category (Part 2, 9)
- **Math** - `Math.random`, `Math.floor`, `Math.round` (Parts 1, 6, 7)
- **String** - `padStart`, template literals (Part 1)
- **HTML DOM** - `createElement`, `getElementById`, `classList`, etc. (Parts 3, 6, 8, 9)
- **Events** - `click` and `keydown` listeners (Parts 6, 10)
- **Functions** - pure helpers kept apart from DOM functions (Part 1)

## Things to try (practice)

1. Add 5 more questions in `questions.js`.
2. Change the timer to 10 seconds (`SECONDS_PER_QUESTION` in `script.js`).
3. Add a new category and watch it appear in the results breakdown.
4. Make a "high score" that shows your best result of the session.
