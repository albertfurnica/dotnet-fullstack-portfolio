localStorage.clear();

const API_URL_MOVIES = "http://localhost:5160/api/movies";
const btnSignIn = document.getElementById("btnSignIn");
const btnRegister = document.getElementById("btnRegister");
const modal = document.getElementById("addModal");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("closeModal");
const signInForm = document.getElementById("signInForm");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", function(){
    modal.style.display = "none";
})

btnSignIn.addEventListener("click", function(){
    modal.style.display = "flex";
    modalTitle.innerHTML = "Introduce your credentials";
    modalBody.innerHTML = "";
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Introduce your email:</label>
            <input type="email" id="loginEmail" required>
        </div>
        <div class="form-group">
            <label>Introduce your password:</label>
            <input type="password" id="loginPassword" required>
            <div  class="reset-password-container">
                <a href="resetPassword.html" target="_blank">Forgot your password?</a>
            </div>
        </div>
        <footer class="modal-footer">
            <button type="submit" class="btn-login">Login</button>
            <div class="register-section">
                <p>No account? <a onclick="btnRegister.click()">Register!</a></p>
            </div>    
        </footer>
    `;
})

btnRegister.addEventListener("click", function(){
    modal.style.display = "flex";
    modalTitle.innerHTML = "Join MovieTracker";
    modalBody.innerHTML = "";
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Introduce your last name:</label>
            <input type="text" id="userLastName" required pattern="[A-Za-z]+" title="Only letters are allowed!">
        </div>

        <div class="form-group">
            <label>Introduce your First name:</label>
            <input type="text" id="userFirstName" required pattern="[A-Za-z]+" title="Only letters are allowed!">
        </div>

        <div class="form-group">
            <label>Introduce your email:</label>
            <input type="email" id="userEmail" required>
        </div>

        <div class="form-group">
            <label>Introduce your password:</label>
            <input type="password" id="userPassword" required minlength="4" title="Password must be at least 8 characters long!">
        </div>

        <footer class="modal-footer">
            <button type="submit" class="btn-login">Register</button>
            <div class="register-section">
                <p>Already have an account? <a onclick="btnSignIn.click()">Sign in!</a></p>
            </div>
        </footer>
    `;
})








































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