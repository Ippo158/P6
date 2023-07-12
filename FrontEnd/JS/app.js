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
const modalWrapper = document.querySelector(".modal-wrapper");
const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
const btnAddLimit = document.querySelector(".btn-add-limit");
const btnAdd = document.querySelector(".btn-add");
const modalAddLogo = document.querySelector(".modal-add-logo");
const modalButtonAdd = document.querySelector(".modal-button-add");
const form = document.querySelector(".modal-form");
const inputFile = document.getElementById("image");
const inputName = document.getElementById("title");
const selectCategory = document.getElementById("category");
const submitButton = document.querySelector(".modal-button-add");

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

        // Création du contenu du work
        work.setAttribute("data-work-id", item.id); // Ajouter l'ID du work

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
    activeButtons.forEach((button) => button.classList.toggle("active"));

    categoryButton.classList.toggle("active");

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

//Affichage page en mode admin
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

function displayModal() {
  const editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", () => {
      modal.style.visibility = "visible";

      const modalFigures = document.querySelectorAll(".modal-images figure");

      modalFigures.forEach((figure, index) => {
        const existingTrashIcon = figure.querySelector(".fa-trash-can");

        if (!existingTrashIcon) {
          const trashIcon = document.createElement("i");
          trashIcon.classList.add("fa-regular", "fa-trash-can");
          figure.insertBefore(trashIcon, figure.firstChild);

          // Ajouter l'icône des flèches dans la première figure
          if (index === 0) {
            const arrowsIcon = document.createElement("i");
            arrowsIcon.classList.add(
              "fa-solid",
              "fa-arrows-up-down-left-right"
            );
            figure.insertBefore(arrowsIcon, figure.firstChild);
          }
        }

        //Event listener sur trash can
        const deleteIcon = figure.querySelector(".fa-trash-can");
        deleteIcon.addEventListener("click", () => {
          const workElement = deleteIcon.parentNode;
          const workId = workElement.getAttribute("data-work-id");
          deleteWork(workId);
        });
      });

      const modalFigcaptions = document.querySelectorAll(
        ".modal-images figcaption"
      );

      modalFigcaptions.forEach((figcaption) => {
        figcaption.textContent = "éditer";
      });
    });
  });
}

// Fonction pour supprimer un travail
function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        // Suppression réussie, mettre à jour l'interface
        const workElement = document.querySelector(
          `figure[data-work-id="${workId}"]`
        );
        if (workElement) {
          workElement.remove();
          alert("Le travail a été supprimé avec succès.");
        }
        // closeModal();
      } else {
        // Erreur lors de la suppression
        console.error(
          "Une erreur s'est produite lors de la suppression du travail."
        );
      }
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la suppression du travail :",
        error
      );
    });
}

//Retour arrière modale
function resetBackModal() {
  const arrowBack = document.querySelector(".fa-arrow-left-long");

  arrowBack.addEventListener("click", () => {
    modalWrapper.style.display = "flex";
    modalWrapperAdd.style.display = "none";
    resetInputModal();
  });
}

//Reset modale
function resetInputModal() {
  const previewImage = document.querySelector(".preview-image");
  const fileInput = document.querySelector("input[type='file']");
  const titleInput = document.querySelector("input[type='text']");
  const categoryInput = document.querySelector("select");

  //Reset preview image
  previewImage.src = "";
  previewImage.style.display = "none";

  //Reset champs du formulaire
  fileInput.value = null;
  titleInput.value = null;
  categoryInput.value = "";

  //Reset div pour ajouter une image
  modalAddLogo.style.display = "block";
  btnAdd.style.display = "flex";
  btnAddLimit.style.display = "block";
}

//Fermeture de la modale
function closeModal() {
  const closeModalButton = document.querySelectorAll(".close-button");

  //Au clic sur la croix
  closeModalButton.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      modal.style.visibility = "hidden";
      modalWrapper.style.display = "flex";
      modalWrapperAdd.style.display = "none";
      resetInputModal();
    });
  });

  //Au clic à l'extérieur de la modale
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.visibility = "hidden";
      modalWrapper.style.display = "flex";
      modalWrapperAdd.style.display = "none";
      resetInputModal();
    }
  });

  //Avec Echap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.style.visibility = "hidden";
      modalWrapper.style.display = "flex";
      modalWrapperAdd.style.display = "none";
      resetInputModal();
    }
  });
}

//Déconnexion par logout
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

//Affichage de la modale pour AJOUTER une photo
function modalAddImage() {
  modalButtonAdd.addEventListener("click", () => {
    modalWrapper.style.display = "none";
    modalWrapperAdd.style.display = "flex";
  });
}

//Prévisualiser l'image sélectionnée
function previewImage(event) {
  const imageInput = document.getElementById("image");
  imageInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    const previewImage = document.querySelector(".preview-image");

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImage.src = reader.result;
        previewImage.style.display = "block";
        modalAddLogo.style.display = "none";
        btnAdd.style.display = "none";
        btnAddLimit.style.display = "none";
      };
      reader.readAsDataURL(selectedFile);
    } else {
      previewImage.src = "";
      previewImage.style.display = "none";
    }
  });
}

// Vérifier les conditions de validités
function checkFormValidity() {
  const isInputFileValid = inputFile.files.length > 0;
  const isInputNameValid = inputName.value.trim() !== "";
  const isSelectCategoryValid = selectCategory.value !== "";
  const isFileValid = isInputFileValid && checkFileSize() && checkFileType();

  return isFileValid && isInputNameValid && isSelectCategoryValid;
}

//Limite 4Mo
function checkFileSize() {
  const maxFileSize = 4 * 1024 * 1024; // 4MB
  const selectedFile = inputFile.files[0];

  if (selectedFile && selectedFile.size > maxFileSize) {
    alert("La taille du fichier dépasse la limite autorisée (4Mo maximum).");
    resetInputModal();
    return false;
  }

  return true;
}

//Fichier jpeg et png
function checkFileType() {
  const allowedTypes = ["image/jpeg", "image/png"];
  const selectedFile = inputFile.files[0];

  if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
    alert("Seuls les fichiers de type JPEG et PNG sont acceptés.");
    resetInputModal();
    return false;
  }

  return true;
}

//Soumission du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (checkFormValidity()) {
    const formData = new FormData(form);
    console.log(formData);
    const token = localStorage.getItem("token");

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse du serveur :", data);
        resetInputModal();
        alert("Le formulaire a été envoyé avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données :", error);
      });
  } else {
    console.log("Veuillez remplir tous les champs !");
    alert("Veuillez remplir tous les champs !");
  }
});

displayWorks();
displayCategories();
displayEdit();
displayModal();
logoutRefresh();
modalAddImage();
previewImage();
closeModal();
resetBackModal();
