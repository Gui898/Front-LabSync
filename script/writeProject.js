let optionsButtons = document.querySelectorAll(".funcs__bt");
let advOptionsButtons = document.querySelectorAll(".funcs__bt__adv");
let fontName = document.getElementById("fontName");
let fontSize = document.getElementById("fontSize");

let titleArea = document.getElementById("titleBox");
let categoryArea = document.getElementById("categoryBox");
let textArea = document.getElementById("textBox");
let usedInstArea = document.getElementById("usedInst");
let usedTechArea = document.getElementById("usedTech");

let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");

const viewProjectButton = document.getElementById("viewProject");
const updateProjectButton = document.getElementById("updateProject");
const publishProjectButton = document.getElementById("publishProject");

//Will find the project by another function comming from draftProjects
let userProjects = JSON.parse(localStorage.getItem("userProjects")) || [];
let projectObj = userProjects[0];

let fontList = ["Arial", "Verdana", "Garamond", "Georgia", "Courier New", "Cursive"];

//initial settings
const initializer = () => {
    //funciton calls for highlighting buttons
    //No highlights for link, lists, undo, redo
    //since they are one time opeartion
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);

    //create options for font names
    fontList.map(value => {
        let option = document.createElement("option");
        option.value = value;
        option.innerHTML = value;
        fontName.appendChild(option);
    });

    //fontSize allow only till 7
    for (let i = 1; i <= 7; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        fontSize.appendChild(option);
    }

    //default size
    fontSize.value = 3;

    //textInputs start
    titleArea.innerHTML = projectObj.title;
    categoryArea.innerHTML = projectObj.category;
    textArea.innerHTML = projectObj.textProjects;
    usedInstArea.innerHTML = projectObj.usedInstruments;
    usedTechArea.innerHTML = projectObj.usedTech;
};

//main logic
const modifyText = (command, defaultUi, value) => {
    //execCommand executes command on selectedText
    document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value
optionsButtons.forEach(button => {
    button.addEventListener("click", () => {
        modifyText(button.id, false, null);
    });
});

//options that require value parameter(ex: colors, fonts...)
advOptionsButtons.forEach((button) => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, button.value);
    });
});

linkButton.addEventListener("click", () => {
    let userLink = prompt("Insira a URL");
    //if link has http then pass directly else add htps
    if (/http/i.test(userLink)) {
        modifyText(linkButton.id, false, userLink);
    } else {
        userLink = "http://" + userLink;
        modifyText(linkButton.id, false, userLink);
    }
});

//highlith clicked button
const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            //needsRemoval = true means only one button should be highlight and other would be normal
            if (needsRemoval) {
                let alreadyActive = false;

                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }

                highlighterRemover(className);
                if (!alreadyActive) {
                    button.classList.add("active");
                }
            } else {
                button.classList.toggle("active");
            }
        });
    });
};

//highlith to remove clicked button
const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};

//UPDATE BUTTON
updateProjectButton.addEventListener("click", (e) => {
    e.preventDefault();

    //object with all update inputs
    const localProjectObj = {
        idProject: projectObj.idProject,
        title: titleArea.innerHTML,
        category: categoryArea.innerHTML,
        textProjects: textArea.innerHTML,
        usedInstruments: usedInstArea.innerHTML,
        usedTech: usedTechArea.innerHTML,
        hasPost: projectObj.hasPost
    };

    //Save on localStorage again, but only that project in the array of projects
    const index = userProjects.findIndex(p => p.idProject === projectObj.idProject);
    if (index !== -1) {
        userProjects[index] = localProjectObj;
    }
    localStorage.setItem("userProjects", JSON.stringify(userProjects));

    fetch("http://localhost:8080/project/" + projectObj.idProject, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localProjectObj)
    })
        .then(async res => {
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = data?.message || 'Erro desconhecido no login';
                throw new Error(msg);
            }
            return data;
        })
        .catch(err => console.log(err.message));
});

window.onload = initializer();