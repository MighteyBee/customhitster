//////////////////////////////////////////////////////
// Current decade
//////////////////////////////////////////////////////

let currentDecade = "all";

//////////////////////////////////////////////////////
// Load Songs
//////////////////////////////////////////////////////

async function loadSongs(decade = currentDecade) {

    currentDecade = decade;

    let filePath = "data/songs.json";

    if (currentDecade !== "all") {

        filePath = `data/songs${currentDecade}.json`;

    }

    const response = await fetch(filePath);

    return await response.json();

}

//////////////////////////////////////////////////////
// Change Decade
//////////////////////////////////////////////////////

async function changeDecade(decade) {

    currentDecade = decade;

    updateDecadeButtons();

    songs = await loadSongs(currentDecade);

    shuffleSong();

}

//////////////////////////////////////////////////////
// Button Highlight
//////////////////////////////////////////////////////

function updateDecadeButtons() {

    document.querySelectorAll(".decadeButton").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.decade === currentDecade
        );

    });

}

//////////////////////////////////////////////////////
// Setup Buttons
//////////////////////////////////////////////////////

function initializeDecadeButtons() {

    updateDecadeButtons();

    document.querySelectorAll(".decadeButton").forEach(button => {

        button.addEventListener("click", () => {

            changeDecade(button.dataset.decade);

        });

    });

}