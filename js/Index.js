
function startGame() {
    const chkShuffle = document.getElementById("chk_shufflePhrases");
    const indices = primary_phrases.map((_, i) => i);
    
    if (chkShuffle.checked) {
        const indicesMezclados = indices.sort(() => Math.random() - 0.5);
        indicesMezclados.forEach(i => {
        document.getElementById("divGame").appendChild(createPhrase(i));
        });
    } else {
        indices.forEach(i => {
        document.getElementById("divGame").appendChild(createPhrase(i));
        });
    }
}

async function loadModule(name) {
    //Limpia el juego anterior
    document.getElementById("divGame").innerHTML = "";

    setCategoryName(name);
    document.getElementById("CategoryTitle").textContent = i18n.module + ": " + categoryName;
      
    //Importa dinámicamente el archivo de frases
    await import(`./phrases/${name}.js`).then(module => {
        setPrimaryPhrases(currentLang, module);
        setSecondaryPhrases(targetLang, module);  
        startGame();
    });
}

//Inicializar en español
setInterfaceLanguage("en");

const toggleBtn = document.getElementById("btn_Settings");
const configDiv = document.getElementById("config");

toggleBtn.addEventListener("click", () => {
    if (configDiv.style.display === "none" || configDiv.style.display === "") {
    configDiv.style.display = "block";
    } else {
    configDiv.style.display = "none";
    }
});