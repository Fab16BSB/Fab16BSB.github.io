function addCoursInfo() {
  const url = window.location.href.split('/');
  const page = (url[url.length - 1].split('.')[0]).length > 0 ? url[url.length - 1].split('.')[0] : "index" ;
  let langue = (localStorage.getItem("langue") == null || TAB[0][localStorage.getItem("langue")] == null ? "french" : localStorage.getItem("langue"));


  // Recuperation de tout les tr de la page
  const rows = document.querySelectorAll(`tr.${page}_cliquable`);
  rows.forEach((row) => {

    // recuperation des info lié au tr
    let isOpen = row.getAttribute("open") === "true";
    const theme = row.getAttribute("data-theme");

    // recupération de tout les td indiquant le theme du cours
    let td = row.querySelector("td.theme");

    // Ajoute le caractère spéciale indiquant que la section peut être déroulé
    if(td.textContent.trim() in COURSINFO[langue]){

      // Ajout de l'image indiquant qu'on peux deroulé la ligne.
      td.innerHTML += `<span class="fleche_deroulante"></span>`;
      let img = td.querySelector(".fleche_deroulante");
  
      // Rendre l'élément cliquable
      row.addEventListener("click", function () {
        let langue = (localStorage.getItem("langue") == null || TAB[0][localStorage.getItem("langue")] == null ? "french" : localStorage.getItem("langue"));
        
        // Si la ligne n'est pas ouverte, on ajoute la nouvelle ligne
        if (!isOpen) {

          let loadInfo = '';

          // Itérer sur les paires clé-valeur du dictionnaire
          for (const [key, value] of Object.entries(COURSINFO[langue][theme])) {
            console.log(`Clé : ${key}`);

            if (typeof value === 'string') {
              // Si c'est une chaîne de caractères, afficher dans un paragraphe
              loadInfo += `<h2>${value}</h2>`;
            } 
            
            else if (typeof value === 'object') {
              loadInfo += `<div> <ul class="detail_cours ${key}">`;

              // Si c'est un objet, itérer sur les paires clé-valeur
              for (const [innerKey, innerValue] of Object.entries(value)) {
                console.log(`  Clé interne : ${innerKey}`);
                loadInfo += `<li>${innerKey} <div class="nomCours">`;
                
                // Traiter la valeur interne selon son type
                if (Array.isArray(innerValue)) {
                  loadInfo += innerValue.map(item => `<span class="keyword">${item}</span>`).join(' ');
                }

                // Format texte (description trouvé plutot qu'une liste de mot clé)
                else {
                  loadInfo += `<p class="description">${innerValue}</p>`;
                }

                loadInfo += "</div></li>"
              }

              loadInfo += `</ul></div>`;
              console.log(loadInfo)
            } 
            
            else {
              // Gérer d'autres types si nécessaire
              console.log('Type non pris en charge ou inconnu.');
            }
          }

          const newRow = document.createElement("tr");
          newRow.innerHTML = `<td colspan='7'>${loadInfo}</td>`; // TODO COLSPAN CALCULER AUTO
          row.parentNode.insertBefore(newRow, row.nextSibling);


          // Rotation de l'image
          if (img) {
            img.style.transform = "rotate(180deg)";
          }
          
          isOpen = true;
          row.setAttribute("open", "true");
        }

        // Si la ligne est déjà ouverte, on la supprime
        else {
          isOpen = false;
          row.removeAttribute("open");
          const newRow = row.nextSibling;
          newRow.remove();

          // Remise en place de l'image
          if (img) {
            img.style.removeProperty("transform");
          }
        }
      });
    }
  });
}




// appel de la fonction pour ajouter l'événement de clic aux lignes cliquables
addCoursInfo();
