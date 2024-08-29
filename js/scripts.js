const charactersContainer = document.querySelector(".characters-list");

const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");

let charactersPage = [];
let currentPage = 1;
const itemsPerPage = 6;

async function fetchCharacters() {
  charactersContainer.innerHTML = "";

  try {
    const response = await api.get("/character");
    charactersPage = response.data.results;

    console.log(charactersPage);

    displayCharacters();
    updatePaginationButtons();
  } catch (error) {
    console.error("Erro ao criar os cards:", error);
  }
}

fetchCharacters();

function displayCharacters() {
  charactersContainer.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const charactersToDisplay = charactersPage.slice(start, end);

  charactersToDisplay.forEach((character) => {
    const charactersCard = document.createElement("div");
    charactersCard.classList.add("card");

    charactersCard.innerHTML = `
      <div data-bs-toggle="modal" data-bs-target="#exampleModal">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${
                character.image
              }" class="img-fluid rounded-start" alt="...">
            </div>

            <div class="col-md-8 d-flex">
              <div class="card-body pb-0 d-flex flex-column justify-content-center ">
                <h3>${character.name}</h3>
                
                <p>${characterStatus(character.status)} ${character.status} - ${character.species}</p>
              </div>
            </div>  
          </div>
      </div>
    `;
    charactersContainer.appendChild(charactersCard);

    charactersCard.addEventListener("click", () => {
      const modal = document.getElementById("exampleModal");
      const modalTitle = modal.querySelector(".modal-title");
      const modalBody = modal.querySelector(".modal-body");

      modalTitle.textContent = character.name;
      modalBody.innerHTML = `
        <p>Status: ${character.status}</p>
        <p>Species: ${character.species}</p>
        <p>Gender: ${character.gender}</p>
        <p>Origin: ${character.origin.name}</p>
        <p>Type: ${character.type}</p>
        <p>Last known location: ${character.location.name}</p>
      `;
    });
  });

  updatePaginationButtons();
}

function characterStatus(status) {
  switch (status) {
    case "Alive":
      return "🟢";
    case "Dead":
      return "🔴";
    default:
      return "⚪";
  }
}

prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayCharacters();
  }
});

nextPage.addEventListener("click", () => {
  const totalPages = Math.ceil(charactersPage.length / itemsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    displayCharacters();
  }
});

function updatePaginationButtons(filteredLength) {
  const totalPages = Math.ceil(charactersPage.length / itemsPerPage);

  if (filteredLength < itemsPerPage || searchInput.value !== "") {
    prevPage.disabled = true;
    nextPage.disabled = true;
  } else {
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
  }
}



const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input",characterSearch);

function characterSearch() {
  const queryCharacter = searchInput.value.toLowerCase();

  const filteredCharacters = charactersPage.filter(character =>
    character.name.toLowerCase().includes(queryCharacter)
  );

  displayFilteredCharacters(filteredCharacters);

  updatePaginationButtons(filteredCharacters.length);
}

function displayFilteredCharacters(filteredCharacters) {
  charactersContainer.innerHTML = "";

  if (filteredCharacters.length === 0) {
    charactersContainer.innerHTML = `<p class="text-light">Nenhum personagem com esse nome encontrado.</p>`;
    return;
  }

  filteredCharacters.forEach((character) => {
    const charactersCard = document.createElement("div");
    charactersCard.classList.add("card");

    charactersCard.innerHTML = `
      <div data-bs-toggle="modal" data-bs-target="#exampleModal">
          <div class="row g-0">
              <div class="col-md-4">
                  <img src="${character.image}" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8 d-flex">
                <div class="card-body pb-0 d-flex flex-column justify-content-center ">
                  <h3>${character.name}</h3>
                  <p>${characterStatus(character.status)} ${character.status} - ${character.species}</p>
                </div>
              </div>  
          </div>
      </div>
    `;
    charactersContainer.appendChild(charactersCard);

    charactersCard.addEventListener("click", () => {
      const modal = document.getElementById("exampleModal");
      const modalTitle = modal.querySelector(".modal-title");
      const modalBody = modal.querySelector(".modal-body");

      modalTitle.textContent = character.name;
      modalBody.innerHTML = `
        <p>Species: ${character.species}</p>
        <p>Gender: ${character.gender}</p>
        <p>Origin: ${character.origin.name}</p>
        <p>Type: ${character.type}</p>
        <p>Last known location: ${character.location.name}</p>
      `;
    });
  });
}
