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

const tmdbGenreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

function getGenreNames(genreIds) {
    if (!genreIds || genreIds.length === 0) return "General";
    return genreIds.map(id => tmdbGenreMap[id]).filter(Boolean).slice(0, 2).join(", ");
}

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
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "movie-card";

        const cardPoster = document.createElement("div");
        cardPoster.className = "card-poster";

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info";

        const imageSrc = movie.posterUrl ? movie.posterUrl : "Photos/home_logo.jfif";
        cardPoster.innerHTML = `<img src="${imageSrc}" alt="Poster ${movie.title}" class="poster-img">`;

        cardInfo.innerHTML = `
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-year">${movie.releaseYear}</span>
            <p class="movie-genre">${movie.genre}</p>
            <p class="movie-rating">${movie.rating}/100</p>
            <button class="btn-mark-watched" onclick="deleteLocalMovie(${movie.id})" style="background: #e74c3c;">❌ Remove Film</button>
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

        const cardWrapper = document.createElement("div");
        cardWrapper.className = "movie-card";

        const cardPoster = document.createElement("div");
        cardPoster.className = "card-poster";

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info";

        const imageSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "Photos/home_logo.jfif";
        cardPoster.innerHTML = `<img src="${imageSrc}" alt="Poster ${movie.title}" class="poster-img">`;

        const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";
        const rating100 = Math.round((movie.vote_average || 0) * 10);
        const genresText = getGenreNames(movie.genre_ids);

        cardInfo.innerHTML = `
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-year">${releaseYear}</span>
            <p class="movie-genre">${genresText}</p>
            <p class="movie-rating">${rating100}/100</p>
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
        genre: getGenreNames(tmdbMovie.genre_ids),
        releaseYear: parseInt(tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : 0),
        rating: Math.round((tmdbMovie.vote_average || 0) * 10),
        isWatched: true,
        posterUrl: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : ""
    }

    try{
        await fetch(API_URL_BASE, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newMovie)
    });
    if (response.ok) {
            alert(`"${newMovie.title}" was logged to your database!`);
        } else {
            alert("Error saving movie!");
    }
    } catch(error){
        console.error("Error saving movie:", error);
    }
}

async function deleteLocalMovie(id) {
    if(confirm("Are you sure you want to remove this movie?")) {
        await fetch(`${API_URL_BASE}/${id}`, { method: "DELETE" });
        loadLocalMovies();
    }
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

loadTmdbPopular();