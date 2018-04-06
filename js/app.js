/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cardsList = deck.querySelectorAll("li");
const stars = document.querySelector(".stars");
const movesSpan = document.querySelector(".moves");
const timer = document.querySelector('.timerDiv');
let second = 0;
let minute = "00";
let succesfulMoves = 0;
let unsuccessfulMoves = 0;
let selectedCardsList = [];
let movesCounter = 0;
let isTimerStarted = false;
let isSetTimeOutCalled = false; //to make the setTimeout synchronous

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(cardsList) {
  var array = Array.prototype.slice.call(cardsList);
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleCards() {
  let shuffledList = shuffle(cardsList);
  deck.innerHTML = "";
  shuffledList.forEach(function addCards(card) {
    card.className = 'card';
    deck.appendChild(card);
  });
}

/**
 * @description This function will clear the timer and sets it to 00:00
 */
function clearTimer() {
  isTimerStarted = false;
  clearInterval(timePassed);
  timer.innerHTML = "00:00";
}

/**
 * @description This function will just stop the timer
 */
function stopTimer() {
  clearInterval(timePassed);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function showCard(e) {
  if (e.target.nodeName === 'LI' && e.target.className !== 'card match' && !isSetTimeOutCalled) {
    e.target.className = e.target.className + ' open show';
    if (selectedCardsList.length === 0) {
      selectedCardsList.push(e.target);
    } else if (selectedCardsList[0].children[0].className === e.target.children[0].className) {
      isSetTimeOutCalled=true;
      cardsMatched(e);
      succesfulMoves++; //increment the succesfulMoves counter
      if (succesfulMoves === 8) {
        announceWinner();
      }
    } else {
      isSetTimeOutCalled=true;
      cardsNotMatched(e);
      unsuccessfulMoves++; //increment the unsuccesfulMoves counter
      if ((unsuccessfulMoves > 10 && succesfulMoves < 4) || (unsuccessfulMoves > 15 && succesfulMoves <= 6)) {
        updateStarRating();
      }
    }
  }
  if (!isTimerStarted) { //start the timer on first click
    startTimer();
    isTimerStarted = true; //set this variable to true so that timer will be not be started every click.
  }
}


/**
 * @description set up the event listener for a card.
 */
deck.addEventListener("click", showCard);

/**
 * @description this function is called when cards cardsMatched
 * change the class of cards which matched after a second and update the moves
 */
function cardsMatched(e) {
  setTimeout(function() {
    if (selectedCardsList[0]) {
      e.target.className = 'card match';
      selectedCardsList[0].className = 'card match';
      selectedCardsList.length = 0;
      updateMoves();
      isSetTimeOutCalled=false;
    } else{
      e.target.className = 'card';
      isSetTimeOutCalled=false;
    }
  }, 1000);
}
/**
 * @description this function is called when cards cards doesn't Matche.
 * change the class of cards to default class after a second and update the moves
 */
function cardsNotMatched(e) {
  setTimeout(function() {
    if (selectedCardsList[0]) {
      e.target.className = 'card';
      selectedCardsList[0].className = 'card';
      selectedCardsList.length = 0;
      updateMoves();
      isSetTimeOutCalled=false;
    }
    else{
      e.target.className = 'card';
      isSetTimeOutCalled=false;
    }
  }, 1000);
}

/**
 * @description this function will display total number of moves(succesfulMoves+unsuccesfulMoves)
 */
function updateMoves() {
  movesCounter++; //lets you know how many moves have you achieved.
  movesSpan.innerHTML = movesCounter.toString();
}

/*
 * @description  Show winner snackBar
 */
function myFunction() {
  stopTimer();
  // Get the snackbar DIV
  var x = document.getElementById("winnerSnackbar");
  //display the total time taken.
  x.querySelector(".span-timer").innerHTML = timer.innerHTML;
  //display the total stars scored.
  x.querySelector(".span-starscroed").innerHTML = '';
  for (let i = 0; i < stars.children.length; i++) {
    var li = document.createElement("li");
    li.className = "fa fa-star";
    x.querySelector(".span-starscroed").appendChild(li);
  }
  // Add the "show" class to DIV to make it visible
  x.className = "show snackbar button";
}

/**
 * @description  hides the modal when quit button is clicked
 */
function hideModal() {
  var x = document.getElementById("winnerSnackbar");
  x.className = "snackbar button";
}


/**
 * @description: timer
 *this function uses setInterval method to show the timer.
 *timer runs every second and increments the second
 * */
let timePassed;

function startTimer() {
  timePassed = setInterval(function() {
    if (second < 10) {
      second = "0" + second;
    }

    timer.innerHTML = minute + ' : ' + second;
    second++;
    if (second == 60) {
      minute++;
      if (minute < 10) {
        minute = "0" + minute;
      }
      second = 0;
    }
  }, 1000);
}

/**
 * @description This function updates the starrating after certain moves
 */
function updateStarRating() {
  if (stars.children.length>1) { //Player should score atleast one star
    stars.removeChild(stars.children[0]);
  }
}

/**
 * @description this function gets invoked when user matched all the cards
 */
function announceWinner() {
  myFunction();
}

/**
 * @description this function resets all the variables,,shuffls the cards
 */
function restartGame() {
  shuffleCards();
  hideModal();
  clearTimer();
  clearAllGlobalVars();
  if (stars.children.length < 3)
    //puts back the stars if removed any.
    for (let i = stars.children.length; i < 3; i++) {
      var li = document.createElement("li");
      li.className = "fa fa-star";
      stars.appendChild(li);
    }
}

/**
 * @description resets the global variables
 */
function clearAllGlobalVars() {
  succesfulMoves = 0;
  unsuccessfulMoves = 0;
  movesCounter = 0;
  minute = "00";
  second = 0;
  movesSpan.innerHTML = movesCounter.toString();
}

document.addEventListener('DOMContentLoaded', function() {
  restartGame();
});
