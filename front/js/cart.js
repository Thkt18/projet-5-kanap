// Récupérer les produts stockés dans le localstorage (sous forme de tableau console.log)
let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
console.table(productInLocalStorage)

// Si le localStorage est vide :
if(productInLocalStorage === null || productInLocalStorage == 0) {
  alert('Votre panier est vide ! Merci de sélectionner des produits depuis la page d\'accueil')
  document.querySelector("#cart__items").innerHTML =`
  <div class="cart__empty">
    <p>Votre panier est vide ! <br> Merci de sélectionner des produits depuis la page d'accueil</p>
  </div>`;
} 

// Si le localStorage comporte un ou des éléments :
else{

// Je crée ici une boucle pour parcourir le tableau des produits stockés dans le localstorage
    for (let j = 0; j < productInLocalStorage.length; j++) {

        // Récupérer les informations du produit à partir de l'URL de l'API
        fetch(`http://localhost:3000/api/products/${productInLocalStorage[j].id}`)
            .then((res) =>  res.json())
            .then((productData) => {
                
                // console.log(productData)
                
                console.log('nombre d article dans le panier ' + productInLocalStorage.length)    
        
                //Insértion de l'élèment article dans le panier
                const cartArticle = document.createElement("article");
                cartArticle.classList.add("cart__item");
                cartArticle.dataset.id = productInLocalStorage[j].id;
                const idProductsInStorage = cartArticle.dataset.id
                cartArticle.dataset.colors = productInLocalStorage[j].color;
                document.querySelector("#cart__items").appendChild(cartArticle);
                
                console.log(idProductsInStorage)
                console.log(cartArticle.dataset.colors)
                
        
                //création de la div cart item img
                const divCartItemImg = document.createElement("div");
                divCartItemImg.classList.add("cart__item__img");
                cartArticle.appendChild(divCartItemImg);
        
                //Insértion de l'image + alt
                const cartImg = document.createElement("img");
                cartImg.src = productData.imageUrl;
                cartImg.alt = productData.altTxt; 
                divCartItemImg.appendChild(cartImg);
        
                //création div cart__item__content
                const divCartItemContent = document.createElement("div");
                divCartItemContent.classList.add("cart__item__content");
                cartArticle.appendChild(divCartItemContent);
        
                //création div cart__item__content_description
                const divCartItemContentDesc = document.createElement("div");
                divCartItemContent.classList.add("cart__item__content__description");
                divCartItemContent.appendChild(divCartItemContentDesc);
        
                //création h2
                const cartName = document.createElement("h2");
                divCartItemContentDesc.appendChild(cartName);
                cartName.innerHTML = productData.name;
                
        
                //Création P/couleur
                const paraColor = document.createElement("p");
                divCartItemContentDesc.appendChild(paraColor);
                paraColor.innerHTML = cartArticle.dataset.colors;
        
                //Création P/price
                const paraPrice = document.createElement("p");
                divCartItemContentDesc.appendChild(paraPrice);
                paraPrice.innerHTML = productData.price +" €";
        
                //création div cart__item__content_settings
                const divCartItemContentSet = document.createElement("div");
                divCartItemContentSet.classList.add("cart__item__content__settings");
                cartArticle.appendChild(divCartItemContentSet);
        
                //création div cart__item__content__settings__quantity
                const divCartItemContentSetQte = document.createElement("div");
                divCartItemContentSetQte.classList.add("cart__item__content__settings__quantity");
                divCartItemContentSet.appendChild(divCartItemContentSetQte);
        
                //Création P/quantity
                const paraQuantity = document.createElement("p");
                divCartItemContentSetQte.appendChild(paraQuantity);
                paraQuantity.innerHTML = "Qté :"
        
                //Création input
                const cartInput = document.createElement("input");
                cartInput.type = "number";
                cartInput.name = "itemQuantity";
                cartInput.min = "1";
                cartInput.max = "100";
                cartInput.value = productInLocalStorage[j].quantity;
                divCartItemContentSetQte.appendChild(cartInput);
        
                //création div cart__item__content__settings__delete
                const divCartItemContentSetDel = document.createElement("div");
                divCartItemContentSetDel.classList.add("cart__item__content__settings__delete");
                divCartItemContent.appendChild(divCartItemContentSetDel);
        
                //Création P/delete
                const paraDelete = document.createElement("p");
                paraDelete.classList.add("deleteItem");
                divCartItemContentSetDel.appendChild(paraDelete);
                paraDelete.innerHTML = "Supprimer"
                
                
              
                // je supprime un produit dans le panier
                deleteArticle();

                // je modifie la quantité dans le panier
                changeQtt();

                // j'affiche le total des articles dans le panier
                totalArticles();
                
                // je calcule le montant total du panier
                priceAmount();

                

            
                // Fonction pour supprimer un article du panier
                function deleteArticle() {
                  const deleteItem = document.querySelectorAll('.deleteItem');
                  
                  for (let k = 0; k < deleteItem.length; k++) { 
                    deleteItem[k].addEventListener('click', (event) => {
                    event.preventDefault();
                
                    // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
                    let deleteId = productInLocalStorage[k].id;
                    let deleteColor = productInLocalStorage[k].color;
                
                    // filtrer l'élément cliqué par le bouton supprimer en respectant les conditions du callback
                    productInLocalStorage = productInLocalStorage.filter( elt => elt.id !== deleteId || elt.color !== deleteColor);
                      
                    // envoyer les nouvelles données dans le localStorage
                    localStorage.setItem('product', JSON.stringify(productInLocalStorage));
                
                    // avertir de la suppression et recharger la page
                    alert('Votre article a bien été supprimé.');
                    window.location.href = "cart.html";
                    });
                  }
                }

                // Fonction pour changer la quantité d'un article
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
                        color: productInLocalStorage[j].color,   
                        quantity: itemNewQtt, // avec la nouvelle quantité souhaitée
                      };
                
                      // actualiser le localStorage avec les nouvelles données récupérées
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

                // Fonction pour afficher le total des articles dans le panier
                function totalArticles() {
                  let totalItems = document.getElementById ("totalQuantity");
                  let totalQuantity = 0;

                  for (let j = 0; j < productInLocalStorage.length; j++) {
                    console.log(productInLocalStorage[j].quantity)
                    
                    totalQuantity += parseInt(productInLocalStorage[j].quantity);

                    totalItems.innerHTML = totalQuantity;
                  }
                }

                // Fonction pour calculer le prix total du panier
                function priceAmount() {
                  // Récupération du tableau d'articles stocké dans le local storage
                  let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
                
                  // Initialisation du prix total à 0
                  let totalPrice = 0;
                  const calculPrice = document.getElementById ("totalPrice");

                
                  // Pour chaque article dans le tableau
                  for (let m = 0; m < productInLocalStorage.length; m++) {
                    // Récupération de l'ID de l'article
                    let productId = productInLocalStorage[m].id;
                
                    // Appel de l'API pour récupérer les détails de l'article
                    fetch(`http://localhost:3000/api/products/${productId}`)
                      .then(response => response.json())
                      .then(data => {
                        // Mise à jour du prix total en ajoutant le prix de l'article actuel
                        totalPrice = productInLocalStorage[m].quantity * data.price;
                                  console.log(totalPrice)
                                  calculPrice.textContent = totalPrice;
                      });
                  }
            }
            })
    }
  }

    
    
    

//     // Récupérer les produts stockés dans le localstorage
// let products = [];
// let productInLocalStorage = JSON.parse(localStorage.getItem('product'));

// // Affichez les produits du panier



// // je sélectionne la partie html concernée par la modification
// let cartAndFormContainer = document.getElementById('cartAndFormContainer');

//   // si le panier est vide : afficher 'le panier est vide'
// if(productInLocalStorage === null || productInLocalStorage == 0) {
//   alert('Votre panier est vide ! Merci de sélectionner des produits depuis la page d\'accueil')
//   document.querySelector("#cart__items").innerHTML =`
//   <div class="cart__empty">
//     <p>Votre panier est vide ! <br> Merci de sélectionner des produits depuis la page d'accueil</p>
//   </div>`;
// } else{

//   // si le panier n'est pas vide : afficher les produits dans le localStorage

//   let itemCards = [];

//   // expression initiale; condition; incrémentation
//   for (i = 0; i < productInLocalStorage.length; i++) {
//     products.push(productInLocalStorage[i].id);


//     /* le code suivant sera injecté à chaque tour de boucle
//     selon la longueur des produits dans le local storage */

//     itemCards = itemCards + `
      
//       <article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">
//       <div class="cart__item__img">
//         <img src="${productInLocalStorage[i].image}" alt="${productInLocalStorage[i].alt}">
//       </div>
//       <div class="cart__item__content">
//         <div class="cart__item__content__titlePrice">
//           <h2>${productInLocalStorage[i].name}</h2>
//           <p>${productInLocalStorage[i].color}</p>
//           <p>${productInLocalStorage[i].price} €</p>
//         </div>
//         <div class="cart__item__content__settings">
//           <div class="cart__item__content__settings__quantity">
//             <p>Qté : </p>
//             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}">
//           </div>
//           <div class="cart__item__content__settings__delete">
//             <p class="deleteItem">Supprimer</p>
//           </div>
//         </div>
//       </div>
//     </article>
//       `;
//   }
//   if (i === productInLocalStorage.length) {
//     const itemCart = document.getElementById('cart__items');
//     itemCart.innerHTML += itemCards;
//   }

// // je modifie la quantité dans le panier

//   changeQtt();

//   // je supprime un produit dans le panier

//   deleteArticle();

//   // j'affiche le total des articles dans le panier

//   totalArticles();

//   // je calcule le montant total du panier

//   priceAmount();

// } // fin else : s'il y a des produits dans le panier

// function deleteArticle() {
//   const deleteItem = document.querySelectorAll('.deleteItem');

//   for (let k = 0; k < deleteItem.length; k++) { 
//     deleteItem[k].addEventListener('click', (event) => {
//     event.preventDefault();

//     // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
//     let deleteId = productInLocalStorage[k].id;
//     let deleteColor = productInLocalStorage[k].color;

//     // filtrer l'élément cliqué par le bouton supprimer en respectant les conditions du callback

//     productInLocalStorage = productInLocalStorage.filter( elt => elt.id !== deleteId || elt.color !== deleteColor);
      
//     // envoyer les nouvelles données dans le localStorage
//     localStorage.setItem('product', JSON.stringify(productInLocalStorage));

//     // avertir de la suppression et recharger la page
//     alert('Votre article a bien été supprimé.');
//     window.location.href = "cart.html";
//     });
//   }
// }

// function changeQtt() {
//   let itemQtt = document.querySelectorAll('.itemQuantity');
//   for (let j = 0; j < itemQtt.length; j++) {
//     itemQtt[j].addEventListener('change', (event) => {
//       event.preventDefault();
//       /* sélection de la nouvelle quantité
//       qu'on va sauvegarder dans un nouveau tableau
//       avec les autres éléments du localStorage */
//       let itemNewQtt = itemQtt[j].value;
//       const newLocalStorage = {
//         id: productInLocalStorage[j].id,
//         image: productInLocalStorage[j].image,
//         alt: productInLocalStorage[j].alt,
//         name: productInLocalStorage[j].name,
//         color: productInLocalStorage[j].color,
//         price: productInLocalStorage[j].price,   
//         quantity: itemNewQtt, // avec la nouvelle quantité souhaitée
//       };

//       // actualiser le localStorage avec les nouvelles données récupérées... 
//       productInLocalStorage[j] = newLocalStorage;
//       // en transformant les Js en Json
//       localStorage.setItem('product', JSON.stringify(productInLocalStorage));

//       // avertir de la modification et mettre à jour les totaux
//       alert('Votre panier est à jour.');
//       totalArticles();
//       priceAmount();
//     })
//   }
// }

// function priceAmount() {
//   const calculPrice = [];
//   for (m = 0; m < productInLocalStorage.length; m++) {
//     // prix de l'article quantité * prix
//     const cartAmount = productInLocalStorage[m].price * productInLocalStorage[m].quantity;
//     calculPrice.push(cartAmount);

//     /* la fonction reduce() permet de garder en mémoire les résultats de l'opération
//     elle fonctionne comme une boucle, avec un accumulateur et la valeur courante */
//     const reduce = (previousValue, currentValue) => previousValue + currentValue;
//     total = calculPrice.reduce(reduce);
//   }
//   const totalPrice = document.getElementById('totalPrice');
//   totalPrice.textContent = total;
// }

// function totalArticles() {
//   let totalItems = 0;
//   for (l in productInLocalStorage) {
//     /* analyser et convertir la valeur 'quantité' dans le localstorage en une chaîne
//     et renvoie un entier (parseInteger), sur la base décimale de 10*/
//     const newQuantity = parseInt(productInLocalStorage[l].quantity, 10);

//     // attribuer la valeur retournée par parseInt à la variable totalItems
//     totalItems += newQuantity;
//   }
//     // attribuer à #totalQuantité la valeur de totalItems et l'afficher dans le DOM
//     const totalQuantity = document.getElementById('totalQuantity');
//     totalQuantity.textContent = totalItems;
// }

// // Informations de l'utilisateur
// // Récupérer les données du formulaires
// // Vérifier la validations des entrées (nom, mail, etc)
// // Envoyer le formulaire dans le localstorage

// // j'envoi le formulaire dans le serveur
// function postForm() {
//   const order = document.getElementById('order');
//   order.addEventListener('click', (event) => {
//     event.preventDefault();
//     //  J'ai ajouté une condition pour qu'il soit
//     // impossible de commander sans avoir sélectionner un article.
//     if (productInLocalStorage === null || productInLocalStorage == 0) {
//       alert('Votre panier est vide ! Merci de sélectionner des produits depuis la page d\'accueil')
//       return false; 
//     } 
  

//   // je récupère les données du formulaire dans un objet
//   const contact = {
//     firstName : document.getElementById('firstName').value,
//     lastName : document.getElementById('lastName').value,
//     address : document.getElementById('address').value,
//     city : document.getElementById('city').value,
//     email : document.getElementById('email').value
//   }


//   // Vérification des entrées avec Regex
  
//   //contrôle prénom
//   function controlFirstName() {
//     let validFirstName = contact.firstName;
//     if (/^[A-Z][A-Za-z\é\è\ê\-]{3,25}$/.test(validFirstName)) {
//       console.log('Coucou cest moi')
//       return true
//     } else {
//       console.log(validFirstName)
//       let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
//       firstNameErrorMsg.innerText = "Merci de vérifier le prénom, 3 caractères minimum";
//       return false
//     }
//   } 

//   // contrôle nom
//   function controlName() {
//     let validName = contact.lastName;
//     if (/^[A-Z][A-Za-z\é\è\ê\-]{3,25}$/.test(validName)) {
//       return true
//     } else {
//       let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
//       lastNameErrorMsg.innerText = "Merci de vérifier le nom, 3 caractères minimum, avec des lettres uniquement";
//     }
//   }

//   // contrôle adresse
//   function controlAddress() {
//     let validAddress = contact.address;
//     if (/^[a-zA-Z0-9.,-_ ]{5,70}[ ]{0,2}$/.test(validAddress)) {
//       return true
//     } else {
//       let addressErrorMsg = document.getElementById('addressErrorMsg');
//       addressErrorMsg.innerText = "Merci de vérifier l'adresse, alphanumérique et sans caractères spéciaux";
//     }
//   } 

//   // contrôle ville
//   function controlCity() {
//     let validCity = contact.city;
//     if (/^[a-zA-Z0-9\s,'-]{3,}$/.test(validCity)) {
//       return true
//     } else {
//       let cityErrorMsg = document.getElementById('cityErrorMsg');
//       cityErrorMsg.innerText = "Merci de vérifier le nom de la ville, 3 caractères minimum, avec des lettres uniquement";
//     }
//   }

//   // contrôle email
//   function controlEmail() {
//     let validEmail = contact.email;
//     if (/^[A-Za-z0-9+_.-]+@(.+)$/.test(validEmail)) {
//       return true
//     } else {
//       let emailErrorMsg = document.getElementById('emailErrorMsg');
//       emailErrorMsg.innerText = "Erreur ! Email non valide";
//     }
//   }



//   function checkAnswers(firstName, name, address, city, email) {
//     // Vérifiez si les réponses des fonctions sont toutes égales à true
//     if (controlFirstName(firstName) && controlName(name) && controlAddress(address) && controlCity(city) && controlEmail(email)) {
//       return true;
//     } else {
//       console.log(controlFirstName())
//       console.log(controlName())     
//       console.log(controlAddress())
//       console.log(controlCity())
//     console.log(controlEmail())
//       alert('Merci de revérifier les données du formulaire')
//       return false;
//     }
//   }








//   // // Après vérification des entrées j'envoi l'objet contact dans le localStorage

//   // function validControl() {
//   //   if (controlFirstName() && controlName() && controlAddress() && controlCity() && controlEmail()) {
//   //     // J'ai supprimé cette ligne pour que le contact apparaissent plus dans le localStorage
//   //     // localStorage.setItem('contact', JSON.stringify(contact));
//   //     return true;
//   //   } else {
//   //     console.log(controlFirstName())
//   //     console.log(controlName())
//   //     console.log(controlAddress())
//   //     console.log(controlCity())
//   //     console.log(controlEmail())
//   //       alert('Merci de revérifier les données du formulaire')
//   //     return false
//   //     }
//   // }

//   // validControl()
//   checkAnswers()

//   // je mets les valeurs du formulaire et les produits sélectionnés dans un objet

//   const sendFormData = {
//     contact,
//     products,
//   }

//   // j'envoie le formulaire + localStorage (sendFormData) au serveur

//   const options = {
//     method: 'POST',
//     body: JSON.stringify(sendFormData),
//     headers: { 
//       'Content-Type': 'application/json',
//     }
//   };

//   fetch("http://localhost:3000/api/products/order", options)
//     .then(response => response.json())
//     .then(data => {
//       // J'ai supprimer cette ligne pour que l'orderID ne soit plus dans le localStorage.
//       // localStorage.setItem("orderID", data.orderId);
//       // if (validControl()) {
//       document.location.href = 'confirmation.html?id=' + data.orderId
    
//     });

// })
// }

// postForm();

