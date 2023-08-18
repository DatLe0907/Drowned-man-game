    const main = document.getElementById('main');
    const themeSong = new Audio('./assets/audio/themesong.mp3');
    const waterSplash = new Audio('./assets/audio/water-splash.mp3');
    const success = new Audio('./assets/audio/success.mp3');
    const wrong = new Audio('./assets/audio/wrong.mp3');

  // Nhấn vào start btn -> chạy nhạc và bắt đầu chạy game
  let startButton = document.querySelector(".start-game");
  
  function handleStartButtonClick() {
    themeSong.play();
    startGame();
  
    // Remove event listener for "Enter" key
    document.removeEventListener("keydown", handleKeyDown);
  }
  
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      themeSong.play();
      startGame();
      document.removeEventListener("keydown", handleKeyDown);
    }
  }
  
  if (startButton !== null) {
    startButton.addEventListener("click", handleStartButtonClick);
    document.addEventListener("keydown", handleKeyDown);
  }
  
  // khi nhạc kết thúc -> restart
  themeSong.addEventListener(
    "ended",
    function () {
      this.currentTime = 0;
      this.play();
    },
    false
  );

    function startGame(word){
        main.innerHTML = `<div class="container">
        <div class="game__modal">
          <div class="modal__overlay"></div>
          <div class="modal__content">
            <img src="" alt="" />
            <h4>Game Over!</h4>
            <p>The correct word was: <b>${word}</b></p>
            <button class="continue btn">Continue</button>
          </div>
        </div>
        <div class="wrapper">
        <div class="drowned-man__box">
            <div class="box__pipe">
              <img src="./assets/img/pipe.png" alt="">
              <div class="water__in__pipe"></div>
            </div>
            <div class="box__container">
              
              <img src="./assets/img/man.png" alt="">  
              
            </div>
            <div class="box__water">
              <div class="water"></div>
            </div>
          </div>
        </div>
        <div class="game__box">
          <ul class="word-display"></ul>
          <h4 class="hint-text">
            Hint:
            <b>Lorem ipsum dolor sit amet consectetur adipisicing elit.</b>
          </h4>
          <h4 class="guesses-text">
            Incorect guesses:
            <b>0 / 6</b>
          </h4>
          <div class="keyboard"></div>
        </div>
      </div>
      <div class="footer">
        <i>Source: Datle0907</i>
        <span>From: Team IT07</span>
      </div>`

      const wordDisplay = document.querySelector('.word-display'),
      keyBoard = document.querySelector('.keyboard'),
      guessesText = document.querySelector('.guesses-text b'),
      water = document.querySelector('.water'),
      modal = document.querySelector('.game__modal'),
      waterInPipe = document.querySelector('.water__in__pipe'),
      continueBtn = document.querySelector('.continue');
  const maxGuesses = 6;
  
  let check;
  let currentWord,
      wrongGuessCount,
      correctLetter = [];
  
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
          return check = isCompleted;
      }, 1000)
  }
  
  function initGame(button, inputLetter){
      if(currentWord.includes(inputLetter)){
          [...currentWord].forEach(function(letter, index){
              if(letter === inputLetter){
                  correctLetter.push(letter)
                  wordDisplay.querySelectorAll('li')[index].innerText = letter
                  wordDisplay.querySelectorAll('li')[index].classList.add('guessed')
              }
          })
      }
      else {
          let boxHeight = document.querySelector('.drowned-man__box').offsetHeight;
          wrongGuessCount++;
          if(wrongGuessCount <= maxGuesses){
            waterInPipe.style = `
            transition: 1s;
            height: ${ boxHeight - (wrongGuessCount * 100/maxGuesses)}px;
        `
        setTimeout(function(){
            waterSplash.play()
            water.style = `
            transition: 2s;
            height: ${wrongGuessCount * 100/(maxGuesses)}%;
        `
        },1000);
        setTimeout(function(){
            waterInPipe.style = `
            transition: 0s;
        height: 0%;
        `
        },2500);
          }
  
  
  
  
      }
      guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
      button.disabled = true;
      if(wrongGuessCount === maxGuesses || water.style === `height: 100%;`){
          gameOver(false);
          wrong.play();
      }
      if(correctLetter.length === currentWord.length){
          gameOver(true);
          success.play();
      }
  }
  
  // Create letter btn & add event listen
  for(let i = 97; i < 123; i++ ){
      const button = document.createElement('button')
      button.classList.add('btn');
      button.innerHTML = String.fromCharCode(i)
      keyBoard.appendChild(button);
      button.addEventListener('click',function(e){
          initGame(e.target, String.fromCharCode(i))
      })
  }
  
  let btnList = document.querySelectorAll('.keyboard button'),
      keyTypedList = []
  document.addEventListener("keydown",function(e){
      btnList.forEach(function(btn){
          if(btn.innerText === e.key.toUpperCase()){
              initGame(btn, e.key);
              keyTypedList.push(e.key.toUpperCase())
              console.log(keyTypedList)
          }
          keyTypedList.forEach(function(keyTyped){
              if(e.key = keyTyped){
                  e.preventDefault()
              }
          })
      })
  })
  
  
   
  
  getRandomWord();
  continueBtn.addEventListener('click', function(){
      getRandomWord();
      modal.classList.remove('show')
  })
  
  document.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && (check === true || check ===false)){
          getRandomWord();
          modal.classList.remove('show')
      }
  })
    }


