const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

const save = document.getElementById("registerForm");

save.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("emailAcademico");

    loggedUser.readerOrAuthor = true;
    loggedUser.academicEmail = email.value;

    fetch("http://localhost:8080/user/" + loggedUser.idUser, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loggedUser),
    })
    .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            const msg = data?.message || "Erro desconhecido ao atualizar posts";
            throw new Error(msg);
        }
        return data;
    })
    .then(() => {
        localStorage.removeItem("loggedUser");
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        document.getElementById("validInputs").style.display = "flex";
        setTimeout(() => window.location.href = "../pages/userConfig.html", 2000);
    })
    .catch(err => console.log(err.message));
})