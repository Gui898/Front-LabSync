const projectsGrid = document.getElementById("projectsGrid");
const favoritesTotal = document.getElementById("favoritesTotal");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let shownCount = 0;
const PAGE_SIZE = 5;

const userObj = JSON.parse(localStorage.getItem("loggedUser"));
let allFavorites = []; //comming from backend

fetch("http://localhost:8080/favorite/user/" + userObj.idUser)
.then(async res => {
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.message || 'Erro desconhecido ao encontrar favoritos';
      throw new Error(msg);
    }
    return data;
  })
  .then(favorite => {
    allFavorites = favorite;
    localStorage.setItem("userFavorites", JSON.stringify(favorite));
    renderProjects();
  })
  .catch(err => console.log(err.message));


function renderProjects() {
  const nextProjects = allFavorites.slice(shownCount, shownCount + PAGE_SIZE);

  nextProjects.forEach(f => {
    const card = document.createElement("div");
    card.classList.add("project__card");
    card.id = "projectCard";
    card.innerHTML = f.posts.project.title;
    
    card.innerHTML = card.textContent.trim();

    //]EDITA AQUI AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    card.addEventListener("click", () => {
      localStorage.setItem("showingFavorite", JSON.stringify(f));
      window.location.href = "../pages/viewProject.html";
    });

    projectsGrid.appendChild(card);
  });

  shownCount += nextProjects.length;
  favoritesTotal.textContent = allFavorites.length;

  if (shownCount >= allFavorites.length) {
    loadMoreBtn.style.display = "none";
  }
}

loadMoreBtn.addEventListener("click", renderProjects);

// inicial
renderProjects();