function modifyTdContent() {
  const url = window.location.href.split('/');
  const page = (url[url.length - 1].split('.')[0]).length > 0 ? url[url.length - 1].split('.')[0] : "index";

  const rows = document.querySelectorAll(`tr.${page}_cliquable`);
  rows.forEach((row) => {
    const theme = row.getAttribute("data-theme");
    const tds = row.getElementsByTagName("td");

    for (let i = 0; i < tds.length; i++) {
      const td = tds[i];
      if (td.textContent.trim() === theme) {
        td.innerHTML += `<img src="Image/fleche-vers-le-bas.png">`;
      }
    }
  });
}




function addCoursInfo() {
  const url = window.location.href.split('/');
  const page = (url[url.length - 1].split('.')[0]).length > 0 ? url[url.length - 1].split('.')[0] : "index" ;

  // Ajoute le caractère spéciale indiquant que la section peut être déroulé
  modifyTdContent();

  // Rend la ligne cliquable
  const rows = document.querySelectorAll(`tr.${page}_cliquable`);
  rows.forEach((row) => {
    let isOpen = row.getAttribute("open") === "true";
    const theme = row.getAttribute("data-theme");

    const tds = row.getElementsByTagName("td");
    let img = null;
    for (let i = 0; i < tds.length; i++) {
      const td = tds[i];
      if (td.textContent.trim() === theme) {
        img = td.querySelector("img");
        break;
      }
    }

    row.addEventListener("click", function () {
      let langue = (localStorage.getItem("langue") == null || TAB[0][localStorage.getItem("langue")] == null ? "french" : localStorage.getItem("langue"));
      
      // Si la ligne n'est pas ouverte, on ajoute la nouvelle ligne
      if (!isOpen) {
        // Création de la liste énumérée
        let listItems = '';
        COURSINFO[langue][theme].forEach(info => {
          listItems += `<li>${info}</li>`;
        });
        const list = `<ol class="detail_cours" style="text-align:left;">${listItems}</ol>`;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `<td colspan='6'>${list}</td>`;
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
  });
}




// appel de la fonction pour ajouter l'événement de clic aux lignes cliquables
addCoursInfo();
