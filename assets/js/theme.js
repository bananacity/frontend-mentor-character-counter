const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const themeBtn = document.querySelector(".theme-btn");

const logoImg = document.querySelector(".logo");
const themeIcon = document.querySelector(".theme-btn-icon");

let selectedTheme;

function handleThemeChange(e) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    selectedTheme = savedTheme;
  } else {
    if (e.matches) {
      selectedTheme = "dark";
    } else {
      selectedTheme = "light";
    }
  }

  document.documentElement.setAttribute("data-theme", selectedTheme);

  // Change images
  if (selectedTheme === "light") {
    logoImg.src = "../images/logo-light-theme.svg";
    themeIcon.src = "../images/icon-moon.svg";
  } else {
    logoImg.src = "../images/logo-dark-theme.svg";
    themeIcon.src = "../images/icon-sun.svg";
  }
}

function toggleTheme() {
  selectedTheme = selectedTheme === "dark" ? "light" : "dark";

  localStorage.setItem("theme", selectedTheme);

  handleThemeChange();
}

mediaQuery.addEventListener("change", handleThemeChange);

// Initial page load
handleThemeChange(mediaQuery);

themeBtn.addEventListener("click", toggleTheme);
