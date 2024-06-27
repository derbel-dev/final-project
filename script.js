const cards = [
    'images/cat.png', 'images/cat.png', 'images/dog.png', 'images/dog.png',
    'images/fish.png', 'images/fish.png', 'images/horse.png', 'images/horse.png',
    'images/frog.png', 'images/frog.png', 'images/spider.png', 'images/spider.png',
    'images/sheep.png', 'images/sheep.png', 'images/snake.png', 'images/snake.png'
];

const gameBoard = document.getElementById('gameBoard');
const moveCount = document.getElementById('moveCount');
const timeDisplay = document.getElementById('time');
const particleContainer = document.getElementById('particle-container');

let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let timer = null;
let seconds = 0;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    shuffle(cards);
    cards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.innerHTML = `
            <div class="front"></div>
            <div class="back"><img src="${card}" alt="Animal"></div>
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (this === firstCard) return;
    
    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    moveCount.textContent = moves;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        matchedPairs++;
        resetCards();
        if (matchedPairs === cards.length / 2) {
            clearInterval(timer);
            showParticles();
            setTimeout(() => {
                alert(`You won in ${moves} moves and ${seconds} seconds!`);
                hideParticles();
            }, 1000);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    [firstCard, secondCard] = [null, null];
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timeDisplay.textContent = formatTime(seconds);
    }, 1000);
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('restartBtn').addEventListener('click', restartGame);

function restartGame() {
    gameBoard.innerHTML = '';
    [firstCard, secondCard] = [null, null];
    moves = 0;
    matchedPairs = 0;
    moveCount.textContent = moves;
    clearInterval(timer);
    seconds = 0;
    timeDisplay.textContent = '00:00';
    createBoard();
    startTimer();
}

function showParticles() {
    particleContainer.classList.remove('hidden');
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
        particle.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
        particleContainer.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function hideParticles() {
    particleContainer.classList.add('hidden');
    const winAudio = document.getElementById('win-audio');

// Inside your checkForMatch function, when the player wins
if (matchedPairs === cards.length / 2) {
    clearInterval(timer);
    showParticles();
    winAudio.play(); // Play win audio
    setTimeout(() => {
        alert(`You won in ${moves} moves and ${seconds} seconds!`);

        hideParticles();
    }, 1000);
}

}

createBoard();
startTimer();
