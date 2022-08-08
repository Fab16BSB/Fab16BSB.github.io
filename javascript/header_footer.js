function loadHeader(){

	const langue = (localStorage.getItem("langue") == null ? "french" : localStorage.getItem("langue"));
	const headerTag = document.getElementById("header");
	const info = HeaderInfo[langue];
  	const mode = localStorage.getItem("dark-mode");
  	let modeIcon = mode == "enabled" ? "light_mode" : "dark_mode";
  	let pathIcon = "Image/" + modeIcon + ".png"

	headerTag.innerHTML = `
	<h1> POIRIER FABIEN </h1>
	<p> <img src="Image/grade_2.png" alt="diplome_icon"/> ${info.status} <img src="Image/localisation_2.png" alt="localisation_icon"/> ${info.lieu} </p>
	<p id="interets"><i> ${info.interet} </i></p> 

	<nav>

		<ul id="setting">
			<li class="selected"> <span class="french"  onclick="setLangue();"> <img src="Image/france.png" class="french" alt="french"/> </span> </li>
			<li> <span class="english" onclick="setLangue();"> <img src="Image/anglais.png" class="english" alt="english"/> </span> </li>
			<li> <span class="spanish" onclick="setLangue();"> <img src="Image/espagne.png" class="spanish" alt="spanish"/> </span> </li>
			<li> <span id="changeTheme" class="unSelected"> <img src=${pathIcon} alt=${modeIcon}/> </span> </li>
		</ul>

		<div id="principalMenu">
			<ul id="menu">
				<li> <a id="index" href="index.html"> ${info.menu[0]} </a> </li>
				<li> <a id="experience" href="experience.html"> ${info.menu[1]} </a> </li>
				<li> <a id="publication" href="publication.html"> ${info.menu[2]} </a> </li>
				<li> <a id="prix" href="prix.html"> ${info.menu[3]} </a> </li>
				<li> <a id="enseignement" href="enseignement.html"> ${info.menu[4]} </a> </li>
				<!--<li> <a href=""> Projets </a> </li>-->  			
			</ul>
		</div>
	</nav>`

}

function loadFooter(){

  const langue = (localStorage.getItem("langue") == null ? "french" : localStorage.getItem("langue"));
  const headerTag = document.getElementById("footer");
  const info = FooterInfo[langue];

  headerTag.innerHTML = `
      <table class="reseaux">
          <thead>
            <tr>
              <th colspan="4" id="tabReseauFirst"> ${info.tableau[0]} </th>
              <th colspan="3" id="tabReseauLast"> ${info.tableau[1]} </th>
            </tr>
          </thead>

            <tr>
              <td> <a href=""> <div style="height:100%;width:100%"> <img src="Image/mail_icon.png" alt="mail"> </div> </a>  </td>

              <td> <a href="https://github.com/Fab16BSB" title="https://github.com/Fab16BSB"> <div style="height:100%;width:100%"> <img src="Image/github_icon.png" alt="github"> </div> </a>  </td>

              <td> <a href="https://medium.com/@fab.16" title="https://medium.com/@fab.16"> <div style="height:100%;width:100%"> <img src="Image/medium_icon.png" alt="medium"> </div> </a>  </td>

              <td> <a href="https://www.youtube.com/channel/UCHS2xgITwh7olsnznmq8o0A" title="https://www.youtube.com/channel/UCHS2xgITwh7olsnznmq8o0A"> <div style="height:100%;width:100%"> <img src="Image/youtube_icon.png" alt="youtube">  </div> </a> </td>

              <td> <a href="https://discord.gg/pgEUk9xVKe" title="https://discord.gg/pgEUk9xVKe"> <div style="height:100%;width:100%"> <img src="Image/discord_icon.png" alt="discord"> </div> </a> </td>

              <td> <a href="https://github.com/override-community" title="https://github.com/override-community"> <div style="height:100%;width:100%"> <img src="Image/github_icon.png" alt="github"> </div> </a>  </td>

              <td> <a href="https://medium.com/@overridecommunuty" title="https://medium.com/@overridecommunuty"> <div style="height:100%;width:100%"> <img src="Image/medium_icon.png" alt="medium"> </div> </a> </td>
            </tr>
        </table>

        <p> <img id="htmlIcon" src="Image/html5.png" alt="HTML5"/> <img id="cssIcon" src="Image/css3.png" alt="CSS3"/> <img id="javascriptIcon" src="Image/javascript.png" alt="javascript"/> <img id="w3cValidation" src="Image/w3c.gif" alt="W3C Validation"/> <br>
          ${info.texte}
        </p>
`
  changeTheme();

}

function selectedPage() {
  const url = window.location.href.split('/');
  const page = (url[url.length - 1].split('.')[0]).length > 0 ? url[url.length - 1].split('.')[0] : "index" ;
  document.getElementById(page).classList = "selected";
}

function setLangue(){
  let langueDispo = ["french", "spanish", "english"]

  window.onclick = function(e) {
    /* console.log('clickOn', e.srcElement.className) TO DEBUG */

    let info = e.srcElement.className;

    if (langueDispo.includes(info)){      
        localStorage.setItem("langue", info);

        loadHeader();
        selectLangue();
        loadSection();
        loadFooter();

    }
  }
}

function selectLangue(){
	let oldButtom = document.querySelector("li.selected");
  oldButtom.classList = "unSelected";
     
  let langue = (localStorage.getItem("langue") == null ? "french" : localStorage.getItem("langue"));
  let newButtom = document.getElementsByClassName(langue);
  newButtom[0].parentNode.classList = "selected";
  selectedPage();
}



function changeTheme(){
  const toggleBtn = document.getElementById("changeTheme");
  const body = document.getElementById("body");
  let darkMode = localStorage.getItem("dark-mode");

  const enableDarkMode = () => {
    body.classList.add("dark-theme");
    toggleBtn.innerHTML=`<img src="Image/light_mode.png" alt="light_mode"/>`;
    localStorage.setItem("dark-mode", "enabled");
  };

  const disableDarkMode = () => {
    body.classList.remove("dark-theme");
    toggleBtn.innerHTML=`<img src="Image/dark_mode.png" alt="dark_mode"/>`;
    localStorage.setItem("dark-mode", "disabled");
  };

  
  if (darkMode === "enabled") {
    enableDarkMode(); // set state of darkMode on page load
  }
  
  toggleBtn.addEventListener("click", (e) => {
    darkMode = (localStorage.getItem("dark-mode") == null ? "disabled" : localStorage.getItem("dark-mode")); // update darkMode when clicked

    if (darkMode === "disabled") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
}


loadHeader();
selectedPage();
selectLangue();
loadFooter();


