const wordDisplay = document.querySelector('.word-display'),
      keyBoard = document.querySelector('.keyboard'),
      guessesText = document.querySelector('.guesses-text b'),
      water = document.querySelector('.water'),
      modal = document.querySelector('.game__modal'),
      continueBtn = document.querySelector('.continue')
let currentWord,
    wrongGuessCount,
    correctLetter = [];

const maxGuesses = 6;

function resetGame(){
    correctLetter = [];
    wrongGuessCount = 0;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyBoard.querySelectorAll('button').forEach(function(btn){
        btn.disabled = false;
    })
    wordDisplay.innerHTML = currentWord.split('').map(function(){
        return `<li class="letter"></li>`
    }).join('');
    water.style = `
    height: 0%;
`
}

function getRandomWord(){
    // select random word
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)]
    currentWord = word;
    document.querySelector('.hint-text b').innerText = hint;
    resetGame()
    wordDisplay.innerHTML = word.split('').map(function(){
        return `<li class="letter"></li>`
    }).join('');
    
}

function gameOver(isCompleted){
    setTimeout(function(){
        const modalText =  isCompleted ? `You found the word: ` : `The correct word is: `;
        modal.querySelector('img').src = `assets/img/${isCompleted ? 'completed': 'lost'}.png`;
        modal.querySelector('h4').innerText = `${isCompleted ? 'Congratulation!': 'Game Over!'}`;
        modal.querySelector('p').innerHTML = `${modalText}<b>${currentWord}</b>`;
        modal.classList.add('show');
    }, 1000)
}

function initGame(button, clickedLetter){
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach(function(letter, index){
            if(letter === clickedLetter){
                correctLetter.push(letter)
                wordDisplay.querySelectorAll('li')[index].innerText = letter
                wordDisplay.querySelectorAll('li')[index].classList.add('guessed')
            }
        })
    }
    else {
        wrongGuessCount++;
        water.style = `
            height: ${wrongGuessCount * 100/6}%;
        `

    }
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    button.disabled = true;
    if(wrongGuessCount === maxGuesses){
        gameOver(false)
    }
    if(correctLetter.length === currentWord.length){
        gameOver(true)
    }
}

// Create letter btn & add event listen
for(let i = 97; i < 122; i++ ){
    const button = document.createElement('button')
    button.classList.add('btn');
    button.innerHTML = String.fromCharCode(i)
    keyBoard.appendChild(button);
    button.addEventListener('click',function(e){
        initGame(e.target, String.fromCharCode(i))
    })
}
getRandomWord();
continueBtn.addEventListener('click', function(){
    getRandomWord();
    modal.classList.remove('show')
})