const id = new URL(window.location.href).searchParams.get("orderid");
console.log(id);

const orderId = document.getElementById('orderId');
orderId.innerHTML = id;

localStorage.clear();






