const loggedInUser = localStorage.getItem("userName");
const API_URL_MOVIES = "http://localhost:5160/api/movies";

if (loggedInUser == null) {
    alert("Not signed in!");
    window.location.href = "home.html";
} else {
    document.getElementById("userNameDisplay").innerText = loggedInUser;
}

async function loadMovies(){
    try{
        const response = await fetch(API_URL_MOVIES);
        const movies = await response.json();
        const container = document.getElementById("moviesGrid");
        container.innerHTML = "";

        movies.forEach(movie => {
            let watchedStatus = "👁️ Mark as Watched";
            if (movie.isWatched === true) {
                watchedStatus = "Watched ✔️";
            }

            const cardWrapper = document.createElement("div");
            cardWrapper.className = "movie-card";

            const cardPoster = document.createElement("div");
            cardPoster.className = "card-poster"
            cardPoster.innerHTML = `
                <span class="poster-placeholder">POZA</span>
            `;

            const cardInfo = document.createElement("div");
            cardInfo.className = "card-info"
            cardInfo.innerHTML = `
                <h3 class="movie-title">${movie.title}</h3>
                <span class="movie-year">${movie.releaseYear}</span>
                <p class="movie-genre">${movie.genre}</p>
                <p class="movie-rating">${movie.rating}</p>
                <button class="btn-mark-watched" onclick=markWatched(${id})>${watchedStatus}</button>
            `;
            cardWrapper.appendChild(cardPoster);
            cardWrapper.appendChild(cardInfo);
            container.appendChild(cardWrapper);
        });
    } catch(error){
        console.error("Error loading movies:", error);
    }
}
loadMovies();
function logout(){
    localStorage.clear();
    window.location.href = "home.html";
    alert("Logged out succesful!");
}