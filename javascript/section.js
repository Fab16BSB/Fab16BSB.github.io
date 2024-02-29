/**
 * Récupère la position d'un élément passé en paramètre
 * @param {Object} element - l'élément
 */ 
function getPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
}

/**
 * Copie un message passé en paramètre dans le presse papier
 * @param {Event} event - l'évenement correspondant au clique
 * @param {String} message - le message à copier
 * @todo Changer le pop-up généré en cas d'alerte par le popover.
 */ 
function copierReference(event, message) {
  event.preventDefault();

  // Récupérer l'élément cliqué
  const button = event.currentTarget;

  navigator.clipboard.writeText(message)
    .then(() => {
      // Obtenir la position de l'élément cliqué
      const position = getPosition(button);

      // Calculer la nouvelle position du popover (par exemple, 10 pixels en dessous)
      const newPositionTop = position.top + button.offsetHeight + 10;
      const newPositionLeft = position.left;

      // Appliquer la nouvelle position au popover
      const popover = document.getElementById('popover');
      popover.style.top = newPositionTop + 'px';
      popover.style.left = newPositionLeft + 104 + 'px';

      // Afficher le popover
      popover.style.display = 'block';

      // Masquer le popover après un certain délai (par exemple, 2000 ms)
      setTimeout(() => {
        popover.style.display = 'none';
      }, 2000);
    })
    .catch((error) => {
      console.error("Erreur lors de la copie dans le presse-papiers : ", error);
      alert("Une erreur s'est produite lors de la copie dans le presse-papiers."); // TODO CHANGER LE TEXTE DU POPOVER
    });
}



/**
 * Charge les information de la section dynamiquement via un tableau d'information
 * @throws toutes erreurs non liées au chargement de la page
 */ 
function loadSection() {
	
  // verification de l'existance des infos
  try {

  const url = window.location.href.split('/');
  const page = (url[url.length - 1].split('.')[0]).length > 0 ? url[url.length - 1].split('.')[0] : "index" ;

    const section = document.getElementById("section");
    let monInnerHtml = "";

    let langue = (localStorage.getItem("langue") == null || TAB[0][localStorage.getItem("langue")] == null ? "french" : localStorage.getItem("langue"));

    // Pour chaque tableau d'info trouvé
    for (const tab of TAB[0][langue]) {
        
        // afficher le nom de celui-ci si necessaire
        monInnerHtml += tab?.name ? `<h2> ${tab.name} </h2>` : "";

        // afficher la legende de celui-ci si necessaire
        monInnerHtml += tab?.legend ? `<p class="legende"> ${tab.legend} </p>` : "";
  	    
        // ouverture de tableau
        monInnerHtml += `<table class="${page}"> <thead> <tr>`;
  	    
        // Ajout des en-têtes
        tab.label.forEach(element => monInnerHtml += `<th> ${element}  </th>`);
        monInnerHtml += `</tr>  </thead> <tbody>`

        // Ajout des cellules
        for (const [i, entry] of tab.info.entries()) {

          // Ajout de l'attribut data-id pour identifier chaque ligne du tableau
          monInnerHtml += `<tr class="${page}_cliquable" data-id="${i}" data-theme="${entry.theme || ''}" open="false">`;

          for (const param in entry) {
            monInnerHtml += ` <td class=${param}>  ${entry[param]} </td> `
          }

          monInnerHtml += `</tr>`;
        }

        // fermeture du tableau
        monInnerHtml += " </tbody> </table>";
      }

      // injection dans la page
      section.innerHTML = monInnerHtml;

  }
  catch (error) {

    if (error instanceof ReferenceError) {
      console.log("Les informations pour cette page n'existe pas !\nLa page sera donc chargé statiquement.")
    }
    else {
      throw error;
    }
  }
}




loadSection();
