const questions = [
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { question: "What is the chemical symbol for water?", options: ["O₂", "H₂O", "CO₂", "HO"], answer: "H₂O" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Jupiter", "Mars"], answer: "Mars" },
  { question: "Who wrote Romeo and Juliet?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
  { question: "What does CPU stand for?", options: ["Central Process Unit", "Computer Processing Unit", "Central Processing Unit", "Control Processing Unit"], answer: "Central Processing Unit" },
  { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
  { question: "Which language is primarily spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], answer: "Portuguese" },
  { question: "What year did World War II end?", options: ["1940", "1943", "1945", "1950"], answer: "1945" },
  { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"], answer: "Leonardo da Vinci" },
  { question: "What is the largest mammal?", options: ["Elephant", "Whale Shark", "Blue Whale", "Giraffe"], answer: "Blue Whale" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
  { question: "Which number is a prime number?", options: ["9", "15", "11", "21"], answer: "11" },
  { question: "In which sport is the term 'love' used?", options: ["Cricket", "Tennis", "Football", "Basketball"], answer: "Tennis" },
  { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Onion", "Avocado", "Cucumber"], answer: "Avocado" }
];

let current = 0;
let score = 0;
let timerId;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const resultModal = document.getElementById("result-modal");
const scoreEl = document.getElementById("score");
const starRatingEl = document.getElementById("star-rating");
const leaderboardEl = document.getElementById("leaderboard");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {
  clearTimeout(timerId);
  timerEl.style.transition = "none";
  timerEl.style.transform = "scaleX(1)";
  
  const q = questions[current];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  
  q.options.forEach(opt => {
    const id = `opt-${opt.replace(/\s+/g, '-')}`;
    optionsEl.innerHTML += `
      <input type="radio" name="opt" id="${id}" value="${opt}">
      <label for="${id}">${opt}</label>
    `;
  });
  const labels = optionsEl.querySelectorAll('label');
  labels.forEach(label => {
    label.classList.remove("correct", "incorrect");
    label.onclick = () => {
      labels.forEach(l => l.classList.remove("correct", "incorrect"));
    };
  });

  setTimeout(() => {
    timerEl.style.transition = "transform 10s linear";
    timerEl.style.transform = "scaleX(0)";
  }, 50);

  timerId = setTimeout(() => {
    handleAnswer();
  }, 10000);
  
  nextBtn.disabled = true;
}

function handleAnswer() {
  clearTimeout(timerId);
  const selected = document.querySelector('input[name="opt"]:checked');
  const labels = optionsEl.querySelectorAll('label');

  if (selected) {
    const answer = questions[current].answer;

    labels.forEach(label => {
      if (label.htmlFor === selected.id) {
        if (selected.value === answer) {
          label.classList.add("correct");
          score++;
        } else {
          label.classList.add("incorrect");
        }
      }
      // Mark correct answer
      if (label.textContent === answer) {
        label.classList.add("correct");
      }
    });
  } else {
    labels.forEach(label => {
      if (label.textContent === questions[current].answer) {
        label.classList.add("correct");
      }
    });
  }

  nextBtn.disabled = false;
}

function showNext() {
  handleAnswer();
  
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById("quiz-container").style.display = "none";
  resultModal.classList.add("show");
  scoreEl.textContent = score;
  const starsCount = Math.round(score / 3);
  starRatingEl.textContent = "⭐".repeat(starsCount);

  let scores = JSON.parse(localStorage.getItem("quizScores") || "[]");
  scores.push(score);
  scores = scores.sort((a,b) => b - a).slice(0,5);
  localStorage.setItem("quizScores", JSON.stringify(scores));

  leaderboardEl.innerHTML = "";
  scores.forEach((s, i) => {
    leaderboardEl.innerHTML += `<li>${i + 1}. Score: ${s}</li>`;
  });
}

nextBtn.addEventListener("click", showNext);
restartBtn.addEventListener("click", () => location.reload());

loadQuestion();
