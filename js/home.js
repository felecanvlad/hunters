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
    const questionsLi = questions.map(function (question) {
        return ` 
            <h2>  <b> ${question.text} </b> </h2>
       
    <ol type="A" class>
        <li>  <label class="container">
    <input type="checkbox">
    <span class="checkmark">${question.option_a}</span></label> 
        </li>  <hr> 
        <li> <label class="container">
    <input type="checkbox">
    <span class="checkmark">${question.option_b}</span></label> 
        </li>  <hr> 
        <li>  <label class="container"><input type="checkbox">
    <span class="checkmark">${question.option_c}</span></label> 
        </li>  <hr>
    </ol>  `;
    });

    const ul = document.querySelector(".card-test ul");
    ul.innerHTML = questionsLi.join("");
}

initializeLeftMenu();
showCard(currentPage);

const generateTextHref = document.getElementById("start-test");
generateTextHref.addEventListener("click", () => {
    generateRandomTest(4);
});