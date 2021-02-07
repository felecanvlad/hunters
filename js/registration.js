// inputs, buttons from registration page
const registerButton = document.getElementById("register-button-id");
const emailInput = document.getElementById("email");
const firstPasswordInput = document.getElementById("first-password");
const secondPasswordInput = document.getElementById("second-password");
const birthdayPicker = document.getElementById("birthday");

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
                alert("fail");
            }
        });
}

registerButton.addEventListener("click", () => {
    if ((emailInput.value && firstPasswordInput.value && secondPasswordInput.value &&
        birthdayPicker.value) != "") {
        if (firstPasswordInput.value !== secondPasswordInput.value) {
            alert("Passwords should be the same!");
            firstPasswordInput.value = "";
            secondPasswordInput.value = "";
        } else {
            createHunter();
        }
    } else {
        alert("Input fields are incorrect");
    }
});