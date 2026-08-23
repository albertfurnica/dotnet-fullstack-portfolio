const API_URL_MOVIES = "http://localhost:5160/api/movies";
const API_URL_USERS = "http://localhost:5160/api/users";
const isAdmin = localStorage.getItem("isAdmin");

if(isAdmin !== "true"){
    alert("Access is denied!");
    window.location.href = "home.html";
}

let editId = null;
let currentView = "";
const btnAdd = document.getElementById("btnAdd");
const btnUsers = document.getElementById("btnUsers");
const btnMovies = document.getElementById("btnMovies");
const modal = document.getElementById("addModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("closeModal");
modalClose.addEventListener("click", function(){
    modal.style.display = "none";
});

btnUsers.addEventListener("click", async function() {
    currentView = "users";
    btnAdd.innerHTML = "Add a user";
    btnAdd.style.display = "inline-block";
    await loadUsers();
});

btnMovies.addEventListener("click", async function(){
    currentView = "movies";
    btnAdd.innerHTML = "Add a movie";
    btnAdd.style.display = "inline-block";
    await loadMovies();
});

btnAdd.addEventListener("click", function(){
    editId = null;
    modal.style.display = "inline-block";

    if(currentView === "users") {
        modalTitle.innerText = "Add a New User";
        modalBody.innerHTML = `
            <div class="form-group">
                <label>First Name:</label> 
                <input type="text" id="addUserFirstName" required>
            </div>

            <div class="form-group">
                <label>Last Name:</label>
                <input type="text" id="addUserLastName" required>
            </div>

            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="addUserEmail" required>
            </div>
        `;
    } else if(currentView === "movies") {
        modalTitle.innerText = "Add a New Movie";
        modalBody.innerHTML = `
            <div class="form-group">
                <label>Title:</label>
                <input type="text" id="addMovieTitle" required>
            </div>
            <div class="form-group">
                <label>Genre:</label>
                <input type="text" id="addMovieGenre" required>
            </div>
            <div class="form-group">
                <label>Year:</label>
                <input type="number" id="addMovieYear" required>
            </div>
            <div class="form-group">
                <label>Rating:</label>
                <input type="number" id="addMovieRating" required>
            </div>
        `;
    }
});

async function loadMovies(){
    try{
        const response = await fetch(API_URL_MOVIES);
        const movies = await response.json();
        document.getElementById("listTitle").innerText = "Movies Database";
        document.getElementById("btnAdd").innerText = "Add a movie";
        const container = document.getElementById("dataList");
        container.innerHTML = "";
    
        movies.forEach(movie => {
        const watchedStatus = movie.isWatched? "✅ Watched" : "⏳ To Watch"

        const card = document.createElement("li");
        card.className = "movie-item";
        card.innerHTML = `
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>Id : ${movie.id} | Genre: ${movie.genre} | Year: ${movie.releaseYear} | Rating: ${movie.rating || 'N/A'} | ${watchedStatus}</p>
            </div>
            <div class="movie-actions">
                <button class="btn-edit" onclick="EditMovie(${movie.id}, '${movie.title}', '${movie.genre}', ${movie.releaseYear}, ${movie.rating || 0}, ${movie.isWatched})">Edit</button>
                <button class="btn-delete" onclick="deleteMovie(${movie.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
        });

    } catch(error){
        console.error("Error loading movies:", error);
    }
}

async function loadUsers()
{
    try{
        const response = await fetch(API_URL_USERS);
        const users = await response.json();
        document.getElementById("listTitle").innerText = "Users Database";
        document.getElementById("btnAdd").innerText = "Add a user"
        const container = document.getElementById("dataList");
        container.innerHTML = "";

        users.forEach(user => {
            const card = document.createElement("li");
            card.className = "movie-item";
            card.innerHTML = `
                <div class="movie-info">
                    <h3>${user.firstName} ${user.lastName}</h3>
                    <p>First Name : ${user.firstName} | Last Name : ${user.lastName} | Email : ${user.email} | Password : ${user.password}</p>
                </div>
                <div class="movie-actions">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch(error){
        console.error("Error loading users: ", error);
    }

}

document.getElementById("addForm").addEventListener("submit",
    async function(event) {

        event.preventDefault();

        try{
            if(currentView === "users"){
                const firstName = document.getElementById("addUserFirstName").value;
                const lastName = document.getElementById("addUserLastName").value;
                const email = document.getElementById("addUserEmail").value;

                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: "password123"
                };

                const response = await fetch(API_URL_USERS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                if(response.ok){
                    alert("User successfully added!");
                    modal.style.display = "none";
                    loadUsers();
                } else {
                    alert("Error: " + (await response.text()));
                }

            } else if(currentView === "movies"){
                const title = document.getElementById("addMovieTitle").value;
                const genre = document.getElementById("addMovieGenre").value;
                const releaseYear = document.getElementById("addMovieYear").value;
                const rating = document.getElementById("addMovieRating").value;

                const movieData = {
                    id: editID ? editId : 0,
                    title: title,
                    genre: genre,
                    releaseYear: parseInt(releaseYear),
                    rating: rating,
                    isWatched: false
                };

                let response;
                if(editId !== null){
                    response = await fetch(`${API_URL_MOVIES}/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movieData)
                    });
                } else {
                    response = await fetch(API_URL_MOVIES, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movieData)
                    });
                }

                if(response.ok){
                    alert("Movie successfully added!");
                    modal.style.display = "none";
                    loadMovies();
                } else {
                    alert("Error: " + (await response.text()));
                }
            }
        } catch (error) {
            console.error("Error saving data: ", error);
            alert("Error saving data: ", error);
        } 
    }
)

window.EditMovie = async function(id, title, genre, year, rating) {
    editId = id;
    currentView = "movies";
    
    modal.style.display = "block";
    modalTitle.innerText = "Edit Movie";

    modalBody.innerHTML = `
        <div class="form-group">
            <label>Title:</label>
            <input type="text" id="addMovieTitle" value="${title}" required>
        </div>
        <div class="form-group">
            <label>Genre:</label>
            <input type="text" id="addMovieGenre" value="${genre}" required>
        </div>
        <div class="form-group">
            <label>Year:</label>
            <input type="number" id="addMovieYear" value="${year}" required>
        </div>
        <div class="form-group">
            <label>Rating:</label>
            <input type="number" id="addMovieRating" value="${rating}" required>
        </div>
    `
};

async function deleteMovie(id) {
    if (confirm("Are you sure you want to delete this movie?")) {
        try {
            await fetch(`${API_URL_MOVIES}/${id}`, {
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

    document.getElementById("rating").value = rating;
    document.getElementById("isWatched").checked = isWatched;
    
    document.getElementById("cancelBtn").style.display = "block";
}