function initializeDecadeButtons() {


    document.querySelectorAll(".decadeButton")
    .forEach(button => {


        button.addEventListener("click", async ()=>{

            const decade = button.dataset.decade;


            await loadSongs(decade);


            updateDecadeButtons();


            shuffleSong();


        });


    });


    updateDecadeButtons();

}



function updateDecadeButtons(){


    document.querySelectorAll(".decadeButton")
    .forEach(button=>{


        button.classList.toggle(
            "active",
            button.dataset.decade === currentDecade
        );


    });


}