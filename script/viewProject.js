const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

const postDetailed = JSON.parse(localStorage.getItem("currentPostView"));

let allFavorites = JSON.parse(localStorage.getItem("userFavorites"));

let isFavorited;

const likeCount = document.getElementById("likeCount");
const heartFav = document.getElementById("postFavoriteHeart");
const imgFav = document.getElementById("heartImg");

initializer();

function initializer() {
    const titleArea = document.getElementById("titleBox");
    const categoryArea = document.getElementById("categoryBox");
    const textArea = document.getElementById("textBox");
    const usedInstArea = document.getElementById("usedInst");
    const usedTechArea = document.getElementById("usedTech");

    if (postDetailed.idFavorite != null) {

        isFavorited = true;
        imgFav.src = "../assets/alreadyFavoritedHeart.png";

        titleArea.innerHTML = postDetailed.posts.project.title;
        categoryArea.innerHTML = postDetailed.posts.project.category;
        textArea.innerHTML = postDetailed.posts.project.textProjects;
        usedInstArea.innerHTML = postDetailed.posts.project.usedInstruments;
        usedTechArea.innerHTML = postDetailed.posts.project.usedTech;

        likeCount.textContent = postDetailed.posts.likes;
    } else {

        if(allFavorites == null){
            allFavorites = [];
            isFavorited = false;
        } else {
            isFavorited = true;
        }

        if(isFavorited){
            imgFav.src = "../assets/alreadyFavoritedHeart.png";
        }

        titleArea.innerHTML = postDetailed.project.title;
        categoryArea.innerHTML = postDetailed.project.category;
        textArea.innerHTML = postDetailed.project.textProjects;
        usedInstArea.innerHTML = postDetailed.project.usedInstruments;
        usedTechArea.innerHTML = postDetailed.project.usedTech;

        likeCount.textContent = postDetailed.likes;
    }

}

document.getElementById("likeButton").addEventListener("click", (e) => {
    e.preventDefault();

    if (postDetailed.idFavorite != null) {
        postDetailed.posts.likes = postDetailed.posts.likes + 1;
        likeCount.textContent = postDetailed.posts.likes;

        fetch("http://localhost:8080/posts/" + postDetailed.posts.idPost, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likes: postDetailed.posts.likes }),
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
    } else {
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
    }
});

heartFav.addEventListener("click", (e) => {
    e.preventDefault();

    const audio = new Audio("../assets/audio/favoriting.mp3");

    if (!isFavorited) {
        isFavorited = true;
        imgFav.src = "../assets/alreadyFavoritedHeart.png";
        heartFav.classList.add("favorited__button");
        audio.play();

        let favoriteObj;

        if (postDetailed.idFavorite != null) {
            favoriteObj = {
                user: loggedUser,
                posts: postDetailed.posts,
            }
        }else{
            favoriteObj = {
                user: loggedUser,
                posts: postDetailed
            }
        }

        fetch("http://localhost:8080/favorite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(favoriteObj),
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

    } else {
        isFavorited = false;
        imgFav.src = "../assets/postFavoriteHeart.png";
        heartFav.classList.remove("favorited__button");

        const idPost = postDetailed.idFavorite != null ? postDetailed.posts.idPost : postDetailed.idPost;

        fetch(`http://localhost:8080/favorite/${idPost}/${loggedUser.idUser}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
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
    }
});