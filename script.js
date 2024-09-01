// オーディオコンテキスト、オシレーター、ゲインノード、現在の周波数を格納する変数を宣言
let audioContext;
let oscillator;
let gainNode;
let currentFrequency = 1000; // デフォルトの周波数を1000Hzに設定

// HTML要素の参照を取得
const frequencyButtons = document.querySelectorAll(".frequency-buttons button");
const volumeSlider = document.getElementById("volume");
const playButton = document.getElementById("playButton");
const currentFreqDisplay = document.getElementById("currentFreq");

// オーディオシステムを初期化する関数
function initAudio() {
  // オーディオコンテキストを作成（ブラウザ互換性のため、標準とWebkit版をサポート）
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  // オシレーター（音源）を作成
  oscillator = audioContext.createOscillator();
  // ゲインノード（音量制御）を作成
  gainNode = audioContext.createGain();

  // オシレーターをゲインノードに接続し、ゲインノードを出力先に接続
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // オシレーターの波形をサイン波に設定
  oscillator.type = "sine";
  // 現在の周波数を設定
  oscillator.frequency.setValueAtTime(
    currentFrequency,
    audioContext.currentTime
  );
  // 現在の音量を設定
  gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
}

// 音を再生する関数
function playSound() {
  // オーディオコンテキストが一時停止状態なら再開
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }

  // オシレーターがまだ作成されていなければ初期化して開始
  if (!oscillator) {
    initAudio();
    oscillator.start();
  }

  // 現在の音量を設定
  gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
}

// 音を停止する関数
function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
}

// 周波数ボタンにイベントリスナーを追加
frequencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // クリックされたボタンの周波数を現在の周波数に設定
    currentFrequency = parseInt(button.dataset.freq);
    // 表示を更新
    currentFreqDisplay.textContent = `選択された周波数: ${currentFrequency} Hz`;

    // オシレーターが存在する場合、周波数を更新
    if (oscillator) {
      oscillator.frequency.setValueAtTime(
        currentFrequency,
        audioContext.currentTime
      );
    }
  });
});

// 音量スライダーにイベントリスナーを追加
volumeSlider.addEventListener("input", () => {
  // ゲインノードが存在する場合、音量を更新
  if (gainNode) {
    gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
  }
});

// 再生/停止ボタンにイベントリスナーを追加
playButton.addEventListener("click", () => {
  if (playButton.textContent === "再生") {
    // 音を再生し、ボタンのテキストを「停止」に変更
    playSound();
    playButton.textContent = "停止";
  } else {
    // 音を停止し、ボタンのテキストを「再生」に変更
    stopSound();
    playButton.textContent = "再生";
  }
});

// ページ読み込み時にオーディオシステムを初期化
initAudio();
