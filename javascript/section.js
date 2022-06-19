function loadSection() {
	
  // verification de l'existance des infos
  try {

    const section = document.getElementById("section");
    let monInnerHtml = "";

    let langue = localStorage.getItem("langue");
    console.log(TAB, TAB{0], TAB[0][langue])
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
        for (const entry of tab.info) {
          monInnerHtml += `<tr>`;

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
