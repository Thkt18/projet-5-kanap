fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        const imageUrl = data[0].imageUrl
        console.log("url de l'image", imageUrl)

        const anchor = document.createElement("a")
        anchor.href = imageUrl
        const items = document.querySelector("#items")
        if (items != null) {
            items.appendChild(anchor)
            console.log("nous avons bien ajouté le liens")
        }

    })