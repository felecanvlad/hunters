// inputs, buttons from registration page
const registerButton = document.getElementById("register-button-id");
const emailInput = document.getElementById("email");
const firstPasswordInput = document.getElementById("first-password");
const secondPasswordInput = document.getElementById("second-password");
const birthdayPicker = document.getElementById("birthday");
const message = document.getElementById("error-message");

function clearAllFields() {
    emailInput.value = "";
    firstPasswordInput.value = "";
    secondPasswordInput.value = "";
    birthdayPicker.value = "";
}

function createHunter() {
    let statusCodeResponse = "";
    //hunter json object
    const hunter = {
        email: emailInput.value,
        password: firstPasswordInput.value,
        birthdate: birthdayPicker.value
    }
    fetch("http://localhost:3000/hunters/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(hunter)
    })
        .then(function (res) {
            statusCodeResponse = res.status;
            return res.json();
        })
        .then((resp) => {
            console.log("resp", resp);
            if (statusCodeResponse === 200) {
                window.location.replace("http://localhost:3001/views/login.html");
            } else {
                message.innerText = "Internal server error!";
            }
        }).catch(function (error) {
            clearAllFields();
            message.innerText = "Wrong URL or node.js app is not running: " + error;
        });
}

registerButton.addEventListener("click", () => {
    if ((emailInput.value && firstPasswordInput.value && secondPasswordInput.value &&
        birthdayPicker.value) != "") {
        if (firstPasswordInput.value !== secondPasswordInput.value) {
            message.innerText = "Passwords should be the same!";
            clearAllFields();
        } else {
            createHunter();
        }
    } else {
        message.innerText = "Please check the entered data";
    }
});