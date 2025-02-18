const categories = {
    fruits: ["🍎", "🍌", "🍒", "🍇", "🍍", "🍑", "🍓", "🍉"],
    emojis: ["😀", "😂", "😍", "😎", "😇", "🤩", "🥺", "🤗"],
    animals: ["🐶", "🐱", "🐰", "🦊", "🦁", "🐯", "🐻", "🐨"],
    planets: ["🔵", "🌕", "🌑", "🪐", "🌏", "☄️", "☀️", "⭐"],
    Nature: ["🍂", "🍁", "🪶", "🥀", "🎃", "🌴", "🌵", "⭐"]
};

let flippedCards = [];
let matchedCards = [];
let timer;
let timeLeft = 30;
let score = 0;

function startGame(category) {
    timeLeft = 30;
    score = 0;
    flippedCards = [];
    matchedCards = [];
    document.getElementById("game-over").classList.add('hidden');
    document.getElementById("game-board").innerHTML = '';
    document.getElementById("score").textContent = "Score: 0";
    document.getElementById("timer").textContent = "Time: 30";
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("game-container").style.display = "block";


    let selectedCategory = categories[category];
    let gameCards = [...selectedCategory, ...selectedCategory];
    shuffleCards(gameCards);
    renderBoard(gameCards);
    startTimer(); 
}

function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function renderBoard(cards) {
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-id", index);
        cardElement.setAttribute("data-value", card);
        cardElement.addEventListener("click", handleCardClick);
        document.getElementById("game-board").appendChild(cardElement);
    });
}

function handleCardClick(e) {
    if (timeLeft === 0) return;

    const card = e.target;
    if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
        card.classList.add("flipped");
        card.textContent = card.getAttribute("data-value");
        flippedCards.push(card);

        if (flippedCards.length == 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute("data-value") === card2.getAttribute("data-value")) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedCards.push(card1, card2);
        score++;
        updateScore();
        checkWin();
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = "";
            card2.textContent = "";
        }, 200); 
    }

    flippedCards = [];
}

function checkWin() {
    if (matchedCards.length === 16) {
        clearInterval(timerInterval); 
        document.getElementById("result").textContent = `🎉 Good Job! You finished with a score of ${score}!`;
        document.getElementById("result").style.display = "block";
    }
}
function updateScore() {
    document.getElementById("score").textContent = "Score: " + score;
}


function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timer").textContent = "Time: " + timeLeft;
        } else {
            clearInterval(timerInterval);
            document.getElementById("result").textContent = `⏳ Time's up! Your final score is ${score}.`;
            document.getElementById("result").style.display = "block"; 
        }
    }, 1000);
}

function endGame(message) {
    clearInterval(timer);
    document.getElementById("game-over").textContent = message + " Final Score: " + score;
    document.getElementById("game-over").classList.remove('hidden');
    document.getElementById("game-container").style.pointerEvents = "none"; 
}

localStorage.setItem("gameState", JSON.stringify({ score, timeLeft }));
