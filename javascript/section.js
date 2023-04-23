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
  	    
        // ouverture de tableau
        monInnerHtml += "<table> <thead> <tr>";
  	    
        // Ajout des en-têtes
        tab.label.forEach(element => monInnerHtml += `<th> ${element}  </th>`);
        monInnerHtml += `</tr>  </thead> <tbody>`

        // Ajout des cellules
        for (const [i, entry] of tab.info.entries()) {

          // Ajout de l'attribut data-id pour identifier chaque ligne du tableau
          monInnerHtml += `<tr class="${page}_cliquable" data-id="${i}" data-theme="${entry.theme || ''}" open="false">`;

          for (const param in entry) {
            monInnerHtml += ` <td>  ${entry[param]} </td> `
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
