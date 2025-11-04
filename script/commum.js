//SHOWING THE NAME
const userKey = "loggedUser";
const userNameHeader = document.getElementById("userName");

userNameHeader.innerText = JSON.parse(localStorage.getItem(userKey)).name || " ";

//VOICE RECOGNITION
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const commandMap = {
    "entrar no meu perfil": "../pages/userConfig.html",
    "voltar para a página inicial": "../index.html",
    "entrar nos favoritos": "../pages/favorites.html",
    "entrar nos rascunhos": "../pages/projectDrafts.html",
    "quero ser autor": "../pages/beAnAuthor.html"
}

recognition.lang = 'pt-Br';
recognition.start();

recognition.addEventListener('result', onSpeak);

function onSpeak(e) {
    speech = e.results[0][0].transcript;
    speechFunc(speech);
}

function speechFunc(speech){
    const normalize = speech.toLowerCase();

    for(command in commandMap){
        if(normalize.includes(command)){
            const destination = commandMap[command];
            window.location.href = destination
            return;
        }
    }
}

recognition.addEventListener('end', () =>{
    recognition.start();
});