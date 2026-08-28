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
const headerMain = document.getElementById("headerMain");
const searchInput = document.getElementById("searchInput");
const sortDropdown = document.getElementById("sortMovies");
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

function renderMovies(){
    container.innerHTML = "";
    let filteredMovies = allMovies.filter(movie => movie.isWatched === isWatchedTab);

    filteredMovies = sortMoviesArray(filteredMovies, sortDropdown.value);

    filteredMovies.forEach(movie => {
        let watchedStatus = "👁️ Mark as Watched";
        if (movie.isWatched === true) {
            watchedStatus = "Watched ✔️";
        }

        const cardWrapper = document.createElement("div");
        cardWrapper.className = "movie-card";

        const cardPoster = document.createElement("div");
        cardPoster.className = "card-poster"
        const imageSrc = movie.posterUrl ? movie.posterUrl : "Photos/home_logo.jfif";
        cardPoster.innerHTML = `<img src="${imageSrc}" alt="Poster ${movie.title}" class="poster-img">`;

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info"
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

sortDropdown.addEventListener("change", function(){
    renderMovies();
});

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
    alert("Logged out successfully!");
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

searchInput.addEventListener("input", function(){
    const query = searchInput.value.toLowerCase();
    const movieCards = document.querySelectorAll(".movie-card");

    movieCards.forEach(card => {
        const titleElement = card.querySelector(".movie-title");
        const titleText = titleElement.innerText.toLowerCase();

        card.style.display = titleText.includes(query) ? "flex" : "none";
    });
});

loadMovies();