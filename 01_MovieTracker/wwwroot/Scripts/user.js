const loggedInUser = localStorage.getItem("userName");

if (loggedInUser == null) {
    alert("Not signed in!");
    window.location.href = "home.html";
} else {
    document.getElementById("userNameDisplay").innerText = loggedInUser;
}

function logout(){
    localStorage.clear();
    window.location.href = "home.html";
    alert("Logged out succesful!");
}