const loggedInUser = localStorage.getItem("userName");
if (loggedInUser == null) {
    alert("Access is denied!");
    window.location.href = "home.html";
} else {
    document.getElementById("userNameDisplay").innerText = loggedInUser;
}

const API_URL_BASE = "https://albert-movietracker-api-h7g4dwc7ekgehefq.polandcentral-01.azurewebsites.net/api/movies";
const container = document.getElementById("moviesGrid");
const btnWatchlist = document.getElementById("btnWatchlist");
const btnWatched = document.getElementById("btnWatched");
const btnLogout = document.getElementById("btnLogout");
const headerMain = document.getElementById("headerMain");
const searchInput = document.getElementById("searchInput");
const sortDropdown = document.getElementById("sortMovies");
let allLocalMovies = [];
let isExploreMode = true;
let searchTimeout = null;

btnExplore.addEventListener("click", function() {
    isExploreMode = true;
    btnExplore.classList.add("active");
    btnWatched.classList.remove("active");
    searchInput.value = "";
    loadTmdbPopular();
})

btnWatched.addEventListener("click", function() {
    isExploreMode = false;
    btnWatched.classList.add("active");
    btnExplore.classList.remove("active");
    searchInput.value = "";
    loadLocalMovies();
})

async function loadLocalMovies(){
    try{
        const response = await fetch(API_URL_BASE);
        allLocalMovies = await response.json();

        renderLocalMovies(allLocalMovies);
    } catch(error){
        console.error("Error loading movies:", error);
    }
}

function renderLocalMovies(movies){
    container.innerHTML = "";
    filteredMovies = sortMoviesArray(movies, sortDropdown.value);

    filteredMovies.forEach(movie => {
        const imageSrc = movie.posterUrl ? movie.posterUrl : "Photos/home_logo.jfif";
        cardPoster.innerHTML = `<img src="${imageSrc}" alt="Poster ${movie.title}" class="poster-img">`;

        const cardWrapper = document.createElement("div");
        cardWrapper.className = "movie-card";

        const cardPoster = document.createElement("div");
        cardPoster.className = "card-poster";

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info";
        cardInfo.innerHTML = `
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-year">${movie.releaseYear}</span>
            <p class="movie-genre">${movie.genre}</p>
            <p class="movie-rating">${movie.rating}/100</p>
            <button class="btn-mark-watched" onclick="markWatched(${movie.id})">${watchedStatus}</button>
        `;

        cardWrapper.appendChild(cardPoster);
        cardWrapper.appendChild(cardInfo);
        container.appendChild(cardWrapper);
        });
}

async function loadTmdbPopular(){
    try{
        const response = await fetch(`${API_URL_BASE}/tmdb/popular`);
        const data = await response.json();
        renderTmdbMovies(data.results);
    } catch (error) {
        console.error("Erroar loading TMDB popular: ", error);
    }
}

function renderTmdbMovies(tmdbMovies){
    container.innerHTML = "";

    tmdbMovies.forEach(movie => {
        const movieDataString = encodeURIComponent(JSON.stringify(movie));

        const imageSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "Photos/home_logo.jfif";
        cardPoster.innerHTML = `<img src="${imageSrc}" alt="Poster ${movie.title}" class="poster-img">`;

        const cardWrapper = document.createElement("div");
        cardWrapper.className = "movie-card";

        const cardPoster = document.createElement("div");
        cardPoster.className = "card-poster";

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info";
        cardInfo.innerHTML = `
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-year">${movie.releaseYear}</span>
            <p class="movie-genre">${movie.genre}</p>
            <p class="movie-rating">${movie.rating}/100</p>
            <button class="btn-mark-watched" onclick="saveToLocalDb('${movieDataString}')">➕ Add to My Films</button>
        `;

        cardWrapper.appendChild(cardPoster);
        cardWrapper.appendChild(cardInfo);
        container.appendChild(cardWrapper);
    });
}

async function saveToLocalDb(encodedData){
    const tmdbMovie = JSON.parse(decodeURIComponent(encodedData));

    const newMovie = {
        title: tmdbMovie.title,
        genre: "General",
        releaseYear: tmdbMovie.releaseYear,
        rating: tmdbMovie.rating,
        isWatched: true,
        posterUrl: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : ""
    }

    await fetch(API_URL_BASE, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newMovie)
    });
    alert(`"${newMovie.title}" was logged to your database!`);
}

searchInput.addEventListener("input", function(){
    const query = searchInput.value.toLowerCase();

    if (isExploreMode) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            if (query.length < 2) {
                if(query.length === 0) loadTmdbPopular();
                return; 
            }
            const response = await fetch(`${API_URL_BASE}/tmdb/search/${query}`);
            const data = await response.json();
            renderTmdbMovies(data.results);
        }, 500);
    } else {
        const movieCards = document.querySelectorAll(".movie-card");
        movieCards.forEach(card => {
            const titleElement = card.querySelector(".movie-title");
            card.style.display = titleElement.innerText.toLowerCase().includes(query) ? "flex" : "none";
        });
    }
});

sortDropdown.addEventListener("change", function(){
    if(!isExploreMode) renderLocalMovies(allLocalMovies);
});

function sortMoviesArray(moviesArray, sortType) {
    return moviesArray.sort((a, b) => {
        switch(sortType){
            case "title-asc":
                return a.title.localeCompare(b.title);
            case "title-desc":
                return b.title.localeCompare(a.title);
            case "year-desc":
                return b.releaseYear - a.releaseYear;
            case "year-asc":
                return a.releaseYear - b.releaseYear;
            case "rating-desc":
                return (b.rating || 0) - (a.rating || 0);
            case "rating-asc":
                return (a.rating || 0) - (b.rating || 0);
            default:
                return 0;
        }
    });
}

btnLogout.addEventListener("click", function(){
    localStorage.clear();
    window.location.href = "home.html";
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
        isWatched: !movieToUpdate.isWatched,
        posterUrl: movieToUpdate.posterUrl
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

loadTmdbPopular();