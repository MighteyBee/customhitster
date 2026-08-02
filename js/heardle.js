let currentId = null;
let currentTry = 1;

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


const trySegments = [1,2,5,5,5,22];


init();



async function init(){


    await loadSongs();


    initializeDecadeButtons();


    currentId =
    new URLSearchParams(window.location.search)
    .get("id");


    if(!currentId || !getSongs()[currentId]){

        currentId = getRandomSongId();

    }


    loadSong(currentId);



    playButton.onclick = playCurrentTry;
    submitButton.onclick = submitGuess;
    skipButton.onclick = moveToNextTry;
    shuffleButton.onclick = shuffleSong;



    artistGuess.addEventListener(
        "input",
        ()=>handleAutocomplete(
            artistGuess,
            autocompleteArtistList,
            "artist"
        )
    );


    songGuess.addEventListener(
        "input",
        ()=>handleAutocomplete(
            songGuess,
            autocompleteSongList,
            "song"
        )
    );

}




function loadSong(id){


    const song = getSongs()[id];


    if(!song){
        console.error("Song not found:", id);
        return;
    }


    currentId = id;
    currentTry = 1;


    hideReveal();


    player.pause();


    player.src =
    "audio/" + song.file;


    player.load();



    for(let i=1;i<=totalTries;i++){

        document.getElementById(`progress${i}`).value=0;

        document.getElementById(`guessResult${i}`).textContent="";

    }


    artistGuess.value="";
    songGuess.value="";


    history.replaceState(
        {},
        "",
        `heardle.html?id=${id}`
    );

}




function playCurrentTry(){


    const song=getSongs()[currentId];


    const start =
    trySegments
    .slice(0,currentTry-1)
    .reduce((a,b)=>a+b,0);


    const end =
    start + trySegments[currentTry-1];


    player.currentTime=start;


    player.play();



    const bar =
    document.getElementById(
        `progress${currentTry}`
    );


    const update=()=>{


        if(player.currentTime>=end){

            player.pause();

            player.removeEventListener(
                "timeupdate",
                update
            );

        }


        bar.value =
        player.currentTime-start;


    };


    player.addEventListener(
        "timeupdate",
        update
    );

}





function shuffleSong(){


    const id=getRandomSongId();

    loadSong(id);

}





function moveToNextTry(){


    if(currentTry < totalTries){

        currentTry++;

    }

}





function submitGuess(){


    const song=getSongs()[currentId];


    const artistCorrect =
    artistGuess.value.trim().toLowerCase()
    ===
    song.artist.toLowerCase();



    const titleCorrect =
    songGuess.value.trim().toLowerCase()
    ===
    song.song.toLowerCase();



    if(artistCorrect && titleCorrect){

        revealSong();

    }


}





function revealSong(){


    const song=getSongs()[currentId];


    title.textContent=
    "Song: "+song.song;


    artistElement.textContent=
    "Artist: "+song.artist;


    songInfo.style.display="block";

}





function hideReveal(){

    songInfo.style.display="none";

}





function handleAutocomplete(input,list,field){


    const value=input.value.toLowerCase();


    list.innerHTML="";


    if(value.length<2)
        return;



    const matches=[
        ...new Set(
            Object.values(getSongs())
            .map(song=>song[field])
        )
    ]
    .filter(x=>x.toLowerCase().includes(value));



    matches.forEach(match=>{


        const div=document.createElement("div");

        div.textContent=match;


        div.onclick=()=>{

            input.value=match;

            list.innerHTML="";

        };


        list.appendChild(div);


    });

}