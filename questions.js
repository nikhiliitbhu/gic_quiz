/* ================================================================
   THE DATA  (Array of Objects)
   ----------------------------------------------------------------
   Each question is an OBJECT with named properties.
   All the questions together form an ARRAY.
   `correct` is the INDEX (0-3) of the right answer in `options`.

   This file is kept separate so you can add or change questions
   without touching the game logic in script.js.
   Want more questions? Just copy an object and edit it.
   ================================================================ */
const questionBank = [
  {
    id: 1,
    category: "Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    id: 2,
    category: "Science",
    question: "What gas do plants absorb from the air?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    correct: 2
  },
  {
    id: 3,
    category: "History",
    question: "Who was the first Prime Minister of India?",
    options: ["Sardar Patel", "Jawaharlal Nehru", "Mahatma Gandhi", "B. R. Ambedkar"],
    correct: 1
  },
  {
    id: 4,
    category: "Computers",
    question: "What does 'HTML' stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink Text Marking Language"
    ],
    correct: 0
  },
  {
    id: 5,
    category: "Computers",
    question: "Which method adds an item to the END of a JavaScript array?",
    options: ["shift()", "unshift()", "push()", "pop()"],
    correct: 2
  }
];
