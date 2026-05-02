let i18n = {};
let currentLang = "en";
let targetLang = "es";
let categoryName = "";
let primary_phrases = [];
let secondary_phrases = [];

//CONFIG FUNCTIONS
async function setInterfaceLanguage(lang) {
    await import(`./languages/${lang}.js`).then(module => {
    i18n = module[`language_${lang.toUpperCase()}`];
    
    document.title = i18n.title;
    document.querySelector("#btn_Settings").textContent = i18n.settings;
    document.querySelector("#lbl_Language").textContent = i18n.language;
    document.querySelector("#lbl_SecondLanguage").textContent = i18n.lang2learn;
    document.querySelector("#lbl_shufflePhrases").textContent = i18n.shufflePhrases;
    document.querySelector("#lbl_showIndexPhrases").textContent = i18n.showIndexPhrases;
    document.querySelector("#lbl_omitSpecialChars").textContent = i18n.omitSpecialChars;
    document.querySelector("#lbl_Module").textContent = i18n.module;
    document.querySelector("h2").textContent = i18n.gameTitle;
    document.querySelector("#menu button:nth-child(1)").textContent = i18n.modules.general;
    document.querySelector("#menu button:nth-child(2)").textContent = i18n.modules.cafeteria;
    document.querySelector("#menu button:nth-child(3)").textContent = i18n.modules.family_profession;
    document.querySelector("#menu button:nth-child(4)").textContent = i18n.modules.restaurant;
    document.querySelector("#menu button:nth-child(5)").textContent = i18n.modules.market;
    document.querySelector("#menu button:nth-child(6)").textContent = i18n.modules.health;
    });
}

function setPrimaryPhrases(lang, module) {
    switch (lang) {
    case "es":
        primary_phrases = module.phrases_ES;
        break;
    case "en":
        primary_phrases = module.phrases_EN;
        break;
    case "de":
        primary_phrases = module.phrases_DE;
        break;
    case "it":
        primary_phrases = module.phrases_IT;
        break;
    case "pt":
        primary_phrases = module.phrases_PT;
        break;
    case "fr":
        primary_phrases = module.phrases_FR;
        break;
    default:
        console.log("Idioma no soportado");
    }
}

function setSecondaryPhrases(lang, module) {
    switch (lang) {
    case "es":
        secondary_phrases = module.phrases_ES;
    break;
    case "en":
        secondary_phrases = module.phrases_EN;
    break;
    case "de":
        secondary_phrases = module.phrases_DE;
    break;
    case "it":
        secondary_phrases = module.phrases_IT;
    break;
    case "pt":
        secondary_phrases = module.phrases_PT;
    break;
    case "fr":
        secondary_phrases = module.phrases_FR;
    break;
    default:
        console.log("Idioma no soportado");
    }
}    

function setCategoryName(catName) {
    switch (catName) {
    case "general":
        categoryName = i18n.modules.general;
    break;
    case "cafeteria":
        categoryName = i18n.modules.cafeteria;
    break;
    case "family_profession":
        categoryName = i18n.modules.family_profession;
    break;
    case "restaurant":
        categoryName = i18n.modules.restaurant;
    break;
    case "market":
        categoryName = i18n.modules.market;
    break;
    case "health":
        categoryName = i18n.modules.health;
    break;
    }
}

function changeLanguage(lang) {
    //Limpia el juego anterior
    document.getElementById("divGame").innerHTML = "";
    document.getElementById("CategoryTitle").textContent = "";

    currentLang = lang;
    setInterfaceLanguage(lang);
}

function changeTargetLanguage(lang) {
    //Limpia el juego anterior
    document.getElementById("divGame").innerHTML = "";
    document.getElementById("CategoryTitle").textContent = "";

    targetLang = lang;
}


//GAME FUNCTIONS
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function normalize(text) {
    return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function omitSpecials(text) {
    const chkOmit = document.getElementById("chk_omitSpecialChars");

    if (chkOmit.checked) {
        //Spanish
        text = text.replaceAll("á","a");
        text = text.replaceAll("é","e");
        text = text.replaceAll("í","i");
        text = text.replaceAll("ó","o");
        text = text.replaceAll("ú","u");
        
        //English
        text = text.replaceAll("¿","");
        text = text.replaceAll("’","");
    }

    return text;
}

function createPhrase(index) {
    const chkShowIndex = document.getElementById("chk_showIndexPhrases");

    const contenedor = document.createElement("div");
    contenedor.className = "frase";

    const primaryDiv = document.createElement("div");
    primaryDiv.className = "primaryDiv";

    
    if (chkShowIndex.checked) {
        primaryDiv.textContent = "[" + index + "] - "  + primary_phrases[index];
    } else {
        primaryDiv.textContent = primary_phrases[index];
    }
    
    contenedor.appendChild(primaryDiv);

    const palabrasOriginal = omitSpecials(secondary_phrases[index]).split(" ");
    const palabrasMezcladas = shuffle([...palabrasOriginal]);
    
    const secondaryDiv = document.createElement("div");
    secondaryDiv.className = "secondaryDiv";
    secondaryDiv.textContent = "";
    contenedor.appendChild(secondaryDiv);

    palabrasMezcladas.forEach((palabra, j) => {
        const chip = document.createElement("span");
        chip.className = "wordChip";
        chip.id = `word_${index}_${j}`;
        chip.draggable = true;
        chip.dataset.word = palabra;
        chip.textContent = palabra;

        chip.addEventListener("dragstart", event => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", event.target.id);
        });

        chip.addEventListener("click", () => {
            if (chip.parentElement === secondaryDiv) {
                answerDiv.appendChild(chip);
            } else if (chip.parentElement === answerDiv) {
                secondaryDiv.appendChild(chip);
            }
            updateAnswerPlaceholder();
        });

        secondaryDiv.appendChild(chip);
    });

    const answerDiv = document.createElement("div");
    answerDiv.className = "answerDiv";
    contenedor.appendChild(answerDiv);

    const placeholderText = i18n.dragHere || "Drag words here";
    const placeholder = document.createElement("span");
    placeholder.className = "drop-placeholder";
    placeholder.textContent = placeholderText;
    answerDiv.appendChild(placeholder);


    function updateAnswerPlaceholder() {
        const hasWord = answerDiv.querySelector(".wordChip");
        const placeholderEl = answerDiv.querySelector(".drop-placeholder");

        if (hasWord) {
            if (placeholderEl) placeholderEl.remove();
        } else if (!placeholderEl) {
            answerDiv.textContent = "";
            answerDiv.appendChild(placeholder);
        }
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function handleDrop(event, target) {
        event.preventDefault();
        const id = event.dataTransfer.getData("text/plain");
        const dragged = document.getElementById(id);
        if (dragged && target !== dragged.parentElement) {
            target.appendChild(dragged);
            updateAnswerPlaceholder();
        }
    }

    [secondaryDiv, answerDiv].forEach(dropZone => {
        dropZone.addEventListener("dragover", allowDrop);
        dropZone.addEventListener("dragenter", event => {
            event.preventDefault();
            dropZone.classList.add("dragover");
        });
        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("dragover");
        });
        dropZone.addEventListener("drop", event => {
            dropZone.classList.remove("dragover");
            handleDrop(event, dropZone);
        });
    });

    const inputRow = document.createElement("div");
    inputRow.className = "input-row";

    const boton = document.createElement("button");
    boton.id = "btnCheck_" + index;
    boton.textContent = i18n.checkButton;
    inputRow.appendChild(boton);

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.id = "btnReset_" + index;
    resetButton.textContent = i18n.resetButton || "Reset";
    inputRow.appendChild(resetButton);

    const showAnswerDiv = document.createElement("div");
    showAnswerDiv.className = "showAnswerDiv";
    showAnswerDiv.textContent = omitSpecials(secondary_phrases[index]);

    const showAnswerButton = document.createElement("button");
    showAnswerDiv.style.display = "none";
    showAnswerButton.type = "button";
    showAnswerButton.id = "btnShowAnswer_" + index;
    showAnswerButton.textContent = i18n.showAnswerButton || "Show Answer";
    inputRow.appendChild(showAnswerButton);

    const resultado = document.createElement("div");
    inputRow.appendChild(resultado);

    function resetAnswer() {
        const chips = [...answerDiv.querySelectorAll(".wordChip")];
        chips.forEach(chip => secondaryDiv.appendChild(chip));
        updateAnswerPlaceholder();
        resultado.textContent = "";
        resultado.className = "";
    }

    boton.addEventListener("click", () => {
        const respuestaUsuario = [...answerDiv.querySelectorAll(".wordChip")]
            .map(chip => normalize(chip.dataset.word));
        const respuestaCorrecta = palabrasOriginal.map(word => normalize(word));

        if (respuestaUsuario.length === respuestaCorrecta.length && respuestaUsuario.every((word, i) => word === respuestaCorrecta[i])) {
            resultado.textContent = i18n.correct;
            resultado.className = "correct";
        } else {
            resultado.textContent = i18n.incorrect;
            resultado.className = "incorrect";
        }
    });

    showAnswerButton.addEventListener("click", () => {
        if (showAnswerDiv.style.display === "none") {
            showAnswerDiv.style.display = "block";
            showAnswerButton.textContent = i18n.hideAnswerButton || "Hide Answer";
        } else {
            showAnswerDiv.style.display = "none";
            showAnswerButton.textContent = i18n.showAnswerButton || "Show Answer";
        }
    });

    resetButton.addEventListener("click", resetAnswer);
    contenedor.appendChild(inputRow);
    contenedor.appendChild(showAnswerDiv);

    return contenedor;
}
