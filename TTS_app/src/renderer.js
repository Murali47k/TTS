// This code runs in the BrowserWindow context, so `document` is available.

// Get DOM elements
const textInput = document.getElementById('textInput');
const readButton = document.getElementById('readButton');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const refreshButton = document.getElementById('refreshButton');

let utterance;
let isPaused = false;

// When "Read" is clicked, cancel any current speech and start new speech
readButton.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
  utterance = new SpeechSynthesisUtterance(textInput.value);
  speechSynthesis.speak(utterance);
});

// Resume speech if paused
playButton.addEventListener('click', () => {
  if (isPaused) {
    speechSynthesis.resume();
    isPaused = false;
  }
});

// Pause the speech
pauseButton.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
    isPaused = true;
  }
});

// Refresh button: clear the text area and cancel any current speech
refreshButton.addEventListener('click', () => {
  speechSynthesis.cancel();
  textInput.value = '';
});
