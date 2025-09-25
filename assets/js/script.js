const textArea = document.querySelector(".text-area");

const checkboxExcludeSpaces = document.getElementById("exclude-spaces");

const characterCountDisplay = document.querySelector(".character-count");
const characterLimitContainer = document.querySelector(
  ".character-limit-container"
);

const errorContainer = document.querySelector(".text-area-container");
const errorTextCharLimit = document.querySelectorAll(".error-character-limit");

const typedCharactersDisplay = document.querySelector(".text-area-char-count");

const checkboxCharacterLimit = document.getElementById("character-limit");
const inputCharacterLimit = document.querySelector(".character-limit-input");

const readingTimeDisplay = document.getElementById("reading-time");

const noSpacesText = document.querySelector(".no-spaces-text");

const totalCharactersDisplay = document.getElementById("total-characters");
const totalWordsDisplay = document.getElementById("total-words");
const totalSentencesDisplay = document.getElementById("total-sentences");

const densityChart = document.querySelector(".density-chart");
const seeMoreBtn = document.querySelector(".see-more-btn");

let showAllLetters = false;

function calculateLetterDensity(text) {
  const cleanText = text.replace(/\s/g, "").toLowerCase();
  const letterCounts = {};
  const totalLetters = cleanText.length;

  for (const char of cleanText) {
    if (char.match(/[a-z]/)) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
  }

  const letterData = Object.entries(letterCounts)
    .map(([letter, count]) => ({
      letter: letter.toUpperCase(),
      count,
      percentage:
        totalLetters > 0 ? ((count / totalLetters) * 100).toFixed(2) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return letterData;
}

function renderLetterDensity(letterData) {
  const lettersToShow = showAllLetters ? letterData : letterData.slice(0, 5);

  densityChart.innerHTML = "";

  if (lettersToShow === 0) {
    document.querySelector(".density-chart-wrapper").classList.remove("active");
    document.querySelector(".letter-density-text").classList.remove("hidden");
    return;
  }

  document.querySelector(".density-chart-wrapper").classList.add("active");
  document.querySelector(".letter-density-text").classList.add("hidden");

  lettersToShow.forEach(({ letter, count, percentage }) => {
    const row = document.createElement("div");
    row.className = "density-chart-row";

    row.innerHTML = `
      <span class="text-preset-4 letter-column">${letter}</span>
      <progress
        value="${percentage}"
        max="100"
        class="density-progress-bar"
      ></progress>
      <span><span>${count}</span> (<span>${percentage}</span>%)</span>
    `;

    densityChart.appendChild(row);
  });

  if (letterData.length > 5) {
    seeMoreBtn.style.display = "flex";
    const buttonText = seeMoreBtn.querySelector("p");

    if (showAllLetters) {
      buttonText.textContent = "See less";
      document.querySelector(".icon-chevron-down").classList.add("hidden");
      document.querySelector(".icon-chevron-up").classList.remove("hidden");
    } else {
      buttonText.textContent = "See more";
      document.querySelector(".icon-chevron-up").classList.add("hidden");
      document.querySelector(".icon-chevron-down").classList.remove("hidden");
    }
  } else {
    seeMoreBtn.style.display = "none";
  }
}

function calculateResults() {
  let text = textArea.value;
  const excludeSpacesEnabled = checkboxExcludeSpaces.checked;
  const characterLimitEnabled = checkboxCharacterLimit.checked;
  const characterLimit = inputCharacterLimit.value;

  let totalCharacters = 0;
  let totalWords = 0;
  let totalSentences = 0;

  let readingTimeMinutes = 0;
  let readingTimeText = "";

  errorTextCharLimit.forEach((el) => {
    el.textContent = characterLimit || 0;
  });

  errorContainer.classList.remove("error-chars-exceeded");
  typedCharactersDisplay.classList.remove("error-text-chars");

  const currentCharacterCount = excludeSpacesEnabled
    ? text.replace(/\s/g, "").length
    : text.length;

  characterCountDisplay.textContent = currentCharacterCount;

  if (characterLimitEnabled) {
    characterLimitContainer.classList.remove("hidden");

    if (characterLimit > 0) {
      if (currentCharacterCount > characterLimit) {
        errorContainer.classList.add("error-chars-exceeded");
        typedCharactersDisplay.classList.add("error-text-chars");
      }

      text = text.slice(0, characterLimit);
    }
  } else {
    characterLimitContainer.classList.add("hidden");
  }

  if (excludeSpacesEnabled) {
    noSpacesText.classList.remove("hidden");

    totalCharacters = text.replace(/\s/g, "").length;
  } else {
    noSpacesText.classList.add("hidden");

    totalCharacters = text.length;
  }

  if (text.trim() === "") {
    totalWords = 0;
  } else {
    totalWords = text.trim().split(/\s+/).length;
  }

  totalSentences = text.split(/[.!?]+/).length - 1;

  // Average reading speed 225 WPM
  const estimatedWords = Math.max(totalWords, Math.floor(totalCharacters / 5));
  readingTimeMinutes = estimatedWords / 225;
  if (readingTimeMinutes < 1) {
    readingTimeText = "<1 minute";
  } else {
    readingTimeMinutes = Math.round(readingTimeMinutes);
    readingTimeText =
      readingTimeMinutes + ` minute${readingTimeMinutes === 1 ? "" : "s"}`;
  }

  readingTimeDisplay.textContent = readingTimeText;

  totalCharactersDisplay.textContent = addCommas(totalCharacters);
  totalWordsDisplay.textContent = addCommas(totalWords);
  totalSentencesDisplay.textContent = addCommas(totalSentences);

  const letterData = calculateLetterDensity(text);
  renderLetterDensity(letterData);
}

function formatCharacterLimit() {
  let value = inputCharacterLimit.value;

  value = value.replace(/\D/g, "");

  let number = parseInt(value, 10);

  if (isNaN(number)) {
    inputCharacterLimit.value = "";
    return;
  }

  if (number > 999) {
    number = 999;
  }

  inputCharacterLimit.value = number.toString();
}

function addCommas(number) {
  return number.toLocaleString("en-us");
}

textArea.addEventListener("input", calculateResults);
checkboxExcludeSpaces.addEventListener("change", calculateResults);
checkboxCharacterLimit.addEventListener("change", calculateResults);
inputCharacterLimit.addEventListener("input", () => {
  formatCharacterLimit();
  calculateResults();
});
seeMoreBtn.addEventListener("click", () => {
  showAllLetters = !showAllLetters;
  calculateResults();
});
