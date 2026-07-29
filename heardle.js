let songs = {};
let currentId = null;
let currentTry = 1;
let score = 0;
const totalTries = 6;

const player = document.getElementById("player");
const playButton = document.getElementById("playButton");
const submitButton = document.getElementById("submitButton");
const skipButton = document.getElementById("skipButton");
const shuffleButton = document.getElementById("shuffleButton");

const songInfo = document.getElementById("songInfo");
const title = document.getElementById("title");
const artistElement = document.getElementById("artist");

const artistGuess = document.getElementById("artistGuess");
const songGuess = document.getElementById("songGuess");
const autocompleteArtistList = document.getElementById("autocompleteArtistList");
const autocompleteSongList = document.getElementById("autocompleteSongList");

const trySegments = [1, 2, 5, 5, 5, 100]; // Seconds for each try

init();

async function init() {
    const response = await fetch("data/songs.json");
    songs = await response.json();

    currentId = new URLSearchParams(window.location.search).get("id");
    if (!currentId || !songs[currentId]) {
        currentId = getRandomSongId();
    }

    loadSong(currentId);

    playButton.onclick = () => playCurrentTry();
    submitButton.onclick = submitGuess;
    skipButton.onclick = moveToNextTry;
    shuffleButton.onclick = shuffleSong;

    // Initialize autocomplete
    artistGuess.addEventListener("input", () => {
        handleAutocomplete(artistGuess, autocompleteArtistList, "artist");
    });

    songGuess.addEventListener("input", () => {
        handleAutocomplete(songGuess, autocompleteSongList, "song");
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        if (e.target !== artistGuess) autocompleteArtistList.innerHTML = "";
        if (e.target !== songGuess) autocompleteSongList.innerHTML = "";
    });
}

function loadSong(id) {
    const song = songs[id];
    currentId = id;
    currentTry = 1;

    hideReveal();
    player.pause();
    player.src = "audio/" + song.file;
    player.load();

    // Clear previous guesses and results
    for (let i = 1; i <= totalTries; i++) {
        document.getElementById(`progress${i}`).value = 0;
        document.getElementById(`guessResult${i}`).textContent = "";
        document.getElementById(`guessResult${i}`).className = "guessResult";
    }

    artistGuess.value = "";
    songGuess.value = "";

    history.replaceState({}, "", `heardle.html?id=${id}`);
}

function playCurrentTry() {
    if (currentTry > totalTries) {
        revealSong();
        return;
    }

    const song = songs[currentId];
    const startTime = trySegments.slice(0, currentTry - 1).reduce((a, b) => a + b, 0);
    const endTime = startTime + trySegments[currentTry - 1];

    player.currentTime = startTime;
    player.play().catch(error => {
        console.log("Autoplay prevented: ", error);
    });

    const progressBar = document.getElementById(`progress${currentTry}`);
    progressBar.value = 0;
    progressBar.max = trySegments[currentTry - 1];

    const updateProgress = () => {
        if (player.currentTime >= endTime) {
            player.pause();
            progressBar.value = progressBar.max;
            player.removeEventListener("timeupdate", updateProgress);
        } else {
            progressBar.value = player.currentTime - startTime;
        }
    };

    player.addEventListener("timeupdate", updateProgress);
}

function submitGuess() {
    if (currentTry > totalTries) return;

    const song = songs[currentId];
    const guessedArtist = artistGuess.value.trim();
    const guessedSong = songGuess.value.trim();
    const correctArtist = song.artist;
    const correctSong = song.song;

    let artistCorrect = guessedArtist.toLowerCase() === correctArtist.toLowerCase();
    let songCorrect = guessedSong.toLowerCase() === correctSong.toLowerCase();

    let resultText = `${guessedArtist} - ${guessedSong}`;
    let resultClass = "wrong";

    if (artistCorrect && songCorrect) {

        resultClass = "correct";
        revealSong();

        player.currentTime = 0;
        player.play().catch(error => {
            console.log("Autoplay prevented: ", error);
        });
    } else if (artistCorrect || songCorrect) {
        resultClass = "partial";
    }
    
     document.getElementById(`guessResult${currentTry}`).textContent = resultText;
     document.getElementById(`guessResult${currentTry}`).className = `guessResult ${resultClass}`;

    // Clear input fields
    artistGuess.value = "";
    songGuess.value = "";

    // Auto-skip to the next try
    if (resultClass !== "correct") {
        moveToNextTry();
    }
}

function moveToNextTry() {
    if (currentTry < totalTries) {
        currentTry++;
        playCurrentTry();
    } else {
        revealSong();
    }
}

function revealSong() {
    const song = songs[currentId];
    title.textContent = "Song: " + song.song;
    artistElement.textContent = "Artist: " + song.artist;
    songInfo.style.display = "block";
}

function shuffleSong() {
    let randomId;
    do {
        randomId = getRandomSongId();
    } while (randomId === currentId && Object.keys(songs).length > 1);

    loadSong(randomId);
}

function getRandomSongId() {
    const ids = Object.keys(songs);
    return ids[Math.floor(Math.random() * ids.length)];
}

function handleAutocomplete(inputElement, autocompleteList, field) {
    const input = inputElement.value.toLowerCase();
    autocompleteList.innerHTML = "";

    if (input.length < 2) return;

    const uniqueValues = [...new Set(
        Object.values(songs).map(song => song[field])
    )].sort();

    const matches = uniqueValues.filter(value =>
        value.toLowerCase().includes(input)
    );

    matches.forEach(match => {
        const item = document.createElement("div");
        item.textContent = match;
        item.addEventListener("click", () => {
            inputElement.value = match;
            autocompleteList.innerHTML = "";
        });
        autocompleteList.appendChild(item);
    });
}

function hideReveal() {
    songInfo.style.display = "none";
}