document.getElementById("runLogin").addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginObj = {
        username: username,
        password: password
    }

    fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginObj)
    })
    .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            const msg = data?.message || 'Erro desconhecido no login';
            document.getElementById("invalidInputs").style.display = "block";
            throw new Error(msg);
        }else{
            document.getElementById("invalidInputs").style.display = "none";
            document.getElementById("validInputs").style.display = "flex"
        }

        return data;
    })
    .then(user => {
        localStorage.setItem("loggedUser", JSON.stringify(user))
        setTimeout(() => window.location.href = "../index.html", 1500)
    })
    .catch(err => console.log(err.message));
});