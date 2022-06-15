function switchMode(){
	const switchThemeBtn = document.querySelector("#changeTheme");
	let toggleTheme = 0;
	switchThemeBtn.addEventListener('click', () => {

		if(toggleTheme === 0) {
			document.getElementById("changeTheme").innerHTML="White Mode";
			document.documentElement.style.setProperty("--ecriture_color", "white");
			document.documentElement.style.setProperty("--background_color", "#101010");
			document.documentElement.style.setProperty("--td_color", "#404040");
			toggleTheme++;
		}
		else {
			document.getElementById("changeTheme").innerHTML="Dark Mode";
			document.documentElement.style.setProperty("--ecriture_color", "black");
			document.documentElement.style.setProperty("--background_color", "white");
			document.documentElement.style.setProperty("--td_color", "#f2f2f2");
			toggleTheme--;
		}
			


	})
}

switchMode();