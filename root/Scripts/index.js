async function loadMovies(){
    try{
        const response = await fetch("http://localhost:5160/api/movies");
        const movies = await response.json();

        const container = document.getElementById("movie-list");
        container.innerHTML = "";

        movies.forEach(movie => {
            const watchedStatus = movie.isWatched ? "✅ Watched" : "⏳ To Watch";

            const card = document.createElement("div");
            card.className = "movie-card";
            card.innerHTML = `
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">
                    Genre: ${movie.genre} | Year: ${movie.releaseYear} | ${watchedStatus}
                </div>
            `;

            container.appendChild(card);
        });
    } catch(error){
        console.error("Something went wrong:", error);
        alert("Could not load movies. Make sure the C# server is running!");
    }
}