// inputs, buttons from registration page
const registerButton = document.getElementById("register-button-id");
const emailInput = document.getElementById("email");
const firstPasswordInput = document.getElementById("first-password");
const secondPasswordInput = document.getElementById("second-password");
const birthdayPicker = document.getElementById("birthday");


registerButton.addEventListener("click", e => {
    if ((emailInput.value && firstPasswordInput.value && secondPasswordInput.value &&
        birthdayPicker.value) != "") {
        const registerJson = {
            "email": emailInput.value,
            "password": firstPasswordInput.value,
            "birthday": birthday.value
        };
        console.log(registerJson);
    } else {
        alert("Input fields are incorrect");
    }

});

