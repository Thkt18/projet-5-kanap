const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const newID = urlParams.get("id")


fetch(`http://localhost:3000/api/products/${newID}`)
    .then((response) => response.json())
    .then((res) => kanapData(res))
    .catch(_error => {
      alert('Oops ! Le serveur ne répond pas.');
    });

function kanapData(kanap) {
    const { altTxt, colors, description, imageUrl, name, price} = kanap
    makeImage(imageUrl, altTxt)
    makeTitle(name)
    makePrice(price)
    makeDescription(description)
    makeColors(colors)
    makeQuantity(quantity)
}

function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img ")
    if (parent != null) parent.appendChild(image)
}

function makeTitle(name) {
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}

function makePrice(price) {
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}

function makeDescription(description) {
    const p = document.querySelector("#description")
    if (p != null) p.textContent = description
}

function makeQuantity(quantity) {
    let makeQuantity = document.getElementById("quantity");
    return quantity.value;
}


function makeColors(colors) {
    const select = document.querySelector("#colors")
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild(option)
        })
    }
}




const selectQuantity = document.getElementById('quantity');
const selectColors = document.getElementById('colors');


const addToCart = document.getElementById('addToCart');
addToCart.addEventListener('click', (event) => {
  event.preventDefault();

  const selection = {
    id: newID,
    image: makeImage,
    name: makeTitle,
    price: makePrice,
    color: makeColors,
    quantity: makeQuantity,
  };

  let productInLocalStorage =  JSON.parse(localStorage.getItem('product'));


  const addProductLocalStorage = () => {
  productInLocalStorage.push(selection);
  localStorage.setItem('product', JSON.stringify(productInLocalStorage));
  }


  let addConfirm = () => {
    alert('Le produit a bien été ajouté au panier');
  }

  let update = false;
  

  if (productInLocalStorage) {
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
 
  else {
    productInLocalStorage = [];
    addProductLocalStorage();
    addConfirm();
  }
});