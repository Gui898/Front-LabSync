const projectsGrid = document.getElementById("projectsGrid");
const favoritesTotal = document.getElementById("draftsTotal");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const newProjectButton = document.getElementById("newProjecrButton");

let cards = document.querySelectorAll("#projectCard");

const userObj = JSON.parse(localStorage.getItem("loggedUser"));
let allProjects = []; //comming from backend

fetch("http://localhost:8080/project/user/" + userObj.idUser)
  .then(async res => {
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.message || 'Erro desconhecido no login';
      throw new Error(msg);
    }
    return data;
  })
  .then(projects => {
    allProjects = projects;
    localStorage.setItem("userProjects", JSON.stringify(projects));
    renderProjects();
  })
  .catch(err => console.log(err.message));

let shownCount = 0;
const PAGE_SIZE = 10;

//RENDER ALL USER'S PROJECTS
function renderProjects() {
  const nextProjects = allProjects.slice(shownCount, shownCount + PAGE_SIZE);

  nextProjects.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project__card");
    card.id = "projectCard";
    card.innerHTML = p.title;
    card.innerHTML = card.textContent.trim();
    projectsGrid.appendChild(card);
  });

  shownCount += nextProjects.length;
  favoritesTotal.textContent = allProjects.length;

  if (shownCount >= allProjects.length) {
    loadMoreBtn.style.display = "none";
  }
}


//ADD A NEW PROJECT
newProjectButton.addEventListener("click", () => {

  const existe = Array.from(document.querySelectorAll("div"))
    .some(div => div.textContent.trim() === "Sem título");

  if (existe) {
    console.log("Tem que alterar o arquivo em branco já existente!");
  } else {
    const card = document.createElement("div");
    card.classList.add("project__card");
    card.id = "projectCard";
    card.textContent = "Sem título"
    projectsGrid.appendChild(card);
    shownCount++;
    favoritesTotal.textContent = shownCount;
  }

});

//REDIRECTING TO THE SELECTED PROJECT TO EDIT


loadMoreBtn.addEventListener("click", renderProjects);

//Initial
renderProjects();