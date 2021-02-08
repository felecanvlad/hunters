

// inputs, buttons from login page
const loginButton = document.getElementById("login-button");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const errorMessage = document.getElementById("error-message");

function clearInputFields() {
    emailInput.value = "";
    passwordInput.value = "";
}

function checkCredentials() {
    let statusCodeResponse = "";
    const hunter = {
        email: emailInput.value,
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
                window.location = "/home.html";
            } else {
                errorMessage.innerText = "Incorrect email address or password";
            }
        }).catch(function (error) {
            clearInputFields();
            errorMessage.innerText = "Wrong URL or node.js app is not running: " + error;
        });
}

loginButton.addEventListener("click", () => {
    if ((emailInput.value && passwordInput.value) != "") {
        checkCredentials();
    } else {
        errorMessage.innerText = "Please check the entered data";
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Enter') {
        event.preventDefault();
        loginButton.click();
    }
});