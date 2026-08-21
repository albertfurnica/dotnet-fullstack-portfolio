const API_URL = "http://localhost:5160/api/users/register";

async function saveUser() {
    try{
        const id = document.getElementById("userId").value;
        const firstname = document.getElementById("userFirstName").value;
        const lastname = document.getElementById("userLastName").value;
        const email = document.getElementById("userEmail").value;
        const password = document.getElementById("userPassword").value;

        const userData = {
            firstName: firstname,
            lastName: lastname,
            Email: email,
            Password: password
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        });

        const resultMessage = await response.text();

        if(response.ok){
            alert(resultMessage);
            resetForm();
        } else {
            alert("Error: " + resultMessage);
        }
    
    } catch(error){
        console.error("Error saving user:", error);
    }
}

function resetForm(){
    document.getElementById("userFirstName").value = "";
    document.getElementById("userLastName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userPassword").value = "";
}