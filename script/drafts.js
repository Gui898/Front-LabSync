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
    if(p.title == null){
      card.innerHTML = "Sem título"
    }else{
      card.innerHTML = p.title;
    }
    
    card.innerHTML = card.textContent.trim();

    //ADD THE EVENT TO THE CARDS AND REDIRECT TO THE EDITOR PAGE
    card.addEventListener("click", () => {
      localStorage.setItem("editingProject", JSON.stringify(p));
      window.location.href = "../pages/writeProject.html";
    });

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

  const emptyProject = {
    title: null,
    category: "",
    textProjects: "",
    usedInstruments: "",
    usedTech: "",
    hasPost: false,
    user: userObj
  }

  fetch("http://localhost:8080/project", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emptyProject)
  })
  .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao enviar");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Erro no fetch:", err);
    });

  const exist = Array.from(document.querySelectorAll("div"))
    .some(div => div.textContent.trim() === "Sem título");

  if (exist) {
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

  renderProjects();
  window.location.reload();
});

loadMoreBtn.addEventListener("click", renderProjects);

//Initial
renderProjects();