let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

const userName = document.getElementById("username");
const surname = document.getElementById("surname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const aboutMe = document.getElementById("aboutMe");

//INITIALIZE USER IN THE INPUTS
userName.value = loggedUser.name;
surname.value = loggedUser.surname;
email.value = loggedUser.email;
password.value = loggedUser.password;
aboutMe.value = loggedUser.aboutMe;

//EXIT USER
document.getElementById("exitBt").addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.clear();
    window.location.href = "../pages/login.html";
});

//SAVE USER ALTERATIONS
document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();

    loggedUser = {
        ...loggedUser, // kepp data, till that were here before
        name: userName.value,
        surname: surname.value,
        email: email.value,
        password: password.value,
        aboutMe: aboutMe.value
    };

    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

    fetch("http://localhost:8080/user/" + loggedUser.idUser, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loggedUser)
    })
        .then(async res => {
            if (!res.ok) {
                const msg = data?.message || 'Erro desconhecido na configuração de usuário';
                document.getElementById("invalidInputs").style.display = "block";
                throw new Error(msg);
            } else {
                document.getElementById("invalidInputs").style.display = "none";
                document.getElementById("validInputs").style.display = "flex";
            }
        })
        .then(() => {
            setTimeout(() => document.getElementById("validInputs").style.display = "none", 1500);
        })
        .catch(err => console.log(err));
});

if(loggedUser.readerOrAuthor){
    document.getElementById("projectDrafts").style.display = "flex";
    document.getElementById("beAnAuthor").style.display = "none";
}else{
    document.getElementById("beAnAuthor").style.display = "flex";
    document.getElementById("projectDrafts").style.display = "none";
}

//DELETE USER
document.getElementById("deleteUser").addEventListener("click", (e) => {
    e.preventDefault();

    //Deleting user's favorites
    fetch("http://localhost:8080/favorite/user/" + loggedUser.idUser, {
        method: "DELETE",
    })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.message || 'Erro desconhecido na configuração de usuário';
                throw new Error(msg);
            }
        })
        .catch(err => console.log(err));


    //Deleting user's posts
    fetch("http://localhost:8080/posts/user/" + loggedUser.idUser, {
        method: "DELETE",
    })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.message || 'Erro desconhecido na configuração de usuário';
                throw new Error(msg);
            }
        })
        .catch(err => console.log(err));

    //Deleting user's projects
    fetch("http://localhost:8080/project/user/" + loggedUser.idUser, {
        method: "DELETE"
    })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.message || 'Erro desconhecido na configuração de usuário';
                throw new Error(msg);
            }
        })
        .catch(err => console.log(err));

    //Deleting user
    fetch("http://localhost:8080/user/" + loggedUser.idUser, {
        method: "DELETE",
    })
        .then(res => {
            if (!res.ok) {
                const msg = data?.message || 'Erro desconhecido na configuração de usuário';
                throw new Error(msg);
            }
        })
        .then(() => {
            alert("Usuário deleteado com sucesso!");
            setTimeout(() => window.location.href = "../pages/login.html", 1000);
        })
        .catch(err => console.log(err));
});
