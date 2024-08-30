let audioContext;
let oscillator;
let gainNode;
let currentFrequency = 1000;

const frequencyButtons = document.querySelectorAll(".frequency-buttons button");
const volumeSlider = document.getElementById("volume");
const playButton = document.getElementById("playButton");
const currentFreqDisplay = document.getElementById("currentFreq");

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    currentFrequency,
    audioContext.currentTime
  );
  gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
}

function playSound() {
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (!oscillator) {
    initAudio();
    oscillator.start();
  }

  gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
}

function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
}

frequencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFrequency = parseInt(button.dataset.freq);
    currentFreqDisplay.textContent = `選択された周波数: ${currentFrequency} Hz`;

    if (oscillator) {
      oscillator.frequency.setValueAtTime(
        currentFrequency,
        audioContext.currentTime
      );
    }
  });
});

volumeSlider.addEventListener("input", () => {
  if (gainNode) {
    gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
  }
});

playButton.addEventListener("click", () => {
  if (playButton.textContent === "再生") {
    playSound();
    playButton.textContent = "停止";
  } else {
    stopSound();
    playButton.textContent = "再生";
  }
});

// 初期化
initAudio();
