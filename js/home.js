
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

function generateRandomTest(number, callback) {
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
                callback();
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
       
    <ul class="eachSetOfAnswers">
        <li>  
            <label>
            <input id="${question.id}-0" class="answer" type="radio" name="${question.id}" value="0" >
                 ${question.option_a}
            </label> 
        </li>
        <hr> 

        <li> 
            <label>
            <input id="${question.id}-1" class="answer" type="radio" name="${question.id}" value="1" >
                ${question.option_b}
            </label> 
        </li>
        <hr> 

        <li>  
            <label>
            <input id="${question.id}-2" class="answer" type="radio" name="${question.id}" value="2">
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

const initEvents = function () {
    const generateTextHref = document.getElementById("start-test");
    generateTextHref.addEventListener("click", () => {
        generateRandomTest(30, function () {
            const uls = document.querySelectorAll(".eachSetOfAnswers");
            uls.forEach(ul => {
                ul.addEventListener('click', function (e) {
                    if (e.target.nodeName === "INPUT") {
                        this.setAttribute('checked', true);
                    }
                });
            })
        });
        startTimer(1800);
    });

    function isRadioChecked() {
        return [...document.querySelectorAll(".eachSetOfAnswers")].every(c => c.getAttribute('checked'));;
    }

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

            let statusCodeResponse = "";
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
                .then(function (res) {
                    statusCodeResponse = res.status;
                    return res.json()
                })
                .then((resp) => {
                    if (statusCodeResponse === 200) {
                        const allRadioOptions = document.querySelectorAll("li label input");
                        allRadioOptions.forEach(radio => {
                            radio.disabled = true;
                        });
                        submitButton.style.display = "none";

                        resp.answers.filter(question => question.isCorrect === false).forEach(each => {
                            const wrongAnswer = document.getElementById(`${each.id}-${each.option}`);
                            const wrongParrent = wrongAnswer.parentNode;
                            wrongParrent.style.border = "1px solid red";
                            wrongParrent.style["background-color"] = "red";

                            const correctAnswer = document.getElementById(`${each.id}-${each.correct}`);
                            const correctParent = correctAnswer.parentNode;
                            correctParent.style.border = "1px solid green";
                            correctParent.style["background-color"] = "green";
                        });

                        resp.answers.filter(question => question.isCorrect === true).forEach(each => {
                            const correctAnswer = document.getElementById(`${each.id}-${each.correct}`);
                            const correctParent = correctAnswer.parentNode;
                            correctParent.style.border = "1px solid green";
                            correctParent.style["background-color"] = "green";
                        });

                        const gradeField = document.getElementById("grade");
                        if (resp.incorrectAnwsers > resp.totalNumberOfQuestions / 2 + 1) {
                            gradeField.innerText = "You failled the exam. Correct responses: " + resp.correctAnwsers
                                + " (from a total of " + resp.totalNumberOfQuestions + ")";
                            gradeField.style.color = "red";
                        } else if (resp.incorrectAnwsers == 0) {
                            gradeField.innerText = "You passed the exam without any mistake!";
                            gradeField.style.color = "green";
                        } else {
                            gradeField.innerText = "You passed the exam. This time you were lucky but maybe not next time! Correct responses: " + resp.correctAnwsers
                                + " (from a total of " + resp.totalNumberOfQuestions + ")";
                            gradeField.style.color = "green";
                        }
                        const timer = document.getElementById("count-down");
                        const generateTestText = document.getElementById("generate-title")
                        timer.style.display= "none";
                        generateTestText.style.display= "none";

                    } else {
                        errorMessage.innerText = "Response code is not 200";
                    }
                }).catch(function (error) {
                    errorMessage.innerText = "Something went wrong. Please contact administrator: " + error;
                });
        }
    });
}

initializeLeftMenu();
showCard(currentPage);
displayCurrentUserEmail();
initEvents();