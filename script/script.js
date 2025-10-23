let allPosts = [];

fetch("http://localhost:8080/posts")
.then(async res => {
    const data = await res.json().catch(() => null);
    if(!res.ok){
        const msg = data?.message || "Erro desconhecido ao procurar posts";
        throw new Error(msg); 
    }

    return data;
})
.then(data => {
    allPosts = data;
    postsOnLoad();
})
.catch(err => console.log(err.message));

function postsOnLoad(){
    allPosts.forEach(post => {
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
        likeButton.appendChild(likeImg);
        likeButton.append(post.likes);

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

        //APPENDING ALL
        divPostDetails.appendChild(likeButton);
        divPostDetails.appendChild(dislikeButton);
        divPostDetails.appendChild(favoriteButton);
        divPostDetails.appendChild(commentButton);

        divPostContent.appendChild(divPostDetails);
        
        container.appendChild(divPostContent);

        const middleContainer = document.getElementById("middleContainer");
        middleContainer.appendChild(container);
    });
};