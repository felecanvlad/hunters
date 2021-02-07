

// inputs, buttons from login page
const loginButton = document.getElementById("login-button");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");


function checkCredentials() {
    let statusCodeResponse = "";
    const hunter = {
        email: usernameInput.value,
        password: passwordInput.value,
    }
    fetch("http://localhost:3000/hunters/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(hunter)
    })
        .then(function (res) {
            statusCodeResponse = res.status;
            return res.json()
        })
        .then((resp) => {
            console.log("resp", resp);
            if (statusCodeResponse === 200) {
                window.location.replace("http://localhost:3001/home.html");
            } else {
                alert("fail");
            }
        })
}


loginButton.addEventListener("click", () => {
    checkCredentials();
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Enter') {
        event.preventDefault();
        loginButton.click();
    }
});