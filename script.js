const moves = document.getElementById("move-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items Array
const items = [
    {name:"alphabet_a", image: "./images/alphabet_a.jpg"},
    {name:"alphabet_aa", image: "./images/alphabet_aa.jpg"},
    {name:"alphabet_b", image: "./images/alphabet_b.jpg"},
    {name:"alphabet_bb", image: "./images/alphabet_bb.jpg"},
    {name:"alphabet_c", image: "./images/alphabet_c.jpg"},
    {name:"alphabet_cc", image: "./images/alphabet_cc.jpg"},
    {name:"alphabet_d", image: "./images/alphabet_d.jpg"},
    {name:"alphabet_dd", image: "./images/alphabet_dd.jpg"},
    {name:"alphabet_e", image: "./images/alphabet_e.jpg"},
    {name:"alphabet_ee", image: "./images/alphabet_ee.jpg"},
    {name:"alphabet_f", image: "./images/alphabet_f.jpg"},
    {name:"alphabet_ff", image: "./images/alphabet_ff.jpg"},
    {name:"alphabet_k", image: "./images/alphabet_k.jpg"},
    {name:"alphabet_kk", image: "./images/alphabet_kk.jpg"},
    {name:"alphabet_p", image: "./images/alphabet_p.jpg"},
    {name:"alphabet_pp", image: "./images/alphabet_pp.jpg"},
];

//Initial Time
let seconds = 0, minutes = 0;

// Initial moves and win count
let moveCount = 0, winCount = 0;

// For Timer
const timeGenerator = () =>{
    seconds++;
    // Minutes logic
    if(seconds>=60){
        minutes++;
        seconds = 0;
    }
    // Formate time before displaying
    let secondValue = seconds < 10 ? `0${seconds}` :seconds;
    let minuteValue = minutes < 10 ? `0${minutes}` :minutes;

    timeValue.innerHTML = `<span>Time: </span>${minuteValue}:${secondValue}`;
};

// For calculating moves
const movesCounter = () =>{
    moveCount++;
    moves.innerHTML = `<span>Moves: </span>${moveCount}`;
}

// Pick random objects from the items array
const generateRandom = (size = 4) =>{
    // Temporary array
    let tempArray = [...items];
    // Initializes cardValues array
    let cardValues = [];
    // Size should be double (4*4 matrix)/2 since pairs of objs would exist
    size = (size * size)/2;
    // Random Obj Selection
    for(let i=0; i<size; i++){
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // Once selected, remove the obj from temp arr
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) =>{
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    // Simple shuffle
    cardValues.sort(()=> Math.random() - 0.5);
    for(let i=0; i< size*size; i++){
        /*
            Create Cards:
            before => front side (contains question mark)
            after => back side (contain actual image);
            data-card-values is a custom attribute which store
            the names of the cards to match later.

        */
       gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class = "card-before">?</div>
        <div class="card-after">
            <img src="${cardValues[i].image}", width=98%/>
        </div>
       </div>`
    }
    // Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    // Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) =>{
        card.addEventListener("click", () =>{
            // If selected card is not matched yet then only run(i.e. already matched card when clicked then ignored.)
            if(!card.classList.contains("matched")){
                // Flip the clicked card
                card.classList.add("flipped");
                // If it is the firstcard (!firstCrad sence initially firstCrad is false.)
                if(!firstCard){
                    // So current card will become firstcard
                    firstCard = card;
                    // Current cards valu become firstCaredValue
                    firstCardValue = card.getAttribute("data-card-value");
                }else{
                    // Increment moves since user seleceted second card
                    movesCounter();
                    // Secondcard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if(firstCardValue == secondCardValue){
                        // If both card matched class so these cards would beignored next time
                        firstCard.classList.add("matcehd");
                        secondCard.classList.add("matcehd");
                        // firstCard.classList.add("hide");
                        // secondCard.classList.add("hide");
                        // setTimeout(()=>{
                            firstCard.classList.add("white");
                            secondCard.classList.add("white");
                        // },900);
                        // setTimeout(() =>{
                        //     firstCard.classList.add("white");
                        //     secondCard.classList.add("white");
                        // },500);
                        
                        
                        // Set firstCard to false since next card would be first now
                        firstCard = false;
                        // winCount incerement as user found a correct match
                        winCount++;
                        
                        // Check if winCount == half of cardValues
                        if(winCount == Math.floor(cardValues.length/2)){
                            result.innerHTML = `<h2>You won</h2>
                            <h4>Moves: ${moveCount}</h4>`;
                            stopGame();
                        }
                    }else{
                        // If the cards don't matche
                        // Flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() =>{
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        },900);
                    }
                }
            }
        });
    });
};

// Start game 
startButton.addEventListener("click", () =>{
    moveCount = 0;
    // seconds = 0;
    minutes = 0;
    // Controls and button visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");

    // Start timer
    interval = setInterval(timeGenerator, 1000);
    // Initial moves
    moves.innerHTML =`<span>Moves: </span> ${moveCount}`;
    Initializer();
});

// stop game
stopButton.addEventListener("click", (stopGame = () =>{
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");

    clearInterval(interval);
})
);

// Initialize values and fun calls
const Initializer = () =>{
    result.innerHTML = "";
    winCount = 0;
    let cardValues = generateRandom();
    // console.log(cardValues);
    matrixGenerator(cardValues);
};
