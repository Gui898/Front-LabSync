const projectsGrid = document.getElementById("projectsGrid");
const favoritesTotal = document.getElementById("draftsTotal");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let allProjects = []; // viria do backend



let shownCount = 0;
const PAGE_SIZE = 10;

// Simulação inicial
allProjects = Array.from({ length: 30 }, (_, i) => ({
  name: `Projeto ${i + 1}`
}));

function renderProjects() {
  const nextProjects = allProjects.slice(shownCount, shownCount + PAGE_SIZE);

  nextProjects.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project__card");
    card.textContent = p.name;
    projectsGrid.appendChild(card);
  });

  shownCount += nextProjects.length;
  favoritesTotal.textContent = allProjects.length;

  if (shownCount >= allProjects.length) {
    loadMoreBtn.style.display = "none";
  }
}

loadMoreBtn.addEventListener("click", renderProjects);

// inicial
renderProjects();