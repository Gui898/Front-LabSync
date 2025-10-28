const postDetailed = JSON.parse(localStorage.getItem("currentPostView"));

const likeCount = document.getElementById("likeCount");

initializer();

function initializer() {
    const titleArea = document.getElementById("titleBox");
    const categoryArea = document.getElementById("categoryBox");
    const textArea = document.getElementById("textBox");
    const usedInstArea = document.getElementById("usedInst");
    const usedTechArea = document.getElementById("usedTech");

    titleArea.innerHTML = postDetailed.project.title;
    categoryArea.innerHTML = postDetailed.project.category;
    textArea.innerHTML = postDetailed.project.textProjects;
    usedInstArea.innerHTML = postDetailed.project.usedInstruments;
    usedTechArea.innerHTML = postDetailed.project.usedTech;

    likeCount.textContent = postDetailed.likes

}

document.getElementById("likeButton").addEventListener("click", (e) => {
    e.preventDefault();

    postDetailed.likes = postDetailed.likes + 1;
    likeCount.textContent = postDetailed.likes;

    fetch("http://localhost:8080/posts/" + postDetailed.idPost, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: postDetailed.likes }),
    })
        .then(async res => {
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = data?.message || "Erro desconhecido ao atualizar posts";
                throw new Error(msg);
            }
            return data;
        })
        .catch(err => console.log(err.message));
});