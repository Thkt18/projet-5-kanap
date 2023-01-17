// Je redirige l'url de l'api
// je crée une nouvelle url à partir de l'url actuelle 
// et en ajoutant searchParams pour manipuler les paramètres de requête d'URL :

// j'indique que la nouvelle url sera ajoutée d'un id :

let KanapAPI = "http://localhost:3000/api/products/";
const currentLocation = window.location;
const url = new URL(currentLocation);
const id = url.searchParams.get("id")
KanapAPI = KanapAPI + id;
// je crée les variables dont j'ai besoin pour manipuler cette page :
const image = document.getElementsByClassName('item__img');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colors = document.querySelector('#colors');

const quantity = document.querySelector("#quantity");
const toCart = document.getElementById("addToCart");

let imageURL = "";
let imageAlt = "";

// je crée la bonne URL pour chaque produits choisi en ajoutant newID
fetch(KanapAPI)
  .then(res => res.json())
  .then(data => {
    // je modifie le contenu de chaque variable avec les bonnes données :
    image[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageURL = data.imageUrl;
    imageAlt = data.altTxt;
    title.innerHTML = `<h1>${data.name}</h1>`;
    price.innerText = `${data.price}`;
    description.innerText = `${data.description}`;
    // Je modifie le titre de la page avec le nom du canapé choisit
    document.title = data.name;
//  Ajouts des options de couleurs
    for (let addColor of data.colors) {
        const newColor = document.createElement("option");
        newColor.setAttribute("value", `${addColor}`);
        newColor.innerText = addColor;
        colors.appendChild(newColor);
    }
    toCart.addEventListener("click", function () {
        let productInLocalStorage =  localStorage.getItem('product');
        // Verification qu'une couleur et une quantité sont bien attribué avant de passer à la tache suivante
        if(colors.value == "" || quantity.value < 1 || quantity.value > 100){
            alert("Veuillez choisir une couleur et une quantité comprise entre 1 et 100")
        }
        else{
            // Vérification de l'éxistance d'un panier.
            if(productInLocalStorage){
                let valueCart = JSON.parse(productInLocalStorage);
                console.log(valueCart);
                let returnCart = valueCart.find(contentValue => contentValue._id == id && contentValue.color == colors.value);
                let idExist =  valueCart.find(contentValue => contentValue._id == id);
                if (idExist) {
                    if (returnCart) {
                        const checkQuantity = returnCart.quantity + parseInt(quantity.value);
                        if (checkQuantity > 100) {
                            alert("La quantité maximum pour un produit est de 100");
                            quantity.value = 1;
                        }
                        else {
                            returnCart.quantity += parseInt(quantity.value);
                            alert("La quantité de votre article dans le panier à été mis à jour");
                            quantity.value = 1;
                        }

                    }
                    else {
                        let existIndex = valueCart.findIndex(contentValue => contentValue._id == id);
                        valueCart.splice(existIndex, 0, productFormat(data));
                        alert("Votre article a été ajouté au panier");
                        quantity.value = 1;
                    }
                    cartUpdate(valueCart);
                }
                else {
                    valueCart.unshift(productFormat(data));
                    alert("Votre article a été ajouté au panier");
                    quantity.value = 1;
                }
                cartUpdate(valueCart);
            }
            else{
                let valueCart = [];
                valueCart.push(productFormat(data));
                cartUpdate(valueCart);
                alert("Votre article a été ajouté au panier");
                quantity.value = 1;
            }
        }
    });
    })
    .catch(error => console.log(error)
);

// Convertir en {object} pour insérer dans le LocalStorage
function productFormat (data) {
    return productFormated = {
    _id: data._id,
    color: colors.value,
    quantity: parseInt(quantity.value)
    };
};

//  Ajout au panier d'un produit
function cartUpdate (product) {
    localStorage.setItem('product', JSON.stringify(product));
    let cartList = localStorage.getItem('cart');
}