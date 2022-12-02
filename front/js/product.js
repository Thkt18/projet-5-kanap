// Je redirige l'url de l'api

// je crée une nouvelle url à partir de l'url actuelle 
// et en ajoutant searchParams pour manipuler les paramètres de requête d'URL :
let params = new URL(window.location.href).searchParams;
// j'indique que la nouvelle url sera ajoutée d'un id :
let newID = params.get('id');


// J'apelle de nouveau l'api avec l'id du canapé

// je crée les variables dont j'ai besoin pour manipuler cette page :
const image = document.getElementsByClassName('item__img');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colors = document.getElementById('colors');

let imageURL = "";
let imageAlt = "";

// je crée la bonne URL pour chaque produits choisi en ajoutant newID
fetch("http://localhost:3000/api/products/" + newID)
  .then(res => res.json())
  .then(data => {
    // je modifie le contenu de chaque variable avec les bonnes données :
    image[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageURL = data.imageUrl;
    imageAlt = data.altTxt;
    title.innerHTML = `<h1>${data.name}</h1>`;
    price.innerText = `${data.price}`;
    description.innerText = `${data.description}`;


    // je configure le choi des couleurs 
    for (number in data.colors) {
      colors.options[colors.options.length] = new Option(
        data.colors[number],
        data.colors[number]
      );
    }
  })
    // j'ajoute un message au cas où le serveur ne répond pas
  .catch(_error => {
    alert('Le serveur ne répond pas.');
  });


// Je récupère les données par rapport aux choix de l'utilisateur

const selectQuantity = document.getElementById('quantity');
const selectColors = document.getElementById('colors');

// je configure un eventListener quand l'utilisateur clique sur ajouter au panier
const addToCart = document.getElementById('addToCart');
addToCart.addEventListener('click', (event) => {
  event.preventDefault();

  const selection = {
    id: newID,
    image: imageURL,
    alt: imageAlt,
    name: title.textContent,
    price: price.textContent,
    color: selectColors.value,
    quantity: selectQuantity.value,
  };

  /* je déclare une variable productInLocalStorage 
  dans laquelle je mets les clés+valeurs dans le local storage
  JSON.parse permet de convertir les données au format JSON en objet JavaScript */
  let productInLocalStorage =  JSON.parse(localStorage.getItem('product')); {

    // J'ai ajouté deux conditions, si la quantité n'est pas séléctionnés alors
    // un pop up s'affiche.
    if (selectQuantity.value <= 0) {
      alert('Veuillez selectionnée ou quantité.')
      return; 
    }
    // Si la couleur n'est pas séléctionnés alors un pop up s'affiche.
    if (selectColors.value <= 0) {
      alert('Veuillez selectionné une couleur.')
      return;
    }

    else  {
      alert('Le produit a bien été ajouté au panier');
      }
  
  }
 
  // j'ajoute les produits sélectionnés dans le localStorage
  const addProductLocalStorage = () => {
  /* je récupère la sélection de l'utilisateur dans le tableau de l'objet :
  on peut voir dans la console qu'il y a les données,
  mais pas encore stockées dans le storage à ce stade */

  productInLocalStorage.push(selection);
  /* je stocke les données récupérées dans le localStorage :
  JSON.stringify permet de convertir les données au format JavaScript en JSON 
  vérifier que key et value dans l'inspecteur contiennent bien des données */
  localStorage.setItem('product', JSON.stringify(productInLocalStorage));
  }

  // je crée une boîte de dialogue pour confirmer l'ajout au panier
  let addConfirm = () => {
    alert('Le produit a bien été ajouté au panier');
  }

  let update = false;
  
  // s'il y a des produits enregistrés dans le localStorage
  if (productInLocalStorage) {
  // verifier que le produit ne soit pas deja dans le localstorage/panier avec la couleur
   productInLocalStorage.forEach (function (productOk, key) {
    if (productOk.id == newID && productOk.color == selectColors.value) {
      productInLocalStorage[key].quantity = parseInt(productOk.quantity) + parseInt(selectQuantity.value);
      localStorage.setItem('product', JSON.stringify(productInLocalStorage));
      update = true;
      addConfirm();
    }
  });

  //
    if (!update) {
    addProductLocalStorage();
    addConfirm();
    }
  }

  // s'il n'y a aucun produit enregistré dans le localStorage 
  else {
    // je crée alors un tableau avec les éléments choisi par l'utilisateur
    productInLocalStorage = [];
    addProductLocalStorage();
    addConfirm();
  }
});