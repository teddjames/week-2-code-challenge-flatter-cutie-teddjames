// Your code here
// 1) Base URL
const BASE_URL = "http://localhost:3000";

// 2) Global variable for the currently displayed character
let currentCharacter = null;

// 3) DOM Selectors
const characterBar = document.getElementById("character-bar");
const detailName = document.getElementById("name");
const detailImage = document.getElementById("image");
const detailVotes = document.getElementById("vote-count");

const votesForm = document.getElementById("votes-form");
const voteInput = document.getElementById("votes");
const resetButton = document.getElementById("reset-btn");

// BONUS: new character form (commented out in HTML by default)
const newCharacterForm = document.getElementById("character-form");
const newCharacterNameInput = document.getElementById("new-name");
const newCharacterImageInput = document.getElementById("image-url");

// ----- FETCH & RENDER FUNCTIONS -----

// Fetch all characters from server
function fetchCharacters() {
  fetch(`${BASE_URL}/characters`)
    .then((response) => response.json())
    .then((characters) => {
      // Clear out the character bar (in case we re-fetch)
      characterBar.innerHTML = "";
      // Render each character's name in the bar
      characters.forEach(renderCharacterName);
      // Display the first character's details on page load
      if (characters.length > 0) {
        renderCharacterDetails(characters[0]);
      }
    })
    .catch((err) => console.error("Error fetching characters:", err));
}

// Render a character's name (as a bubble) in the character bar
function renderCharacterName(character) {
  const span = document.createElement("span");
  span.textContent = character.name;
  span.addEventListener("click", () => {
    renderCharacterDetails(character);
  });
  characterBar.appendChild(span);
}

// Show the selected character's details in the main section
function renderCharacterDetails(character) {
  currentCharacter = character;
  detailName.textContent = character.name;
  detailImage.src = character.image;
  detailVotes.textContent = character.votes;
}

// ----- VOTING & RESET -----

// Handle votes form submission
votesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const additionalVotes = parseInt(voteInput.value);

  if (!isNaN(additionalVotes) && currentCharacter) {
    // Increase the local count
    currentCharacter.votes += additionalVotes;
    // Update UI
    detailVotes.textContent = currentCharacter.votes;
    // (Optional Extra) Persist with PATCH
    updateCharacterVotesOnServer(currentCharacter);

    // Clear form input
    votesForm.reset();
  } else {
    alert("Please enter a valid number!");
  }
});

// Handle reset votes button
resetButton.addEventListener("click", () => {
  if (currentCharacter) {
    currentCharacter.votes = 0;
    detailVotes.textContent = 0;
    // (Optional Extra) Persist with PATCH
    updateCharacterVotesOnServer(currentCharacter);
  }
});

// Optional: PATCH request to persist votes on the server
function updateCharacterVotesOnServer(character) {
  fetch(`${BASE_URL}/characters/${character.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ votes: character.votes }),
  })
    .then((resp) => resp.json())
    .then((updatedChar) => {
      console.log("Votes updated on server:", updatedChar);
    })
    .catch((err) => console.error("Error updating votes:", err));
}

// ----- BONUS: ADD NEW CHARACTER -----
if (newCharacterForm) {
  newCharacterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = newCharacterNameInput.value;
    const image = newCharacterImageInput.value;

    // Create new character object
    const newCharacter = {
      name,
      image,
      votes: 0,
    };

    // (Optional Extra) POST to server
    fetch(`${BASE_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    })
      .then((resp) => resp.json())
      .then((savedCharacter) => {
        // Render in the character bar
        renderCharacterName(savedCharacter);
        // Immediately show details
        renderCharacterDetails(savedCharacter);
        // Clear form
        newCharacterForm.reset();
      })
      .catch((err) => console.error("Error adding new character:", err));
  });
}

// ----- INIT -----
function init() {
  fetchCharacters();
}

init();
