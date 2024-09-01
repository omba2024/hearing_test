// グローバル変数の宣言
let audioContext; // Web Audio APIのコンテキスト
let oscillator; // 音を生成するオシレーター
let gainNode; // 音量を制御するゲインノード
let currentFrequency = 1000; // 現在の周波数（デフォルト: 1000Hz）
let isPlaying = false; // 再生状態を追跡するフラグ

// HTML要素の参照を取得
const frequencyButtons = document.querySelectorAll(".frequency-buttons button");
const volumeSlider = document.getElementById("volume");
const playButton = document.getElementById("playButton");
const currentFreqDisplay = document.getElementById("currentFreq");

// オーディオシステムを初期化する関数
function initAudio() {
  // audioContextがまだ作成されていない場合のみ新規作成
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // オシレーターとゲインノードを作成
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  // オーディオグラフの接続: オシレーター -> ゲインノード -> 出力
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // オシレーターの設定
  oscillator.type = "sine"; // サイン波を使用
  oscillator.frequency.setValueAtTime(
    currentFrequency,
    audioContext.currentTime
  );
  // 初期音量の設定
  gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
}

// 音を再生する関数
function playSound() {
  // オーディオコンテキストが一時停止状態なら再開
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }

  // 再生中でない場合のみ、新しくオーディオを初期化して開始
  if (!isPlaying) {
    initAudio();
    oscillator.start();
    isPlaying = true;
  }

  // 現在の音量を設定（再生中に音量が変更された場合に対応）
  gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
}

// 音を停止する関数
function stopSound() {
  if (isPlaying) {
    oscillator.stop();
    isPlaying = false;
    // オシレーターとゲインノードの参照をクリア
    oscillator = null;
    gainNode = null;
  }
}

// 周波数ボタンにイベントリスナーを追加
frequencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // クリックされたボタンの周波数を現在の周波数に設定
    currentFrequency = parseInt(button.dataset.freq);
    // 表示を更新
    currentFreqDisplay.textContent = `選択された周波数: ${currentFrequency} Hz`;

    // 再生中の場合、オシレーターの周波数を即時に更新
    if (isPlaying) {
      oscillator.frequency.setValueAtTime(
        currentFrequency,
        audioContext.currentTime
      );
    }
  });
});

// 音量スライダーにイベントリスナーを追加
volumeSlider.addEventListener("input", () => {
  // ゲインノードが存在する場合（再生中の場合）、音量を更新
  if (gainNode) {
    gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
  }
});

// 再生/停止ボタンにイベントリスナーを追加
playButton.addEventListener("click", () => {
  if (!isPlaying) {
    // 再生中でない場合、音を再生してボタンのテキストを「停止」に変更
    playSound();
    playButton.textContent = "停止";
  } else {
    // 再生中の場合、音を停止してボタンのテキストを「再生」に変更
    stopSound();
    playButton.textContent = "再生";
  }
});

// 注: 初期化は最初の再生時に行われるため、ここでinitAudio()を呼び出す必要はありません
