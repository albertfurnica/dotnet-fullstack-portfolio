localStorage.clear();

const API_URL_MOVIES = "http://localhost:5160/api/movies";

async function loadRandomMovies(){
    try{
        const response = await fetch(API_URL_MOVIES);
        const allMovies = await response.json();
        const shuffledMovies = allMovies.sort(() => 0.5 - Math.random());
        const selectedMovies = shuffledMovies.slice(0, 5);

        renderPreviewMovies(selectedMovies);
    } catch(error){
        console.error("Error while randomizing movies : ", error);
    }
}

function renderPreviewMovies(movies){
    const container = document.getElementById("randomMoviesGrid");
    container.html = "";

    movies.forEach(m => {
        const card = document.createElement("div");
        card.className = "preview-card";

        const imageSrc = m.posterUrl ? m.posterUrl : "Photos/home_logo.jfif";

        card.innerHTML = `
            <div class="preview-poster">
                <img src="${imageSrc}" alt="${m.title}">
            </div>
            <h3 classs="preview-title">${m.title}</h3>
        `;

        container.appendChild(card);
    })
}

loadRandomMovies();