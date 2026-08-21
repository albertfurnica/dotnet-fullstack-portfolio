const API_URL = "http://localhost:5160/api/users/login"

document.getElementById("loginForm").addEventListener("submit",
    async function(event){

        event.preventDefault();
    
        try{
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            const loginData = {
                email: email,
                password: password
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if(response.ok){
                if(result.isAdmin == true)
                    window.location.href="admin.html";
                else
                    window.location.href="home.html";
            } else {
                alert(result);
            }
        } catch(error){
            console.error("Error login user: ", error);
        }
    }
)