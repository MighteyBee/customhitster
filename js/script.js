//////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////


let currentId = null;
let score = 0;


const scoreElement = document.getElementById("score");

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

    initializeDecadeButtons();
      updateDecadeButtons();
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
    const song = getSongs()[currentId];
    const guessedArtist = artistGuess.value.trim().toLowerCase();
    const guessedSong = songGuess.value.trim().toLowerCase();
    const correctArtist = song.artist.toLowerCase();
    const correctSong = song.song.toLowerCase();

    // Check guesses and update score
    let pointsEarned = 0;
    if (guessedArtist === correctArtist) {
        pointsEarned += 10;
    }
    if (guessedSong === correctSong) {
        pointsEarned += 10;
    }

    score += pointsEarned;
    scoreElement.textContent = score;

    // Display the correct answer
    title.textContent = "Song: " + song.song;
    artist.textContent = "Artist: " + song.artist;
    songInfo.style.display = "block";
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
    let randomId;
    do {
        randomId = getRandomSongId();
    } while (randomId === currentId && Object.keys(getSongs()).length > 1);

    loadSong(randomId);
    artistGuess.value = "";
    songGuess.value = "";
}

////////////////////////////////////////////////////////
// Random Song
//////////////////////////////////////////////////////

function getRandomSongId() {

    const ids = Object.keys(getSongs());

    return ids[Math.floor(Math.random() * ids.length)];

}