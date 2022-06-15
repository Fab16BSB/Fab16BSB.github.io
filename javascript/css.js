const toggleBtn = document.getElementById("changeTheme");
const body = document.getElementById("body");
let darkMode = localStorage.getItem("dark-mode");

const enableDarkMode = () => {
  body.classList.add("dark-theme");
  toggleBtn.innerHTML="White Mode";
  localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
  body.classList.remove("dark-theme");
  toggleBtn.innerHTML="Dark Mode";
  localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode(); // set state of darkMode on page load
}

toggleBtn.addEventListener("click", (e) => {
  darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
  if (darkMode === "disabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
