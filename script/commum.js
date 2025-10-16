const userKey = "loggedUser";
const userNameHeader = document.getElementById("userName");

userNameHeader.innerText = JSON.parse(localStorage.getItem(userKey)).name;