/*** Login formulaire ***/


const formLog = document.querySelector("#formlog");

formLog.addEventListener("submit", async (event) => {

    event.preventDefault();

    const userInfo = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
    };
    const bodyLogin = JSON.stringify(userInfo);

    console.log(bodyLogin)



    const response = await fetch("http://127.0.0.1:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyLogin
    });

    const data = await response.json();

    if (response.status === 200) {
        console.log(data)
        window.localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        const popup = document.querySelector(".error")
        if (!popup) {
            const popup = document.createElement("span")
            formLog.appendChild(popup)
            popup.innerHTML = "Identifiants incorrects."
            popup.classList = "error"
        }
    }



    /**window.location.href ="index.html"**/
});


