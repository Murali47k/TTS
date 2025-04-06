const textInput = document.getElementById('textInput');
const readButton = document.getElementById('readButton');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const refreshButton = document.getElementById('refreshButton');

let utterance;
let isPaused = false;

function highlightWord(start, end) {
  textInput.focus();
  textInput.setSelectionRange(start, end);
  const textBefore = textInput.value.substring(0, start);
  const lines = textBefore.split("\n");
  textInput.scrollTop = lines.length * 20;
}

function clearActiveStates() {
  playButton.classList.remove('is-active');
  pauseButton.classList.remove('is-active');
}

readButton.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  clearActiveStates();
  utterance = new SpeechSynthesisUtterance(textInput.value);
  isPaused = false;

  utterance.onboundary = function (event) {
    if (event.name === 'word') {
      highlightWord(event.charIndex, event.charIndex + event.charLength);
    }
  };

  speechSynthesis.speak(utterance);
});

playButton.addEventListener('click', () => {
  if (isPaused) {
    speechSynthesis.resume();
    isPaused = false;
    clearActiveStates();
    playButton.classList.add('is-active');
  }
});

pauseButton.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
    isPaused = true;
    clearActiveStates();
    pauseButton.classList.add('is-active');
  }
});

refreshButton.addEventListener('click', () => {
  speechSynthesis.cancel();
  textInput.value = '';
  textInput.setSelectionRange(0, 0);
  clearActiveStates();
});
