document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let academicEmail = null;
    let isAuthor = document.getElementById('authorPoint').checked;

    if(isAuthor){
        academicEmail = document.getElementById('email_academico').value;
    }else{
        isAuthor = false;
    }

    const user = {
        name: name,
        surname: surname,
        email: email,
        password: password,
        academicEmail: academicEmail,
        readerOrAuthor: isAuthor,
        AboutMe: "",
    }

    fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(user)  
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao enviar");
      }
      return response.json();
    })
    .then((result) => {
      alert("Usuário criado: " + result.name);
    })
    .catch((err) => {
      console.error("Erro no fetch:", err);
      alert("Erro na requisição");
    });
});