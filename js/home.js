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

initializeLeftMenu();
showCard(currentPage);