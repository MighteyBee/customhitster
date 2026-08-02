let songs = {};
let currentDecade = "all";


async function loadSongs(decade = currentDecade) {

    currentDecade = decade;

    let file = "data/songs.json";

    if (decade !== "all") {
        file = `data/songs${decade}.json`;
    }

    const response = await fetch(file);

    songs = await response.json();

    return songs;
}


function getSongs() {
    return songs;
}


function getCurrentDecade() {
    return currentDecade;
}


function getRandomSongId() {

    const ids = Object.keys(songs);

    return ids[Math.floor(Math.random() * ids.length)];

}


function getRandomSong() {

    const id = getRandomSongId();

    return {
        id:id,
        song:songs[id]
    };

}