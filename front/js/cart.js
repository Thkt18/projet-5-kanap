// fonction qui récupère le localStorage
function getProduct() {
    const productInLocalStorage = localStorage.getItem("product");
    // console.table(productInLocalStorage);
    // si le panier est vide :
 if(productInLocalStorage === null || productInLocalStorage == 0) {
  alert('Votre panier est vide ! Merci de sélectionner des produits depuis la page d\'accueil')
  document.querySelector("#cart__items").innerHTML =`
  <div class="cart__empty">
    <p>Votre panier est vide ! <br> Merci de sélectionner des produits depuis la page d'accueil</p>
  </div>`;
    } else {
      return JSON.parse(productInLocalStorage);
    }
  }


// fonction qui va récupérer les informations des canapés du panier
function fetchProductsInCart() {
  const carts = getProduct();
  for (const productInLocalStorage of carts) {
    // pour chaque produit du panier
    fetch("http://localhost:3000/api/products/" + productInLocalStorage._id)
    .then((response) => response.json())
    .then((product) => showProductInCart(product, productInLocalStorage))
    .catch((error) => console.log(error));
  }
}

fetchProductsInCart();


  //fonction pour afficher de manière dynamique le ou les produit(s) du panier
function showProductInCart(product, productInLocalStorage) {
    // création de l' article
    let section = document.getElementById("cart__items");
    let article = document.createElement("article");
    article.className = "cart__item";
    article.setAttribute("data-id", product._id);
    article.setAttribute("data-color", productInLocalStorage.color);
    section.appendChild(article);
  
    // création et affichage de l'image
    let divImage = document.createElement("div");
    divImage.classList.add("cart__item__img");
    article.appendChild(divImage);
    let image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = product.altTxt;
    divImage.appendChild(image);
  
    // création de la div "content"
    let divContent = document.createElement("div");
    divContent.classList.add("cart__item__content");
    article.appendChild(divContent);
  
    // création et affichage du contenu de la div content-description
    let divContentDescription = document.createElement("div");
    divContentDescription.classList.add("cart__item__content__description");
    divContent.appendChild(divContentDescription);
  
    let h2 = document.createElement("h2");
    h2.textContent = product.name;
    divContentDescription.appendChild(h2);
  
    let pColor = document.createElement("p");
    pColor.textContent = productInLocalStorage.color;
    divContentDescription.appendChild(pColor);
  
    let pPrice = document.createElement("p");
    pPrice.textContent = product.price + " €";
    divContentDescription.appendChild(pPrice);
  
    // //création de la div settings
    let divContentSettings = document.createElement("div");
    divContentSettings.classList.add("cart__item__content__settings");
    divContent.appendChild(divContentSettings);
  
    //création et affichage contenu div settings quantity
    let divSettingsQuantity = document.createElement("div");
    divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
    divContentSettings.appendChild(divSettingsQuantity);
  
    let pQty = document.createElement("p");
    pQty.textContent = "Qté : ";
    divSettingsQuantity.appendChild(pQty);
    let inputQty = document.createElement("input");
    let quantityDataId = pQty.closest(".cart__item").dataset.id;
    let quantityDataColor = pQty.closest(".cart__item").dataset.color; //**** */
    inputQty.setAttribute("type", "number");
    inputQty.setAttribute("class", "itemQuantity");
    inputQty.setAttribute("name", "itemQuantity");
    inputQty.setAttribute("min", "1");
    inputQty.setAttribute("max", "100");
    inputQty.setAttribute("value", productInLocalStorage.quantity);
    divSettingsQuantity.appendChild(inputQty);
   
    //actualisation du changement de la quantité(prise en compte de l'id et couleur sur le produit)
    inputQty.addEventListener("change", (event) => {
      updateQuantity(event, quantityDataId, quantityDataColor);
    });
  
    //quantité mise à "1" si saisie négative ou suppérieur à 100
    inputQty.addEventListener("change", (event) => {
      if (event.target.value < 0 || event.target.value > 100) {
        inputQty.value = 1;
      }
    });
    // appel des fonctions
    modifQuantity();
    totalQuantity();
    totalPrice();

    //création et affichage de la div settings delete
  let divSettingsDelete = document.createElement("div");
  divSettingsDelete.classList.add("cart__item__content__settings__delete");
  divContentSettings.appendChild(divSettingsDelete);

  let pDelete = document.createElement("p");
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";
  divSettingsDelete.appendChild(pDelete);

  // récupération de l'article au clic du boutton(article sélectionné par son id et sa couleur)
  const dataId = pDelete.closest(".cart__item").dataset.id;
  const dataColor = pDelete.closest(".cart__item").dataset.color;
  pDelete.addEventListener("click", (event) => {
    deleteItem(dataId, dataColor);
  });
}

function modifQuantity() {
  const itemsQuantity = document.querySelectorAll(".itemQuantity");

  itemsQuantity.forEach((itemQuantity) => {
    itemQuantity.addEventListener("change", () => {
      const newQuantity = Number(itemQuantity.value);
      itemQuantity.textContent = newQuantity;
      let kanap = itemQuantity.closest("article"); // méthode qui parcourt les produits afin de trouver celui qui subit un changement de quantité
      let productInLocalStorage = JSON.parse(localStorage.getItem("product")); // on récupère le panier
      let getId = kanap.getAttribute("data-id"); // création de variables (pour récupéré id et couleur)
      let getColor = kanap.getAttribute("data-color");
      for (let index = 0; index < productInLocalStorage.length; index++) {
        const productLs = productInLocalStorage[index];
        if (getId === productLs._id && getColor === productLs.color) {
          // on vérifie le canapé par son ID et sa couleur pour enregistrer sa nouvelle quantité
          productLs.quantity = newQuantity;
          localStorage.setItem("product", JSON.stringify(productInLocalStorage)); // on enregistre
        }
      }
      window.location.reload(); // actualisation de la page
    });
  });
}

//actualisation du changement de quantité(sur la page et dans le localStorage), si ok on enregistre dans le localStorage
function updateQuantity(event, quantityDataId, quantityDataColor) {
  const productInLocalStorage = JSON.parse(localStorage.getItem("product"));

  for (let article of productInLocalStorage) {
    if (article._id === quantityDataId && article.color === quantityDataColor) {
        //Quantité entre 1 et 100
      if (article.quantity > 0 && article.quantity < 100) {
        article.quantity = event.target.value;
      } else {
        alert("Veuillez saisir une quantité valide !");
        article.quantity = 1;// si la quantité saisit est négative, le compteur se remet à 1
      }
      localStorage.setItem("product", JSON.stringify(productInLocalStorage));
      location.reload();
    }
  }
}

//fonction qui supprime l'article sélectionné du panier, nouveau panier réactualisé
function deleteItem(dataId, dataColor) {
  const productInLocalStorage = JSON.parse(localStorage.getItem("product"));
  const productInLocalStorageFilter = productInLocalStorage.filter(
    // canapé sélectionné par son id et sa couleur
    (article) =>
      (article._id !== dataId && article.color !== dataColor) ||
      (article._id === dataId && article.color !== dataColor)
  );
  let newproductInLocalStorage = productInLocalStorageFilter;
  localStorage.setItem("product", JSON.stringify(newproductInLocalStorage));
  location.reload();
}

//fonction qui calcule la quantité totale affichée sur la page
function totalQuantity() {
  const getTotalQuantity = document.getElementById("totalQuantity");
  const productInLocalStorage = JSON.parse(localStorage.getItem("product"));
  let totalQuantity = [];

  let total = 0;
  for (let product of productInLocalStorage) {
    total += parseInt(product.quantity);
  }
  totalQuantity.push(total);

  getTotalQuantity.innerText = total;
}

//fonction qui calcul le prix total des articles (affiché sur la page)
function totalPrice() {
  //récupération des balises pour l'affichage des totaux
  let getTotalPrice = document.getElementById("totalPrice");
  let getQuantity = document.querySelectorAll(".itemQuantity");
  let getPrices = document.querySelectorAll(
    ".cart__item__content__description"
  );

  // initialisation du prix à 0
  let productPrice = 0;

  for (let i = 0; i < getPrices.length; i++) {
    // récupération du prix sur la page
    productPrice +=
      parseInt(getPrices[i].lastElementChild.textContent) *
      getQuantity[i].value;
  }
  getTotalPrice.innerText = productPrice;
}





//FORMULAIRE


let product = [];
const productInLocalStorage = JSON.parse(localStorage.getItem("product"));
// console.log(productInLocalStorage);
for (const element of productInLocalStorage) {
  product.push(element._id);
}

let btnSubmit = document.getElementById("order");

// récupération des "p" pour afficher les messages d'erreur
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");

// types regex sur les inputs
let textRegex = /^([A-Za-z]{3,20}-{0,1})?([A-Za-z]{3,20})$/;
let addressRegex = /^(.){2,50}$/;
let cityRegex = /^[a-zA-Zéèàïêç\-\s]{2,30}$/;
let emailRegex =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

// methode test : Teste une correspondance dans une chaîne. Renvoie vrai ou faux
let contact = {}; //objet formulaire

//REGEX
const regexNames = (value) => {
  return /^[A-Za-zéèêëàçâ-]{3,30}$/.test(value);
};

const regexAdresseAndCity = (value) => {
  return /^[a-zA-Zçéèêôùïâàû0-9\s, '-]{3,60}$/.test(value);
};

const regexEmail = (value) => {
  return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(value);
};

// Fonctions qui vérifient la validité des champs de saisis des inputs

// vérification du prénom
function verifFirstName() {
  let inputFirstName = document.getElementById("firstName").value;
  if (regexNames(inputFirstName)) {
    firstNameErrorMsg.textContent = "saisie enregistrée";
    return true;
  } else {
    firstNameErrorMsg.textContent = "Veuillez renseigner un prénom valide avec un minimum de 3 caractères !";

    return false;
  }
}
//vérification du nom
function verifLastName() {
  let inputLastName = document.getElementById("lastName").value;
  if (regexNames(inputLastName)) {
    lastNameErrorMsg.textContent = "saisie enregistrée";
    return true;
  } else {
    lastNameErrorMsg.textContent = "Veuillez renseigner un nom valide avec un minimum de 3 cractères !";

    return false;
  }
}
//vérification de la ville
function verifCity() {
  let inputCity = document.getElementById("city").value;
  if (regexAdresseAndCity(inputCity)) {
    cityErrorMsg.textContent = "saisie enregistrée";
    return true;
  } else {
    cityErrorMsg.textContent = "Veuillez renseigner une ville valide !";

    return false;
  }
}
// vérification de l'adresse
function verifAddress() {
  let inputAddress = document.getElementById("address").value;
  if (regexAdresseAndCity(inputAddress)) {
    addressErrorMsg.textContent = "saisie enregistrée";
    return true;
  } else {
    addressErrorMsg.textContent = "Veuillez saisir une adresse valide !";

    return false;
  }
}
//vérification de l'aresse mail
function verifEmail() {
  let inputEmail = document.getElementById("email").value;
  if (regexEmail(inputEmail)) {
    emailErrorMsg.textContent = "saisie enregistrée";
    return true;
  } else {
    emailErrorMsg.textContent = "Veuillez saisir une adresse email valide !";

    return false;
  }
}

//évènement au clic de la souris sur "commander"
btnSubmit.addEventListener("click", (event) => {
  //on écoute la valeur des champs et leur validité
  event.preventDefault(event);

  //tableau contact
  contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
    city: document.getElementById("city").value,
  };

  send();
});

//fonction qui envoie une requête post(envoie de la commande)
//si le formulaire et valide
//récupération de l'orderId en retour
//redirection vers la page de confirmation
function send() {
  let cart = JSON.parse(localStorage.getItem("product"));
  // si tout est ok, alors...
  if (cart !== null &&
    verifFirstName() &&
    verifLastName() &&
    verifAddress() &&
    verifCity() &&
    verifEmail()
  ) {
    // console.log("fonction ok", cart);

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({
        contact,
        products: product, //cart.id,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

      // Récupération et stockage de la réponse de l'API (orderId)

      .then((response) => {
        return response.json();
      })
      .then((server) => {
        const orderId = server.orderId;

        if (orderId != "") {
          // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
          location.href = "confirmation.html?orderid=" + orderId;
        }
      });
  } //else {
    //alert(
      //"Votre panier est vide ! Merci de sélectionner des produits depuis la page d\'accueil"
    //);
    /* console.log("fonction non validée"); */
  //}
  }
