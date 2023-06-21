const gallery = document.querySelector(".gallery");
const portfolioSection = document.getElementById("portfolio");
const categoryContainer = document.createElement("div");
const header = document.querySelector("header");

//Affichage des projets
function displayWorks() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((item) => {
        const work = document.createElement("figure");

        const workImage = document.createElement("img");
        workImage.src = item.imageUrl;
        workImage.alt = item.title;
        work.appendChild(workImage);

        const workCaption = document.createElement("figcaption");
        workCaption.innerHTML = item.title;
        work.appendChild(workCaption);

        work.setAttribute("data-category", item.category.name);

        gallery.appendChild(work);
      });
    });
}

//Affichage des catégories
function displayCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const allButton = createCategoryButton("Tous");
      allButton.classList.add("active");
      categoryContainer.appendChild(allButton);

      data.forEach((category) => {
        const categoryButton = createCategoryButton(category.name);
        categoryContainer.appendChild(categoryButton);
      });

      portfolioSection.insertBefore(categoryContainer, gallery);
    });
}

//Filtrer les catégories
function createCategoryButton(text) {
  const categoryButton = document.createElement("button");
  categoryButton.textContent = text;
  categoryContainer.classList.add("category-buttons");
  categoryButton.classList.add("category-button");
  categoryButton.addEventListener("click", () => {
    const works = document.querySelectorAll(".gallery figure");

    const activeButtons = document.querySelectorAll(".category-button.active");
    activeButtons.forEach((button) => button.classList.remove("active"));

    categoryButton.classList.add("active");
    works.forEach((work) => {
      const category = work.getAttribute("data-category");

      if (text === "Tous" || text === category) {
        work.style.display = "block";
      } else {
        work.style.display = "none";
      }
    });
  });

  return categoryButton;
}

function checkToken() {
  const token = localStorage.getItem("token");

  if (token) {
    console.log("Utilisateur authentifié");
    const loginStatus = document.getElementById("login");
    loginStatus.innerHTML = "logout";

    //Création EDITBAR
    const editBar = document.createElement("div");
    editBar.classList.add("edit-bar");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-pen-to-square");
    const text = document.createElement("span");
    text.textContent = "Mode édition";
    const button = document.createElement("button");
    button.textContent = "Publier les changements";
    button.classList.add("btn", "btn-primary");

    // Ajouter les éléments à la barre d'édition
    editBar.appendChild(icon);
    editBar.appendChild(text);
    editBar.appendChild(button);

    // Affichage de la barre EDIT
    header.parentNode.insertBefore(editBar, header);

    //Création bouton MODIFIER
    const editIconText = document.createElement("div");
    editIconText.classList.add("edit-button");
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen-to-square");
    const editText = document.createElement("span");
    editText.classList.add("edit-text");
    editText.textContent = "Modifier";

    //Affichage des élements MODIFIER
    editIconText.appendChild(editIcon);
    editIconText.appendChild(editText);

    //Affichage de la div MODIFIER
    const titleModifier = document.querySelector(".title-modifier");

    // Insertion du bouton "Modifier" après la balise h2 "Mes projets"
    titleModifier.appendChild(editIconText);
  } else {
    console.log("Utilisateur non authentifié");
  }
}

//FONCTION POUR SUPPRIMER LE TOKEN POUR TESTS
function removeToken() {
  localStorage.removeItem("token");
  console.log("Token supprimé");
}

displayWorks();
displayCategories();
checkToken();

// removeToken();
