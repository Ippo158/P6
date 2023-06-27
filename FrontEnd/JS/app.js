const gallery = document.querySelector(".gallery");
const modalImages = document.querySelector(".modal-images");
const portfolioSection = document.getElementById("portfolio");
const categoryContainer = document.createElement("div");
const header = document.querySelector("header");
// Création du bouton "Modifier" pour titleModifier
const editIconTextTitle = createEditButton("Modifier");
// Création du bouton "Modifier" pour imageModifier
const editIconTextImage = createEditButton("Modifier");
// Affichage des boutons "Modifier"
const titleModifier = document.querySelector(".title-modifier");
const imageModifier = document.querySelector("figcaption");
const modal = document.querySelector(".modal");
const loginStatus = document.getElementById("login");
const token = localStorage.getItem("token");

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

        // Cloner le travail et l'ajouter à la div "modal-images"
        const workClone = work.cloneNode(true);
        modalImages.appendChild(workClone);

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

function displayEdit() {
  if (token) {
    console.log("Utilisateur authentifié");
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

    //Affichage des boutons MODIFIER
    titleModifier.appendChild(editIconTextTitle);
    imageModifier.appendChild(editIconTextImage);
  } else {
    console.log("Utilisateur non authentifié");
  }
}

function createEditButton(text) {
  const editIconText = document.createElement("div");
  editIconText.classList.add("edit-button");

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square");

  const editText = document.createElement("span");
  editText.classList.add("edit-text");
  editText.textContent = text;

  editIconText.appendChild(editIcon);
  editIconText.appendChild(editText);

  return editIconText;
}

// Affichage de la modale
function displayModal() {
  const editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", () => {
      modal.style.visibility = "visible";

      const modalFigcaptions = document.querySelectorAll(
        ".modal-images figcaption"
      );

      modalFigcaptions.forEach((figcaption) => {
        figcaption.textContent = "éditer";
      });
    });
  });
}

// Affichage de la modale
// function displayModal() {
//   const editButtons = document.querySelectorAll(".edit-button");

//   editButtons.forEach((editButton) => {
//     editButton.addEventListener("click", () => {
//       modal.style.visibility = "visible";

//       const modalFigures = document.querySelectorAll(".modal-images figure");

//       modalFigures.forEach((figure) => {
//         const deleteIcon = document.createElement("i");
//         deleteIcon.classList.add("fa-regular", "fa-trash-can");
//         figure.appendChild(deleteIcon);

//         const figcaption = document.createElement("figcaption");
//         figcaption.textContent = "Éditer";
//         figure.appendChild(figcaption);
//       });
//     });
//   });
// }


//Fermeture de la modale
function closeModal() {
  const closeModalButton = document.querySelector(".close-button");

  //Au clic sur la croix
  closeModalButton.addEventListener("click", () => {
    modal.style.visibility = "hidden";
  });

  //Au clic à l'extérieur de la modale
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.visibility = "hidden";
    }
  });

  //Avec Echap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.style.visibility = "hidden";
    }
  });
}

//Déconnexion par lien logout
function logoutRefresh() {
  loginStatus.addEventListener("click", (event) => {
    if (token) {
      event.preventDefault();
      localStorage.removeItem("token");
      console.log("Token supprimé");
      location.reload();
    }
  });
}

displayWorks();
displayCategories();
displayEdit();
displayModal();
closeModal();
logoutRefresh();
