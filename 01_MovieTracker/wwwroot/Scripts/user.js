const loggedInUser = localStorage.getItem("userName");
if (loggedInUser == null) {
    alert("Access is denied!");
    window.location.href = "home.html";
} else {
    document.getElementById("userNameDisplay").innerText = loggedInUser;
}

const API_URL_MOVIES = "http://localhost:5160/api/movies";
const container = document.getElementById("moviesGrid");
const btnWatchlist = document.getElementById("btnWatchlist");
const btnWatched = document.getElementById("btnWatched");
const btnLogout = document.getElementById("btnLogout");
let allMovies = [];
let isWatchedTab = false;

async function loadMovies(){
    try{
        const response = await fetch(API_URL_MOVIES);
        allMovies = await response.json();

        renderMovies();
    } catch(error){
        console.error("Error loading movies:", error);
    }
}

function renderMovies(){
    container.innerHTML = "";
    const filteredMovies = allMovies.filter(movie => movie.isWatched === isWatchedTab);

    filteredMovies.forEach(movie => {
        let watchedStatus = "👁️ Mark as Watched";
        if (movie.isWatched === true) {
            watchedStatus = "Watched ✔️";
        }

        const cardWrapper = document.createElement("div");
        cardWrapper.className = "movie-card";

        const cardPoster = document.createElement("div");
        cardPoster.className = "card-poster"
        cardPoster.innerHTML = `<span class="poster-placeholder">POZA</span>`;

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info"
        cardInfo.innerHTML = `
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-year">${movie.releaseYear}</span>
            <p class="movie-genre">${movie.genre}</p>
            <p class="movie-rating">${movie.rating}</p>
            <button class="btn-mark-watched" onclick="markWatched(${movie.id})">${watchedStatus}</button>
        `;

        cardWrapper.appendChild(cardPoster);
        cardWrapper.appendChild(cardInfo);
        container.appendChild(cardWrapper);
        });
}

btnWatchlist.addEventListener("click", function() {
    isWatchedTab = false;
    btnWatchlist.classList.add("active");
    btnWatched.classList.remove("active");
    renderMovies();
})

btnWatched.addEventListener("click", function() {
    isWatchedTab = true;
    btnWatched.classList.add("active");
    btnWatchlist.classList.remove("active");
    renderMovies();
})

btnLogout.addEventListener("click", function(){
    localStorage.clear();
    window.location.href = "home.html";
    alert("Logged out successfully!");
})

async function markWatched(id){
    const movieToUpdate = allMovies.find(movie => movie.id === id);
    if(!movieToUpdate){
        console.error("The movie was not find to edit!");
        return;
    }

    const updatedMovie = {
        id: movieToUpdate.id,
        title: movieToUpdate.title,
        genre: movieToUpdate.genre,
        releaseYear: movieToUpdate.releaseYear,
        rating: movieToUpdate.rating,
        isWatched: !movieToUpdate.isWatched
    }

    try{
        const response = await fetch(`${API_URL_MOVIES}/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedMovie)    
        });

        if(response.ok){
            loadMovies();
        } else {
            alert("There is a problem updating movie's status!");
        }
    } catch(error){
        console.error("Error:", error);
    }
}

loadMovies();