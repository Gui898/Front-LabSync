let allPosts = [];
let currentIndex = 0;
const postsPerPage = 5;

fetch("http://localhost:8080/posts")
    .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            const msg = data?.message || "Erro desconhecido ao procurar posts";
            throw new Error(msg);
        }

        return data;
    })
    .then(data => {
        allPosts = data;
        loadMorePosts();
    })
    .catch(err => console.log(err.message));

function loadMorePosts() {

    if (currentIndex >= allPosts.length) return;

    const nextPosts = allPosts.slice(currentIndex, currentIndex + postsPerPage);
    nextPosts.forEach(post => renderPost(post));
    currentIndex += postsPerPage;
}

function renderPost(post) {
    //POST CONTAINER 
    const container = document.createElement("section");
    container.classList.add("post__container");

    //POST OWNER
    const divOwner = document.createElement("div");
    divOwner.classList.add("post__owner");
    const profileImg = document.createElement("img");
    profileImg.src = "../assets/perfilPhoto.png";
    profileImg.classList.add("post__profile");
    const profileName = document.createElement("h3");
    profileName.classList.add("text__img");
    profileName.innerHTML = post.user.name;

    divOwner.appendChild(profileImg);
    divOwner.appendChild(profileName);
    container.appendChild(divOwner);

    //POST CONTAINER_BELOW
    const divPostContent = document.createElement("div");
    divPostContent.classList.add("post__content");

    //POST PROJECT
    const divProjectContent = document.createElement("div");
    divProjectContent.classList.add("project__content");

    divProjectContent.innerHTML = post.project.title +
        "<br> <br>" + post.project.category +
        "<br> <br>" + post.project.textProjects;

    divPostContent.appendChild(divProjectContent);

    //POST BUTTONS
    const divPostDetails = document.createElement("div");
    divPostDetails.classList.add("post__details");

    const likeButton = document.createElement("button");
    likeButton.classList.add("content__bt");
    const likeImg = document.createElement("img");
    likeImg.src = "../assets/likeSymbol.png";
    const likeCount = document.createElement("span");
    likeCount.textContent = post.likes;
    likeButton.appendChild(likeImg);
    likeButton.append(likeCount);

    likeButton.addEventListener("click", (e) => {
        e.preventDefault();

        post.likes = post.likes + 1;
        likeCount.textContent = post.likes;

        fetch("http://localhost:8080/posts/" + post.idPost, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likes: post.likes }),
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

    const dislikeButton = document.createElement("button");
    dislikeButton.classList.add("content__bt");
    const dislikeImg = document.createElement("img");
    dislikeImg.classList.add("dislike");
    dislikeImg.src = "../assets/likeSymbol.png";
    dislikeButton.appendChild(dislikeImg);
    dislikeButton.append(0);

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("content__bt");
    const favoriteImg = document.createElement("img");
    favoriteImg.src = "../assets/postFavoriteHeart.png";
    favoriteButton.appendChild(favoriteImg);
    favoriteButton.append(0);

    const commentButton = document.createElement("button");
    commentButton.classList.add("content__bt");
    const commentImg = document.createElement("img");
    commentImg.src = "../assets/commentSymbol.png";
    commentButton.appendChild(commentImg);
    commentButton.append(0);

    const moreDetails = document.createElement("button");
    moreDetails.classList.add("more__details");
    moreDetails.innerHTML = "Mais detalhes"

    moreDetails.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.setItem("currentPostView", JSON.stringify(post));
        window.location.href = "../pages/viewProject.html";
    });

    //APPENDING ALL
    divPostDetails.appendChild(likeButton);
    divPostDetails.appendChild(dislikeButton);
    divPostDetails.appendChild(favoriteButton);
    divPostDetails.appendChild(commentButton);
    divPostDetails.appendChild(moreDetails);

    divPostContent.appendChild(divPostDetails);

    container.appendChild(divPostContent);

    const middleContainer = document.getElementById("middleContainer");
    middleContainer.appendChild(container);
};

window.addEventListener("scroll", () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;

    if (scrollPosition >= pageHeight - 200) {
        loadMorePosts();
    }
});

document.getElementById("popularButton").addEventListener("click", (e) => {
    e.preventDefault();

    allPosts = [];

    fetch("http://localhost:8080/posts/popular")
        .then(async res => {
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = data?.message || "Erro desconhecido ao procurar os populares";
                throw new Error(msg);
            }
            return data;
        })
        .then(data => {
            allPosts = data;
            currentIndex = 0;
            document.getElementById("middleContainer").innerHTML = "";
            loadMorePosts();
            window.scrollTo(0, 0);
        })
        .catch(err => console.log(err.message));
});


document.getElementById("searchButton").addEventListener("click", (e) => {
    e.preventDefault();

    const input = document.getElementById("searchInput");

    if (input) {
        fetch("http://localhost:8080/project/search/" + input.value)
            .then(async res => {
                const data = await res.json().catch(() => null);
                if (!res.ok) {
                    const msg = data?.message || "Erro desconhecido ao procurar os populares";
                    throw new Error(msg);
                }
                return data;
            })
            .then(data => {
                const postLikeStructure = {
                    idPost: data.id || 0,
                    user: { name: data.userName || "Desconhecido" },
                    project: data,
                    likes: data.likes || 0
                };
                localStorage.setItem("searchResult", JSON.stringify(postLikeStructure));
                allPosts = [postLikeStructure];
                currentIndex = 0;
                document.getElementById("middleContainer").innerHTML = "";
                loadMorePosts();
                window.scrollTo(0, 0);
            })
            .catch(err => {
                console.log(err.message)
                localStorage.removeItem("searchResult");
            });
    }
});