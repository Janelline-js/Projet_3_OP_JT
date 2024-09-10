/*** le token ***/

const token = window.localStorage.getItem("token")

/****  Récupération des travaux avec Fetch ****/

const fetchData = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

/*** Affichage de la page en admin ou public ***/

const admin = () => {
  fetchData().then((res) => {
    modifier.addEventListener("click", function () {
      openModal(res)
      //console.log("je clique sur le js modal open")
    })

    displayGallery(res)
  })
}

const public = () => {
  fetchData().then((res) => {
    displayGallery(res)

    btnAll.addEventListener("click", function () {
      gallery.innerHTML = "";

      displayGallery(res);

      btnFlats.classList = "btn-menu";
      btnHotels.classList = "btn-menu";
      btnItems.classList = "btn-menu";
      btnAll.classList = "btn-select";
    })

    btnItems.addEventListener("click", function () {
      gallery.innerHTML = "";

      displayGallery(res.filter((element) => element.category.id === 1));

      btnFlats.classList = "btn-menu";
      btnHotels.classList = "btn-menu";
      btnAll.classList = "btn-menu";
      btnItems.classList = "btn-select";
    })

    btnFlats.addEventListener("click", function () {
      gallery.innerHTML = ""

      displayGallery(res.filter((element) => element.category.id === 2));

      btnItems.classList = "btn-menu"
      btnHotels.classList = "btn-menu"
      btnAll.classList = "btn-menu"
      btnFlats.classList = "btn-select"
    })

    btnHotels.addEventListener("click", function () {
      gallery.innerHTML = ""

      displayGallery(res.filter((element) => element.category.id === 3));

      btnFlats.classList = "btn-menu"
      btnItems.classList = "btn-menu"
      btnAll.classList = "btn-menu"
      btnHotels.classList = "btn-select"
    })
  })
};

/*** Gestion du token ***/

if (!token) {
  const menu = document.querySelector(".js-works-menu")
  menu.innerHTML = `
  <button class="btn-select" id="btn-all" type="button"><span>Tous</span></button>
  <button class="btn-menu" id="btn-items" type="button"><span>Objets</span></button>
  <button class="btn-menu" id="btn-flats" type="button"><span>Appartements</span></button>
  <button class="btn-menu" id="btn-hotels" type="button"><span>Hotels et restaurants</span></button>`

  const edit = document.querySelectorAll(".edit")
  edit.forEach((element) => element.classList = "hidden")
  //console.log("il n'y a pas de token")

  public()
} else {
  const loginbutton = document.querySelector("#login-button")
  loginbutton.innerHTML = `<a href="index.html" class="logoutbutton">logout</a>`
  loginbutton.addEventListener("click", () => {
    window.localStorage.removeItem("token")
  });

  admin()
}

const btnAll = document.querySelector("#btn-all")
const btnItems = document.querySelector("#btn-items")
const btnFlats = document.querySelector("#btn-flats")
const btnHotels = document.querySelector("#btn-hotels")
const gallery = document.querySelector(".gallery");

const modal = document.querySelector(".modal")

const modifier = document.querySelector(".js-modal-open");
const modalPhotos = document.querySelector(".modal-photos");

const figured = modal.querySelector(".js-modal-figure")
/*** Fonction afficher la gallerie ***/

function displayGallery(a) {
  for (let i = 0; i < a.length; i++) {
    const figure = `
  <figure>
      <img src= "${a[i].imageUrl}" alt="${a[i].title}">
      <figcaption>${a[i].title}</figcaption>
  </figure>`;
    gallery.innerHTML = gallery.innerHTML + figure;
  }

}

function displayModal(a) {
  for (let i = 0; i < a.length; i++) {
    const figure = `
  <figure class="js-modal-figure">
      <img src= "${a[i].imageUrl}" alt="${a[i].title}">
      <button class="js-modal-delete" id="${a[i].id}"><i class="fa-regular fa-trash-can"></i></button>
  </figure>`;
    modalPhotos.innerHTML = modalPhotos.innerHTML + figure;
  }
}

/***   Affichage de la Modale    ***/

const openModal = function (r) {
  modal.style.display = "flex"
  modalPhotos.innerHTML = ""

  displayModal(r)
  deleteId(r)

  modal.querySelector(".js-modal-next").addEventListener("click", addphoto)
  modal.addEventListener('click', closeModal)
  modal.addEventListener("contextmenu", preventRightClick);
  modal.querySelector(".js-modal-close").addEventListener('click', closeModal);
  modal.querySelector(".js-modal-stop").addEventListener('click', stopPropagation);
}

const closeModal = function () {
  modal.style.display = "none";
  modalPhotos.innerHTML = "";
  //console.log("la modale est fermée");

  modal.removeEventListener('click', closeModal);
  modal.removeEventListener("contextmenu", preventRightClick);
  modal.querySelector(".js-modal-close").removeEventListener('click', closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener('click', stopPropagation);
}

const addphoto = function () {
  submitOn()
  displayOptions()

  const arrow = document.querySelector("#arrow");
  modal.querySelector("#js-modal-1").style.display = "none";
  modal.querySelector("#js-modal-2").style.display = "flex";
  arrow.style.color = "black";
  //console.log("modalphoto");
  modal.querySelector(".js-modal-back").addEventListener("click", back);
  modal.querySelector(".js-modal-next").removeEventListener("click", addphoto);
}

const back = function () {
  modal.querySelector("#imgcategory").innerHTML = `<option value="">Sélectionner une catégorie</option>`
  arrow.style.color = "transparent"

  cleanValidListeners()

  document.querySelector("#js-modal-1").style.display = "flex";
  document.querySelector("#js-modal-2").style.display = "none";
  //console.log("modalback")
  modal.querySelector(".js-modal-back").removeEventListener("click", back)
  modal.querySelector(".js-modal-next").addEventListener("click", addphoto)
  modal.querySelector("#js-modal-submit").removeEventListener("click", function (event) { event.preventDefault });
}

const stopPropagation = function (e) { e.stopPropagation() }
const preventRightClick = (e) => { e.preventDefault(); closeModal() }

/***   Suppression des travaux   ***/

const deleteId = function (r) {
  const button = modal.querySelectorAll(".js-modal-delete");
  for (let i = 0; i < r.length; i++) {
    button[i].addEventListener("click", async function () {
      const headers = { 'Authorization': `Bearer ${token}` };

      fetch(`http://127.0.0.1:5678/api/works/${button[i].id}`, {
        headers,
        method: "DELETE",
      })

      button[i].removeEventListener("click", function () { })
      refresh()
      //console.log("photo was deleted");
    })
  }
}

const refresh = async function () {
  modifier.removeEventListener("click", function () {
    openModal()
    //console.log("je clique sur le js modal open")
  })

  fetchData().then((res) => {
    modifier.addEventListener("click", function () {
      openModal(res)
      //console.log("je clique sur le js modal open")
    })

    modalPhotos.innerHTML = ""
    gallery.innerHTML = ""

    displayGallery(res)
    displayModal(res)
    deleteId(res)
  })
}

/** Ajout Photo **/

const displayOptions = async () => {
  const selector = modal.querySelector("#imgcategory")

  const categories = await fetch(`http://127.0.0.1:5678/api/categories/`, {
    method: "GET"
  }).then((res) => res.json())
  //console.log(categories)
  categories.map((category) => {
    const option = document.createElement("option")
    option.setAttribute("value", category.id)
    option.textContent = category.name

    return selector.appendChild(option)
  })
}

const displayPreview = function () {

    modal.querySelector(".fa-image").style.display = "none";
    const reader = new FileReader();
    const preview = modal.querySelector(".js-img-preview")
    const selectedFile = modal.querySelector("#file").files[0];

    const handleEvent = function (event) {
      if (event.type === "load") {
        preview.src = reader.result;
      }
    }

    if (selectedFile) {
      reader.addEventListener("load", handleEvent)
      reader.readAsDataURL(selectedFile);
      modal.querySelector(".modal-file-input").style.display = "none"
      modal.querySelector('.file-input-container>p').style.display = "none"
      preview.style.display = "flex"
      modal.querySelector("#file").removeEventListener("change", () => { })
    }
  
}


const limitFileSize = function () {

  modal.querySelector("#file").addEventListener('change', event => {
    const file = modal.querySelector("#file").files[0];

    const maxFileSizeInOctets = 4000000;
    const size = file.size
    if (size > maxFileSizeInOctets) {
      modal.querySelector(".js-size-alert").append(" Fichier trop lourd")
      console.log(modal.querySelector(".js-size-alert"))
      modal.querySelector(".js-size-alert").classList = "js-size-alert error"
      modal.querySelector("#js-modal-addimg").reset()

      return;

    }else {
    modal.querySelector(".js-size-alert").classList = "js-size-alert"
    modal.querySelector(".js-size-alert").innerHTML = "jpg, png : 4mo max";

    displayPreview()
    }
  });
}


const validSelector = function () {
  const option = modal.querySelector("#imgcategory")

  if (option.value >= 1) {
    return true
  } else {
    return false
  }
}

const validTitle = function () {
  const title = modal.querySelector("#imgtitle")

  if (title.value) {
    return true
  } else {
    return false
  }
}

const validImg = function () {
  const image = modal.querySelector("#file")

  if (image.files[0]) {
    return true
  } else {
    return false
  }
}

const cleanValidListeners = function () {
  modal.querySelector('#file').removeEventListener("input", check)
  modal.querySelector("#imgtitle").removeEventListener("input", check)
  modal.querySelector("#imgcategory").removeEventListener("input", check)

}

const postPhoto = async function () {
  const formData = new FormData();
  formData.append("image", modal.querySelector("#file").files[0]);
  formData.append("title", modal.querySelector('#imgtitle').value);
  formData.append("category", parseInt(modal.querySelector('#imgcategory').value, 10));

  await fetch(`http://127.0.0.1:5678/api/works/`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }).then(response => response.json)
    .then(data => { } /*console.log(data)*/)
    .catch(error => console.error('Error:', error))

  back()
  refresh()

  modal.querySelector("#js-modal-addimg").reset()
  const preview = modal.querySelector(".js-img-preview")
  preview.style.display = "none"
  modal.querySelector(".modal-file-input").style.display = "flex"
  modal.querySelector('.file-input-container>p').style.display = "flex"
  modal.querySelector(".fa-image").style.display = "flex"
  modal.querySelector("#js-modal-submit").classList = "invalid-submit"
  modal.querySelector("#js-modal-submit").removeEventListener("click", postPhoto)

}

const addValidListeners = function () {
  modal.querySelector("#js-modal-submit").addEventListener("click", function (event) { event.preventDefault() });
  modal.querySelector("#js-modal-submit").addEventListener("click", postPhoto)
}

const formIncomplete = function () { //console.log("formIncomplete")
  modal.querySelector("#js-modal-submit").removeEventListener("click", postPhoto)
  modal.querySelector("#js-modal-submit").classList = "invalid-submit"

  return false
}



const check = function () {
  if (validImg() === true) {
    if (validTitle() === true) {
      if (validSelector() === true) {
        modal.querySelector("#js-modal-submit").classList = "valid-submit"
        //console.log("formValid")
        addValidListeners()

        return true
      } else {
        formIncomplete()

      }
    } else {
      formIncomplete()

      return false
    }
  } else {
    formIncomplete()
  }
}

const submitOn = function () {
  limitFileSize()

  modal.querySelector('#file').addEventListener("change", check)
  modal.querySelector("#imgcategory").addEventListener("input", check)
  modal.querySelector("#imgtitle").addEventListener("input", check)
}