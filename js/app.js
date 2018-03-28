/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cardsList = deck.querySelectorAll("li");
const displayMoves = document.querySelector(".stars");
const movesSpan = document.querySelector(".moves");
console.log(cardsList);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(cardsList) {
    var array=Array.prototype.slice.call(cardsList);
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleCards(){
  let shuffledList=shuffle(cardsList);
  deck.innerHTML="";
  shuffledList.forEach(function addCards(card){
    card.className = 'card';
    deck.appendChild(card);
  });
  movesCounter = 0;
  movesSpan.innerHTML = movesCounter.toString();
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
let selectedCardsList=[];
let movesCounter=0;
function showCard(e){
  if(e.target.nodeName === 'LI' && e.target.className !== 'card match' ){
    e.target.className = e.target.className + ' open show';
    if(selectedCardsList.length===0){
      selectedCardsList.push(e.target);
    }else if(selectedCardsList[0].children[0].className === e.target .children[0].className){
      cardsMatched(e);
    }else{
      cardsNotMatched(e);
    }
  }
}

deck.addEventListener("click",showCard);

function cardsMatched(e){
  setTimeout(function(){
    e.target.className = 'card match';
    selectedCardsList[0].className = 'card match';
    selectedCardsList.length=0;
    updateMoves();
    myFunction("Voila you did it");
  }, 1000);
}

function cardsNotMatched(e){
  setTimeout(function(){
    e.target.className = 'card';
    selectedCardsList[0].className = 'card';
    selectedCardsList.length=0;
    updateMoves();
    myFunction("oops! Cards doesn't match, Try Again.");
  }, 1000);
}

function updateMoves(){
  movesCounter++; //lets you know how many moves have you achieved.
  movesSpan.innerHTML = movesCounter.toString();
}

// Show snackBar
function myFunction(textMessage) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")

    //show custome textMessage
    x.innerHTML = textMessage;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1000);
}
