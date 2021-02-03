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
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                // if the hunter user is created
                clearAllFields();
                // display login page? or display a success screen
            }
        })
}

registerButton.addEventListener("click", () => {
    if ((emailInput.value && firstPasswordInput.value && secondPasswordInput.value &&
        birthdayPicker.value) != "") {
        createHunter();
    } else {
        alert("Input fields are incorrect");
    }

});