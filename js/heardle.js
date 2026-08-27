let currentUpdateFunction = null;
let currentId = null;
let currentTry = 1;
let gameOver = false;
let score = 0;

const totalTries = 6;

const player = document.getElementById("player");

const playButton = document.getElementById("playButton");
const submitButton = document.getElementById("submitButton");
const skipButton = document.getElementById("skipButton");
const shuffleButton = document.getElementById("shuffleButton");
const backButton = document.getElementById("backButton");

const songInfo = document.getElementById("songInfo");
const title = document.getElementById("title");
const artistElement = document.getElementById("artist");

const artistGuess = document.getElementById("artistGuess");
const songGuess = document.getElementById("songGuess");

const autocompleteArtistList = document.getElementById("autocompleteArtistList");
const autocompleteSongList = document.getElementById("autocompleteSongList");

// Updated trySegments to cumulative durations
const trySegments = [1, 3, 6, 11, 16, 25]; // 1s, 1+2=3s, 3+3=6s, 6+5=11s, 11+5=16s, 16+9=25s
// Multipliers for each attempt
const tryMultipliers = [3, 2.5, 2, 1.5, 1, 1]; // Multipliers for attempts 1-6

init();

async function init() {
    await loadSongs();
    initializeDecadeButtons();
    await loadProfile(); // Load the user's profile and points

    currentId = new URLSearchParams(window.location.search).get("id");
    if (!currentId || !getSongs()[currentId]) {
        currentId = getRandomSongId();
    }

    loadSong(currentId);

    playButton.onclick = playCurrentTry;
    submitButton.onclick = submitGuess;
    skipButton.onclick = moveToNextTry;
    shuffleButton.onclick = shuffleSong;
    backButton.onclick = () => { window.location.href = "index.html"; };

    artistGuess.addEventListener("input", () => handleAutocomplete(artistGuess, autocompleteArtistList, "artist"));
    songGuess.addEventListener("input", () => handleAutocomplete(songGuess, autocompleteSongList, "song"));
}

function loadSong(id) {
    const song = getSongs()[id];
    if (!song) {
        console.error("Song not found:", id);
        return;
    }

    currentId = id;
    currentTry = 1;
    gameOver = false;

    submitButton.disabled = false;
    skipButton.disabled = false;

    hideReveal();

    player.pause();
    player.currentTime = 0;
    player.src = "audio/" + song.file;
    player.load();

    for (let i = 1; i <= totalTries; i++) {
        document.getElementById(`progress${i}`).value = 0;
        const result = document.getElementById(`guessResult${i}`);
        result.textContent = "";
        result.className = "guessResult";
    }

    artistGuess.value = "";
    songGuess.value = "";

    history.replaceState({}, "", `heardle.html?id=${id}`);
}

function playCurrentTry() {
    if (gameOver) {
        player.currentTime = 0;
        player.play();
        return;
    }

    const song = getSongs()[currentId];
    const end = trySegments[currentTry - 1]; // Use cumulative duration

    player.currentTime = 0; // Reset to the start of the song
    player.play();

    const bar = document.getElementById(`progress${currentTry}`);
    bar.max = end; // Set max to cumulative duration

    if (currentUpdateFunction) {
        player.removeEventListener("timeupdate", currentUpdateFunction);
    }

    currentUpdateFunction = () => {
        if (player.currentTime >= end) {
            player.pause();
            player.removeEventListener("timeupdate", currentUpdateFunction);
        }
        bar.value = player.currentTime;
    };

    player.addEventListener("timeupdate", currentUpdateFunction);
}

function shuffleSong() {
    const id = getRandomSongId();
    loadSong(id);
}

function moveToNextTry() {
    if (gameOver) {
        return;
    }

    player.pause();

    if (currentTry < totalTries) {
        currentTry++;
        playCurrentTry();
    } else {
        revealSong();
    }
}

async function submitGuess() {
    if (gameOver) {
        return;
    }

    const song = getSongs()[currentId];
    const guessedArtist = artistGuess.value.trim();
    const guessedSong = songGuess.value.trim();

    // Don't submit empty guesses
    if (guessedArtist === "" && guessedSong === "") {
        return;
    }

    const artistCorrect = guessedArtist.toLowerCase() === song.artist.toLowerCase();
    const titleCorrect = guessedSong.toLowerCase() === song.song.toLowerCase();

    let resultClass = "wrong";
    let pointsEarned = 0;

    if (artistCorrect && titleCorrect) {
        resultClass = "correct";
        pointsEarned = 20; // 10 for artist + 10 for song
    } else if (artistCorrect || titleCorrect) {
        resultClass = "partial";
        pointsEarned = 10; // 10 for artist or song
    }

    // Apply multiplier based on the current attempt
    const multiplier = tryMultipliers[currentTry - 1];
    const totalPointsEarned = Math.round(pointsEarned * multiplier);

    const result = document.getElementById(`guessResult${currentTry}`);
    result.textContent = `${guessedArtist} - ${guessedSong}`;
    result.className = `guessResult ${resultClass}`;

    artistGuess.value = "";
    songGuess.value = "";

    if (resultClass === "correct" || resultClass === "partial") {
        // Update local score
        score += totalPointsEarned;

        // Update Supabase points
        await updatePoints(score);

        // Update the UI to reflect the new score
        const pointsElements = document.querySelectorAll(".profilePoints");
        pointsElements.forEach(element => {
            element.textContent = score;
        });
    }

    if (resultClass === "correct") {
        gameOver = true;
        revealSong();
        submitButton.disabled = true;
        skipButton.disabled = true;
        player.pause();
        player.currentTime = 0;
        player.play();
        return;
    }

    moveToNextTry();
}

function revealSong() {
    const song = getSongs()[currentId];
    title.textContent = "Song: " + song.song;
    artistElement.textContent = "Artist: " + song.artist;
    songInfo.style.display = "block";
}

function hideReveal() {
    songInfo.style.display = "none";
}

function handleAutocomplete(input, list, field) {
    const value = input.value.toLowerCase();
    list.innerHTML = "";

    if (value.length < 2) return;

    const matches = [...new Set(Object.values(getSongs()).map(song => song[field]))]
        .filter(x => x.toLowerCase().includes(value));

    matches.forEach(match => {
        const div = document.createElement("div");
        div.textContent = match;
        div.onclick = () => {
            input.value = match;
            list.innerHTML = "";
        };
        list.appendChild(div);
    });
}