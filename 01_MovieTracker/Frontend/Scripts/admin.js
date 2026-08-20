const API_URL = "http://localhost:5160/api/movies";

document.addEventListener("DOMContentLoaded", loadMovies);

async function loadMovies(){
    try{
        const response = await fetch(API_URL);
        const movies = await response.json();
        const container = document.getElementById("movie-list");
        container.innerHTML = "";

        movies.forEach(movie => {
            const watchedStatus = movie.isWatched? "✅ Watched" : "⏳ To Watch"

            const card = document.createElement("div");
            card.className = "movie-item";
            card.innerHTML = `
                <div clas="movie-info">
                <h3>${movie.title}</h3>
                p>Genre: ${movie.genre} | Year: ${movie.releaseYear} | Rating: ${movie.rating || 'N/A'} | ${watchedStatus}</p>
                </div>
                <div class="movie-actions">
                    <button class="btn-edit" onclick="prepareEdit(${movie.id}, '${movie.title}', '${movie.genre}', ${movie.releaseYear}, ${movie.rating || 0}, ${movie.isWatched})">Edit</button>
                    <button class="btn-delete" onclick="deleteMovie(${movie.id})">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch(error){
        console.error("Error loading movies:", error);
    }
}

async function saveMovie() {
    const id = document.getElementById("movieId").value;
    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const releaseYear = document.getElementById("releaseYear").value;
    const rating = document.getElementById("rating").value;
    const isWatched = document.getElementById("isWatched").checked;

    const movieData = {
        title: title,
        genre: genre,
        releaseYear: parseInt(releaseYear),
        rating: parseInt(rating),
        isWatched: isWatched
    };

    try {
        if (!id) {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieData)
            });
        } 
        else {
            movieData.id = parseInt(id);
            await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movieData)
            });
        }

        resetForm();
        loadMovies();
    } catch (error) {
        console.error("Error saving movie:", error);
    }
}

async function deleteMovie(id) {
    if (confirm("Are you sure you want to delete this movie?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            loadMovies();
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    }
}

function prepareEdit(id, title, genre, year, rating, isWatched) {
    document.getElementById("form-title").innerText = "Edit Movie";
    document.getElementById("movieId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("genre").value = genre;
    document.getElementById("releaseYear").value = year;
    document.getElementById("rating").value = rating;
    document.getElementById("isWatched").checked = isWatched;
    
    document.getElementById("cancelBtn").style.display = "block";
}

function resetForm() {
    document.getElementById("form-title").innerText = "Add New Movie";
    document.getElementById("movieId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("releaseYear").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("isWatched").checked = false;
    
    document.getElementById("cancelBtn").style.display = "none";
}