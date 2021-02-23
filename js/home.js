let currentPage = "home";
const ACTIVE_PROPERTY = "active";

function hide(id) {
    const elem = document.getElementById(id);
    elem ? elem.style.display = "none" : console.error("Go away! Element does not exists!");
}

function hidePreviousPage() {
    hide(currentPage);
    const link = document.querySelector(`#left-menu-bar a[data-page="${currentPage}"]`);
    link.classList.remove(ACTIVE_PROPERTY);
}

function showCard(pageId) {
    hidePreviousPage();
    document.getElementById(pageId).style.display = "";
    const link = document.querySelector(`#left-menu-bar a[data-page="${pageId}"]`);
    link.classList.add(ACTIVE_PROPERTY);
    currentPage = pageId;
}

function initializeLeftMenu() {
    document.addEventListener("click", function (e) {
        const link = e.target;
        if (link.matches("#left-menu-bar a")) {
            const id = link.getAttribute("data-page");
            showCard(id);
        }
    });
}

function generateRandomTest(number) {
    let statusCodeResponse = "";
    fetch(`http://localhost:3000/hunters/random?value=${number}`, {
        method: "GET"
    })
        .then(res => {
            statusCodeResponse = res.status;
            return res.json()
        })
        .then(resp => {
            if (statusCodeResponse === 200) {
                renderQuestions(resp);
            } else {
                alert("ERROR");
            }
        });
}

function renderQuestions(questions) {
    let id = 1;
    const questionsLi = questions.map(function (question) {
        return ` 
        <h5> ${id++}. <b> ${question.text} : </b> </h5>
       
    <ul>
        <li>  
            <label>
            <input class="answer" type="radio" name="${question.id}" value="0" >
                 ${question.option_a}
            </label> 
        </li>
        <hr> 

        <li> 
            <label>
            <input class="answer" type="radio" name="${question.id}" value="1" >
                ${question.option_b}
            </label> 
        </li>
        <hr> 

        <li>  
            <label>
            <input class="answer" type="radio" name="${question.id}" value="2">
                ${question.option_c}
            </label> 
        </li> 
        <hr>
    </ul>`;
    });

    const ul = document.querySelector(".card ul");
    ul.innerHTML = questionsLi.join("");
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    if (window.timerStarted) {
        return;
    }
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector('#count-down').textContent = "Remaining time: " + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        if (minutes + ":" + seconds === "00:00") {
            clearInterval(interval);
            window.timerStarted = undefined;
            const ul = document.querySelector(".card ul");
            ul.innerHTML = "";

            const generateTitle = document.querySelector("#generate-title");
            generateTitle.innerHTML = "See you next time!";
        }
    }, 1000);
    window.timerStarted = interval;
}

function displayCurrentUserEmail() {
    const currentUserEmail = document.getElementById("current-user-email");
    const localStorageValue = window.localStorage.getItem("email");
    localStorageValue == undefined ? currentUserEmail.innerText = "" :
        currentUserEmail.innerText = currentUserEmail.innerText + localStorageValue;
}

initializeLeftMenu();
showCard(currentPage);
displayCurrentUserEmail();

const generateTextHref = document.getElementById("start-test");
generateTextHref.addEventListener("click", () => {
    generateRandomTest(10);
    startTimer(400);
});

const submitButton = document.getElementById("submit-button");
const errorMessage = document.getElementById("error-message");
submitButton.addEventListener("click", () => {
    const allAnswers = [...document.querySelectorAll(".answer")];
    if (!isRadioChecked()) {
        errorMessage.innerText = "Please choose at least one answer for each question";
    } else {
        errorMessage.innerText = "";
        const checkedResults = allAnswers.filter(answer => {
            return answer.checked
        });

        const dataToSent = [];
        checkedResults.forEach(result => {
            const questionIdValue = result.name;
            const selectedAnswer = result.value;
            const res = { "id": questionIdValue, "option": selectedAnswer };
            return dataToSent.push(res);
        });

        fetch("http://localhost:3000/hunters/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSent)
        })
            .then(res => res.json())
            .then(r => {
                console.warn(r.success);
                if (r.success) {
                    alert("SUCCESS");
                } else {
                    alert("STOP! FAILED!");
                }
            });

    }
});

function isRadioChecked() {
    return [...document.querySelectorAll(".answer")].some(c => c.checked);
}