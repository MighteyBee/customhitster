
//////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////

let songs = {};
let currentId = null;

const player = document.getElementById("player");

const revealButton = document.getElementById("revealButton");
const shuffleButton = document.getElementById("shuffleButton");

const songInfo = document.getElementById("songInfo");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const year = document.getElementById("year");
const progress = document.getElementById("progress");

const artistGuess = document.getElementById("artistGuess");
const artistList = document.getElementById("artistList");

//////////////////////////////////////////////////////
// Initialization
//////////////////////////////////////////////////////

init();

async function init() {

    const response = await fetch("data/songs.json");

    songs = await response.json();

    populateArtistList();

    currentId = new URLSearchParams(window.location.search).get("id");

    // If no ID was provided, choose a random song
    if (!currentId || !songs[currentId]) {
        currentId = getRandomSongId();
    }

    loadSong(currentId);

    revealButton.addEventListener("click", revealSong);
    shuffleButton.addEventListener("click", shuffleSong);

}

//////////////////////////////////////////////////////
// Load Song
//////////////////////////////////////////////////////

function loadSong(id) {

    const song = songs[id];

    currentId = id;

    hideReveal();

    artistGuess.value = "";

    player.pause();

    player.src = "audio/" + song.file;

    player.load();

    // Update URL without reloading the page
    history.replaceState({}, "", "player.html?id=" + id);


}

playButton.onclick = () => player.play();

pauseButton.onclick = () => player.pause();

player.ontimeupdate = () => {

    if(player.duration){

        progress.value =
            (player.currentTime / player.duration) * 100;

    }

};

function populateArtistList() {

    artistList.innerHTML = "";

    const uniqueArtists = [...new Set(
        Object.values(songs).map(song => song.artist)
    )].sort();

    uniqueArtists.forEach(name => {

        const option = document.createElement("option");

        option.value = name;

        artistList.appendChild(option);

    });

}

//////////////////////////////////////////////////////
// Reveal Song
//////////////////////////////////////////////////////

function revealSong() {

    const song = songs[currentId];

    title.textContent = song.file;
    artist.textContent = "Artist: " + song.artist;
    year.textContent = "Year: " + song.year;

    songInfo.style.display = "block";

}

//////////////////////////////////////////////////////
// Hide Reveal
//////////////////////////////////////////////////////

function hideReveal() {

    songInfo.style.display = "none";

}

//////////////////////////////////////////////////////
// Shuffle Song
//////////////////////////////////////////////////////

function shuffleSong() {

    let randomId;

    do {

        randomId = getRandomSongId();

    } while (randomId === currentId && Object.keys(songs).length > 1);

    loadSong(randomId);

}

//////////////////////////////////////////////////////
// Random Song
//////////////////////////////////////////////////////

function getRandomSongId() {

    const ids = Object.keys(songs);

    return ids[Math.floor(Math.random() * ids.length)];

}
