const backgroundAudio = document.getElementById('background-audio');
const startGameAudio = document.getElementById('start-game-audio');
const startButton = document.getElementById('startButton');

document.getElementById('startButton').addEventListener('click', () => {
    // Stop the original background audio
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    let newGameAudio = new Audio('audio/queen.mp3');
    newGameAudio.loop = true;
    newGameAudio.play();
    
});