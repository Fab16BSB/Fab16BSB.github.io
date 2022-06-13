const headerTag = document.getElementById("header");
headerTag.innerHTML = `
	<h1> POIRIER FABIEN </h1>
	<p> <img src="Image/grade_2.png" alt="diplome_icon"/> Doctorant 3ème année <img src="Image/localisation_2.png" alt="localisation_icon"/> France </p>
	<p id="interets"><i> Intérêts :  Jeux vidéo, Programmation, Série, Manga-Animé </i></p> 

	<nav class="scrollmenu">
		<ul>
			<li> <a id="index" class="unSelected" href="index.html"> Formations </a> </li>
			<li> <a id="experience" class="unSelected" href="experience.html"> Expériences </a> </li>
			<li> <a id="publication" class="unSelected" href="publication.html"> Publications </a> </li>
			<li> <a id="prix" class="unSelected" href="prix.html"> Prix </a> </li>
		 	<li> <a id="enseignement" class="unSelected" href="enseignement.html"> Enseignements </a> </li>
		  	<!--<li> <a href=""> Projets </a> </li>-->
		  	<!--<li> <a href=""> Langues </a> </li>-->
		</ul>
	</nav>
`



function selectedPage() {
  const url = window.location.href.split('/');
  const page = url[url.length - 1].split('.')[0];
  document.getElementById(page).classList = "selected";
}


selectedPage();

