
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

function selectButton(btn) {
  // quitar la clase 'active' de todos los botones
  const buttons = document.querySelectorAll('#menu button');
  buttons.forEach(b => b.classList.remove('active'));

  // agregar la clase 'active' al botón presionado
  btn.classList.add('active');
}

