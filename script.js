const images = [
    "img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg",
    "img5.jpg", "img6.jpg", "img7.jpg", "img8.jpg",
    "img9.jpg", "img10.jpg", "img11.jpg", "img12.jpg",
    "img13.jpg", "img14.jpg", "img15.jpg", "img16.jpg",
    "img17.jpg", "img18.jpg", "img19.jpg", "img20.jpg",
    "img21.jpg", "img22.jpg", "img23.jpg"
];

const gameBoard = document.getElementById("game-board");
const playerNameInput = document.getElementById("player-name");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-game");
const matchesDisplay = document.getElementById("matches");
const timeDisplay = document.getElementById("time");
const scoreBoard = document.getElementById("score-board");

let flippedCards = [];
let matches = 0;
let startTime;
let timerId = null;
let gameOver = false;
let numImages; 


startButton.addEventListener("click", startGame);

function startGame() {
    const playerName = playerNameInput.value.trim();
    const difficulty = difficultySelect.value;

    if (!playerName) {
        alert("Prašau įveskite vardą."); // BOM: Alert
        return;
    }

    console.log(`Žaidėjo vardas: ${playerName}, Sudėtingumas: ${difficulty}`); // BOM: Console log
    if (difficulty === "easy") {
        numImages = 10; // poru
    } else if (difficulty === "medium") {
        numImages = 14; 
    } else {
        numImages = 22;
    }

    resetGame();
    shuffleAndSetup(numImages);
    gameBoard.classList.remove("hidden");
    scoreBoard.classList.remove("hidden");
    startTime = new Date();
    updateTime();
}

function resetGame() {
    matches = 0;
    gameOver = false;
    if (timerId) cancelAnimationFrame(timerId);
    timerId = null;
    matchesDisplay.textContent = "Rasta porų: 0";
    timeDisplay.textContent = "Laikas: 0";
    gameBoard.innerHTML = ""; // DOM: Clear game board
    flippedCards = [];
}

function shuffleAndSetup(numImages) {
    const shuffledImages = images
        .slice(0, numImages)
        .concat(images.slice(0, numImages))
        .sort(() => 0.5 - Math.random());

    gameBoard.style.gridTemplateColumns = `repeat(4, 1fr)`; // DOM: Grid layout

    shuffledImages.forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card", "relative", "w-full", "pb-[100%]", "bg-blue-300", "rounded-xl", "cursor-pointer", "hover:bg-blue-400", "shadow-md");
        card.innerHTML = `
            <img src="${image}" alt="Memory Card" class="absolute w-full h-full object-cover rounded-xl opacity-0 transition-opacity duration-500" draggable="false">
        `;
        card.addEventListener("click", () => flipCard(card, image));
        gameBoard.appendChild(card); // DOM: Add card to the board
    });
}

function flipCard(card, image) {
    if (flippedCards.length === 2 || card.classList.contains("flipped")) return;
    const img = card.querySelector("img");
    img.classList.add("opacity-100");
    card.classList.add("flipped");
    flippedCards.push({ card, image });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.image === second.image) {
        matches++;
        matchesDisplay.textContent = `Rasta porų: ${matches}`; // DOM: Update matches
        flippedCards = [];
        if (matches === numImages) { 
            gameOver = true; 
            cancelAnimationFrame(timerId); 
            saveHighScore();
            const playAgain = confirm(`Jūs laimėjote! ${timeDisplay.textContent}. Žaisti vėl?`); // BOM: Confirm dialog
            if (playAgain) startGame();
        }
    } else {
        setTimeout(() => {
            first.card.querySelector("img").classList.remove("opacity-100");
            second.card.querySelector("img").classList.remove("opacity-100");
            first.card.classList.remove("flipped");
            second.card.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

function saveHighScore() {
    const playerName = playerNameInput.value.trim();
    const elapsedTime = timeDisplay.textContent;
    const difficulty = difficultySelect.value;

    // Parse existing scores for the selected difficulty or initialize an empty array
    const scores = JSON.parse(sessionStorage.getItem(`highScores_${difficulty}`)) || [];

    // Add the new score
    scores.push({ name: playerName, time: elapsedTime });

    // (ascending)
    scores.sort((a, b) => parseTime(a.time) - parseTime(b.time));

    sessionStorage.setItem(`highScores_${difficulty}`, JSON.stringify(scores));

    displayHighScores();
}



function parseTime(timeString) {
    const timeParts = timeString.split(" ");
    let totalSeconds = 0;

    timeParts.forEach(part => {
        if (part.endsWith("h")) {
            totalSeconds += parseInt(part) * 3600;
        } else if (part.endsWith("m")) {
            totalSeconds += parseInt(part) * 60;
        } else if (part.endsWith("s")) {
            totalSeconds += parseInt(part);
        }
    });

    return totalSeconds;
}


function displayHighScores() {
    const difficulties = ["easy", "medium", "hard"];
    difficulties.forEach(difficulty => {
        const highScoresList = document.getElementById(`high-scores-${difficulty}`);
        highScoresList.innerHTML = ""; 

        // Parse scores from sessionStorage or initialize an empty array
        const scores = JSON.parse(sessionStorage.getItem(`highScores_${difficulty}`)) || [];

        if (scores.length === 0) {
            const noScoresMessage = document.createElement("li");
            noScoresMessage.textContent = "Nėra rezultatų.";
            highScoresList.appendChild(noScoresMessage);
        } else {
            scores.forEach((score, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${score.name}: ${score.time}`;
                highScoresList.appendChild(listItem);
            });
        }
    });

    document.getElementById("high-scores").classList.remove("hidden"); 
}




document.addEventListener("DOMContentLoaded", () => {
    displayHighScores();
});


function updateTime() {
    if (gameOver) {
        cancelAnimationFrame(timerId); 
        return;
    }

    const elapsedTime = Math.floor((new Date() - startTime) / 1000);
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    let timeString = '';
    if (hours > 0) {
        timeString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
        timeString += `${minutes}m `;
    }
    timeString += `${seconds}s`;

    timeDisplay.textContent = `Laikas: ${timeString}`; // DOM: Update timer
    timerId = requestAnimationFrame(updateTime); 
}
