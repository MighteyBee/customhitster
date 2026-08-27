//////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////


let currentId = null;
let score = 0;
let pointsAwarded = false;

let selectedDecade = "all";
let gameMode = "6";
let currentRound = 1;
let totalRounds = 6;
let multiplier = 1.1;

const multiplierElement =
    document.getElementById("multiplier");
const scoreElement = document.getElementById("score");
const modeSelect =
    document.getElementById("modeSelect");

const decadeSelect =
    document.getElementById("decadeSelect");
const currentRoundElement =
    document.getElementById("currentRound");

const totalRoundsElement =
    document.getElementById("totalRounds");


const backButton = document.getElementById("backButton");
const player = document.getElementById("player");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");

const revealButton = document.getElementById("revealButton");
const shuffleButton = document.getElementById("shuffleButton");

const songInfo = document.getElementById("songInfo");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const year = document.getElementById("year");
const progress = document.getElementById("progress");

const artistGuess = document.getElementById("artistGuess");
const songGuess = document.getElementById("songGuess");

const autocompleteArtistList = document.getElementById("autocompleteArtistList");
const autocompleteSongList = document.getElementById("autocompleteSongList");

//////////////////////////////////////////////////////
// Initialization
//////////////////////////////////////////////////////

init();

async function init() {
    // Load default songs (all)
    await loadSongs("all");

   
    currentId = new URLSearchParams(window.location.search).get("id");

    // If no ID was provided, choose a random song
   if (!currentId || !getSongs()[currentId]) {
    currentId = getRandomSongId();
}

    loadSong(currentId);

    revealButton.addEventListener("click", revealSong);
    shuffleButton.addEventListener("click", shuffleSong);

    playButton.onclick = () => player.play();
    pauseButton.onclick = () => player.pause();

    backButton.onclick = () => {
    window.location.href = "index.html";
    };


modeSelect.addEventListener("change", () => {

    gameMode = modeSelect.value;

    startNewGame();

 

});
}

async function startNewGame() {

    // Reset round
    currentRound = 1;

    // Reset score
    score = 0;
    scoreElement.textContent = score;
    pointsAwarded = false;
    // Set number of rounds
    if (gameMode === "endless") {
        totalRounds = Infinity;
    } else {
        totalRounds = Number(gameMode);
    }
    await loadSongs(selectedDecade);
    // Update UI
    updateRoundDisplay();

    // Get a random song from the selected decade
    loadSong(getRandomSongId());
}
////////////////////////////////////////////////////////
// Load Song
//////////////////////////////////////////////////////

function loadSong(id){

       const song = getSongs()[id];


    if(!song){
        console.error("Song not found:", id);
        return;
    }


    currentId = id;

    pointsAwarded = false;
    hideReveal();

    artistGuess.value="";
    songGuess.value="";


    player.pause();

    player.src="audio/"+song.file;

    player.load();


    history.replaceState(
        {},
        "",
        `player.html?id=${id}`
    );

}

player.ontimeupdate = () => {
    if (player.duration) {
        progress.value = (player.currentTime / player.duration) * 100;
    }
};

// Add event listeners for both inputs
artistGuess.addEventListener("input", function() {
    handleAutocomplete(this, autocompleteArtistList, "artist");
});

songGuess.addEventListener("input", function() {
    handleAutocomplete(this, autocompleteSongList, "song");
});

// Close dropdowns when clicking outside
document.addEventListener("click", function(e) {
    if (e.target !== artistGuess) {
        autocompleteArtistList.innerHTML = "";
    }
    if (e.target !== songGuess) {
        autocompleteSongList.innerHTML = "";
    }
});

// Generic autocomplete handler
function handleAutocomplete(inputElement, autocompleteList, field) {
    const input = inputElement.value.toLowerCase();
    autocompleteList.innerHTML = "";

    if (input.length < 2) {
        return; // Only show suggestions after 2 characters
    }

    const uniqueValues = [...new Set(
        Object.values(getSongs()).map(song => song[field])
    )].sort();

    const matches = uniqueValues.filter(value =>
        value.toLowerCase().includes(input)
    );

    matches.forEach(match => {
        const item = document.createElement("div");
        item.textContent = match;
        item.addEventListener("click", function() {
            inputElement.value = match;
            autocompleteList.innerHTML = "";
        });
        autocompleteList.appendChild(item);
    });
}

////////////////////////////////////////////////////////
// Reveal Song
//////////////////////////////////////////////////////

function revealSong() {

 if (pointsAwarded) {
    return;
}

pointsAwarded = true;

    const song = getSongs()[currentId];
    const guessedArtist = artistGuess.value.trim().toLowerCase();
    const guessedSong = songGuess.value.trim().toLowerCase();
    const correctArtist = song.artist.toLowerCase();
    const correctSong = song.song.toLowerCase();

  //////////////////////////////////////////////
    // Calculate points
    //////////////////////////////////////////////
let basePoints = 0;

if (guessedArtist === correctArtist) {
    basePoints += 10;
}

if (guessedSong === correctSong) {
    basePoints += 10;
}

const multiplier = getMultiplier();

const pointsEarned = Math.round(basePoints * multiplier);


    //////////////////////////////////////////////
    // Local score
    //////////////////////////////////////////////

    score += pointsEarned;

    scoreElement.textContent = score;


    //////////////////////////////////////////////
    // Save points to Supabase
    //////////////////////////////////////////////

   if (pointsEarned > 0) {
        updatePoints(score).then(success => {
            if (!success) {
                console.error("Failed to update points in Supabase.");
            }
        });
    }
   
    // Display the correct answer
    title.textContent = "Song: " + song.song;
    artist.textContent = "Artist: " + song.artist;
    songInfo.style.display = "block";
}

function getMultiplier() {

    if (gameMode === "6") {
        return 1.1;
    }

    if (gameMode === "10") {
        return 2;
    }

    if (gameMode === "15") {
        return 2.5;
    }

    if (gameMode === "endless") {
        return 1.1 + ((currentRound - 1) * 0.1);
    }

    return 1;
}

////////////////////////////////////////////////////////
// Hide Reveal
//////////////////////////////////////////////////////

function hideReveal() {
    songInfo.style.display = "none";
}

////////////////////////////////////////////////////////
// Shuffle Song
//////////////////////////////////////////////////////

function shuffleSong() {
  if (!pointsAwarded) {
        return;
    }

    currentRound++;

    if (
        gameMode !== "endless" &&
        currentRound > totalRounds
    ) {
        endGame();
        return;
    }

    let randomId;

    do {
        randomId = getRandomSongId();

    } while (
        randomId === currentId &&
        Object.keys(getSongs()).length > 1
    );

    loadSong(randomId);

    updateRoundDisplay();
}

////////////////////////////////////////////////////////
// Random Song
//////////////////////////////////////////////////////

function getRandomSongId() {

    const ids = Object.keys(getSongs());

if (selectedDecade !== "all") {

        availableIds = availableIds.filter(id => {

            return songs[id].decade === selectedDecade;

        });

    }

    return ids[Math.floor(Math.random() * ids.length)];

}



function updateRoundDisplay() {

     currentRoundElement.textContent =
        currentRound;

    if (gameMode === "endless") {

        totalRoundsElement.textContent = "∞";

    } else {

        totalRoundsElement.textContent =
            totalRounds;

    }

    multiplierElement.textContent =
        getMultiplier().toFixed(1);
}

function endGame() {

    player.pause();

    revealButton.disabled = true;
    shuffleButton.disabled = true;

    alert(
        "Game Over!\n\n" +
        "Final Score: " + score
    );
}