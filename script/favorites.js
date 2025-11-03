const projectsGrid = document.getElementById("projectsGrid");
const favoritesTotal = document.getElementById("favoritesTotal");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let shownCount = 0;
const PAGE_SIZE = 100;

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
let allFavorites = [];

fetch("http://localhost:8080/favorite/user/" + loggedUser.idUser)
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
    reverse(allFavorites);
    localStorage.setItem("userFavorites", JSON.stringify(favorite));
    renderProjects();
  })
  .catch(err => console.log(err.message));

function reverse(array) {
    let i = 0;
    let j = array.length - 1;
    while (i <= j) {
        const arrayFixPos = array[i];
        array[i] = array[j];
        array[j] = arrayFixPos;
        i++;
        j--;
    }
}

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