const textInput = document.getElementById('textInput');
const readButton = document.getElementById('readButton');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const refreshButton = document.getElementById('refreshButton');
const voiceSelect = document.getElementById('voiceSelect');

let utterance;
let isPaused = false;
let voices = [];

// Optional: Adjust scroll height if needed
const lineHeight = 20;

function highlightWord(start, end) {
  textInput.focus();
  textInput.setSelectionRange(start, end);
  const textBefore = textInput.value.substring(0, start);
  const lines = textBefore.split("\n");
  const scrollPosition = lineHeight * (lines.length - 1);
  textInput.scrollTop = scrollPosition;
}

function clearActiveStates() {
  playButton.classList.remove('is-active');
  pauseButton.classList.remove('is-active');
}

function populateVoices() {
  voices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    let shortName = voice.name.replace(/^Microsoft /, '');
    option.textContent = `${shortName} (${voice.lang})${voice.default ? ' — DEFAULT' : ''}`;
    voiceSelect.appendChild(option);
  });
}

// Load voices asynchronously
speechSynthesis.onvoiceschanged = populateVoices;
populateVoices(); // Initial call for some browsers

readButton.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  clearActiveStates();
  utterance = new SpeechSynthesisUtterance(textInput.value);
  isPaused = false;

  // Assign selected voice
  const selectedVoiceIndex = voiceSelect.value;
  if (voices[selectedVoiceIndex]) {
    utterance.voice = voices[selectedVoiceIndex];
  }

  // Highlighting words (optional - browser support varies)
  utterance.onboundary = function (event) {
    if (event.name === 'word') {
      highlightWord(event.charIndex, event.charIndex + (event.charLength || 1));
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
