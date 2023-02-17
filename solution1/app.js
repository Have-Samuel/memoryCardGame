const cards = document.querySelectorAll('.game-card');
const numCards = cards.length;
let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let currentScore = 0;
const lowScore = localStorage.getItem('low-score');
const start = document.getElementById('start');

if (lowScore) {
  document.getElementById('best-score').innerText = lowScore;
}

for (const card of cards) {
  card.addEventListener('click', handleCardClick);
}

const startBtn = document.getElementById('start-button');
startBtn.addEventListener('click', startGame);

function handleCardClick(e) {
  if (!e.target.classList.contains('front')) return;

  const currentCard = e.target.parentElement;

  if (!card1 || !card2) {
    if (!currentCard.classList.contains('flipped')) {
      setScore(currentScore + 1);
    }
    currentCard.classList.add('flipped');
    card1 = card1 || currentCard;
    card2 = currentCard === card1 ? null : currentCard;
  }

  if (card1 && card2) {
    const gif1 = card1.children[1].children[0].src;
    const gif2 = card2.children[1].children[0].src;

    if (gif1 === gif2) {
      cardsFlipped += 2;
      card1.removeEventListener('click', handleCardClick);
      card2.removeEventListener('click', handleCardClick);
      card1 = null;
      card2 = null;
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1 = null;
        card2 = null;
      }, 1000);
    }
  }

  if (cardsFlipped === numCards) endGame();
}

function startGame() {
  setScore(0);
  start.classList.add('playing');
  const indices = [];
  for (let i = 1; i <= numCards / 2; i++) {
    indices.push(i.toString());
  }
  const pairs = shuffle(indices.concat(indices));

  for (let i = 0; i < cards.length; i++) {
    const path = `gifs/${pairs[i]}.gif`;
    cards[i].children[1].children[0].src = path;
  }
}

function shuffle(array) {
  const arrayCopy = array.slice();
  for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
    // generate a random index between 0 and idx1 (inclusive)
    const idx2 = Math.floor(Math.random() * (idx1 + 1));

    // swap elements at idx1 and idx2
    const temp = arrayCopy[idx1];
    arrayCopy[idx1] = arrayCopy[idx2];
    arrayCopy[idx2] = temp;
  }
  return arrayCopy;
}

function setScore(newScore) {
  currentScore = newScore;
  document.getElementById('current-score').innerText = currentScore;
}

function endGame() {
  const end = document.getElementById('end');
  const scoreHeader = end.children[1];
  scoreHeader.innerText = `Your score: ${currentScore}`;
  const lowScore = +localStorage.getItem('low-score') || Infinity;
  if (currentScore < lowScore) {
    scoreHeader.innerText += ' - NEW BEST SCORE!!';
    localStorage.setItem('low-score', currentScore);
  }
  document.getElementById('end').classList.add('game-over');
}
