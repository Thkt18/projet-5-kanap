// Récupérer les produts stockés dans le localstorage
let products = [];
let productInLocalStorage = JSON.parse(localStorage.getItem('product'));

// Affichez les produits du panier

// je sélectionne la partie html concernée par la modification
let cartAndFormContainer = document.getElementById('cartAndFormContainer');

  // si le panier est vide : afficher 'le panier est vide'
  if(productInLocalStorage === null || productInLocalStorage == 0) {
    document.querySelector("#cart__items").innerHTML =`
    <div class="cart__empty">
      <p>Votre panier est vide ! <br> Merci de sélectionner des produits depuis la page d'accueil</p>
    </div>`;
  }
  // si le panier n'est pas vide : afficher les produits dans le localStorage
  else{
    let itemCards = [];
  
    // expression initiale; condition; incrémentation
    for (i = 0; i < productInLocalStorage.length; i++) {
    products.push(productInLocalStorage[i].id);
  
    /* le code suivant sera injecté à chaque tour de boucle
    selon la longueur des produits dans le local storage */

    itemCards = itemCards + `
      
      <article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">
      <div class="cart__item__img">
        <img src="${productInLocalStorage[i].image}" alt="${productInLocalStorage[i].alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${productInLocalStorage[i].name}</h2>
          <p>${productInLocalStorage[i].color}</p>
          <p>${productInLocalStorage[i].price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>
      `;
    }
  if (i === productInLocalStorage.length) {
  const itemCart = document.getElementById('cart__items');
  itemCart.innerHTML += itemCards;
  }

// je modifie la quantité dans le panier

changeQtt();

// je supprime un produit dans le panier

deleteArticle();

// j'affiche le total des articles dans le panier

totalArticles();

// je calcule le montant total du panier

priceAmount();

} // fin else : s'il y a des produits dans le panier

function deleteArticle() {
  const deleteItem = document.querySelectorAll('.deleteItem');

  for (let k = 0; k < deleteItem.length; k++) { 
    deleteItem[k].addEventListener('click', (event) => {
    event.preventDefault();

    // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
    let deleteId = productInLocalStorage[k].id;
    let deleteColor = productInLocalStorage[k].color;

    // filtrer l'élément cliqué par le bouton supprimer
    // en respectant les conditions du callback
    productInLocalStorage = productInLocalStorage.filter( elt => elt.id !== deleteId || elt.color !== deleteColor);
      
    // envoyer les nouvelles données dans le localStorage
    localStorage.setItem('product', JSON.stringify(productInLocalStorage));

    // avertir de la suppression et recharger la page
    alert('Votre article a bien été supprimé.');
    window.location.href = "cart.html";
    });
  }
}

function changeQtt() {
  let itemQtt = document.querySelectorAll('.itemQuantity');
  for (let j = 0; j < itemQtt.length; j++) {
    itemQtt[j].addEventListener('change', (event) => {
    event.preventDefault();
    /* sélection de la nouvelle quantité
    qu'on va sauvegarder dans un nouveau tableau
    avec les autres éléments du localStorage */
    let itemNewQtt = itemQtt[j].value;
    const newLocalStorage = {
      id: productInLocalStorage[j].id,
      image: productInLocalStorage[j].image,
      alt: productInLocalStorage[j].alt,
      name: productInLocalStorage[j].name,
      color: productInLocalStorage[j].color,
      price: productInLocalStorage[j].price,   
      quantity: itemNewQtt, // avec la nouvelle quantité souhaitée
    };

    // actualiser le localStorage avec les nouvelles données récupérées... 
    productInLocalStorage[j] = newLocalStorage;
    // en transformant les Js en Json
    localStorage.setItem('product', JSON.stringify(productInLocalStorage));

    // avertir de la modification et mettre à jour les totaux
    alert('Votre panier est à jour.');
    totalArticles();
    priceAmount();
      })
  }
}

function priceAmount() {
  const calculPrice = [];
  for (m = 0; m < productInLocalStorage.length; m++) {
    // prix de l'article quantité * prix
    const cartAmount = productInLocalStorage[m].price * productInLocalStorage[m].quantity;
    calculPrice.push(cartAmount);

    /* la fonction reduce() permet de garder en mémoire les résultats de l'opération
    elle fonctionne comme une boucle, avec un accumulateur et la valeur courante */
    const reduce = (previousValue, currentValue) => previousValue + currentValue;
    total = calculPrice.reduce(reduce);
  }
  const totalPrice = document.getElementById('totalPrice');
  totalPrice.textContent = total;
}

function totalArticles() {
  let totalItems = 0;
  for (l in productInLocalStorage) {
    /* analyser et convertir la valeur 'quantité' dans le localstorage en une chaîne
    et renvoie un entier (parseInteger), sur la base décimale de 10*/
    const newQuantity = parseInt(productInLocalStorage[l].quantity, 10);

    // attribuer la valeur retournée par parseInt à la variable totalItems
    totalItems += newQuantity;
  }
    // attribuer à #totalQuantité la valeur de totalItems et l'afficher dans le DOM
    const totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.textContent = totalItems;
}

// Informations de l'utilisateur
// Récupérer les données du formulaires
// Vérifier la validations des entrées (nom, mail, etc)
// Envoyer le formulaire dans le localstorage

// j'envoi le formulaire dans le serveur
function postForm() {
  const order = document.getElementById('order');
  order.addEventListener('click', (event) => {
  event.preventDefault();

  // je récupère les données du formulaire dans un objet
  const contact = {
    firstName : document.getElementById('firstName').value,
    lastName : document.getElementById('lastName').value,
    address : document.getElementById('address').value,
    city : document.getElementById('city').value,
    email : document.getElementById('email').value
  }


  // Vérification des entrées avec Regex

  
  //contrôle prénom
  function controlFirstName() {
    const validFirstName = contact.firstName;
    if (/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(validFirstName)) {
      return true;
    } else {
      let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
      firstNameErrorMsg.innerText = "Merci de vérifier le prénom, 3 caractères minimum";
    }
  } 

  // contrôle nom
  function controlName() {
    const validName = contact.lastName;
    if (/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(validName)) {
      return true;
    } else {
      let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
      lastNameErrorMsg.innerText = "Merci de vérifier le nom, 3 caractères minimum, avec des lettres uniquement";
    }
  }

  // contrôle adresse
  function controlAddress() {
    const validAddress = contact.address;
    if (/^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(validAddress)) {
      return true;
    } else {
      let addressErrorMsg = document.getElementById('addressErrorMsg');
      addressErrorMsg.innerText = "Merci de vérifier l'adresse, alphanumérique et sans caractères spéciaux";
    }
  } 

  // contrôle ville
  function controlCity() {
    const validAddress = contact.city;
    if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,50}$/.test(validAddress)) {
      return true;
    } else {
      let cityErrorMsg = document.getElementById('cityErrorMsg');
      cityErrorMsg.innerText = "Merci de vérifier le nom de la ville, 3 caractères minimum, avec des lettres uniquement";
    }
  }

  

  // contrôle email
  function controlEmail() {
    const validEmail = contact.email;
    if (/^[A-Za-z0-9+_.-]+@(.+)$/.test(validEmail)) {
      return true;
    } else {
      let emailErrorMsg = document.getElementById('emailErrorMsg');
      emailErrorMsg.innerText = "Erreur ! Email non valide";
    }
  }


  // Après vérification des entrées j'envoi l'objet contact dans le localStorage

  function validControl() {
    if (controlFirstName() && controlName() && controlAddress() && controlCity() && controlEmail()) {
      localStorage.setItem('contact', JSON.stringify(contact));
      return true;
    } else {
        alert('Merci de revérifier les données du formulaire')
      }
  }
  validControl()

  // je mets les valeurs du formulaire et les produits sélectionnés dans un objet

  const sendFormData = {
    contact,
    products,
  }

  // j'envoie le formulaire + localStorage (sendFormData) au serveur

  const options = {
    method: 'POST',
    body: JSON.stringify(sendFormData),
    headers: { 
      'Content-Type': 'application/json',
    }
  };

  fetch("http://localhost:3000/api/products/order", options)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('orderId', data.orderId);
        if (validControl()) {
          document.location.href = 'confirmation.html?id='+ data.orderId;
        }
    });

})
}
postForm();



