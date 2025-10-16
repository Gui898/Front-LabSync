let loggedUser = JSON.parse(localStorage.getItem("loggedUser")) || {
    name: "",
    surname: "",
    email: "",
    password: "",
    aboutMe: ""
};

const userName = document.getElementById("username");
const surname = document.getElementById("surname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const aboutMe = document.getElementById("aboutMe");

userName.value = loggedUser.name;
surname.value = loggedUser.surname;
email.value = loggedUser.email;
password.value = loggedUser.password;
aboutMe.value = loggedUser.aboutMe;

document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault(); 

    loggedUser = {
        name: userName.value,
        surname: surname.value,
        email: email.value,
        password: password.value,
        aboutMe: aboutMe.value
    };

    // Salva novamente no localStorage
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

    fetch("http://localhost:8080/user/" + loggedUser.idUser, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(JSON.parse(localStorage.getItem("loggedUser")))
    })
    .then(async res => {})


})