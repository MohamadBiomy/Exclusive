import { toggleClass, updateFavIcon, updateCartIcon, createProduct } from "./main.js";

const sizes = document.querySelectorAll("#size p")
const image = document.getElementById("image")
const title = document.getElementById("title")
const reviews = document.getElementById("reviews")
const price = document.getElementById("price")

const counter = document.getElementById("count")
const plus = counter.parentElement.nextElementSibling
const minus = counter.parentElement.previousElementSibling
const addToCart = document.getElementById("add-to-cart")
const favIcon = document.getElementById("fav-icon")

const moreProductsContainer = document.getElementById("more-products")

let product;

if (localStorage.getItem("current")) {
  product = JSON.parse(localStorage.getItem("current"))
  console.log(product)
  fetch("data/all-products.json").then(res => res.json())
  .then(data => {

    data.forEach(prodObj => {
      if (product === prodObj.data) {
        image.src = prodObj.img
        title.innerHTML = prodObj.title
        reviews.innerHTML = prodObj.reviews
        price.innerHTML = prodObj.price
        document.title = `Exclusive - ${prodObj.title}`
      }
    });

    moreProducts()

  })

  if (localStorage.getItem("favorites")) {
    let favItems = JSON.parse(localStorage.getItem("favorites"))

    if (favItems.includes(product)) {
      favIcon.src = "./assets/icons/red-heart.png"
    }
  }


} else {
  window.location.href = "./error.htm"
}

plus.addEventListener("click", () => {
  counter.innerHTML++
})
minus.addEventListener("click", () => {
  if (+counter.innerHTML > 1) {
    counter.innerHTML--
  }
})


favIcon.addEventListener("click", () => {
  if (localStorage.getItem("favorites")) {

    let favItems = JSON.parse(localStorage.getItem("favorites"))

    if (favItems.includes(product)) {

      favIcon.src = "./assets/icons/heart.svg"
      favItems.splice(favItems.indexOf(product), 1)
      localStorage.setItem("favorites", JSON.stringify(favItems))

    } else {

      favIcon.src = "./assets/icons/red-heart.png"
      favItems.push(product)
      localStorage.setItem("favorites", JSON.stringify(favItems))

    }

  } else {
    localStorage.setItem("favorites", JSON.stringify([product]))
  }

  updateFavIcon()
})


addToCart.addEventListener("click", () => {

  if (localStorage.getItem("cartItems")) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems"))

    if (!cartItems.includes(product)) {
      cartItems.push(product)
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }



  } else {

    localStorage.setItem("cartItems", JSON.stringify([product]))

  }

  if (+counter.innerHTML > 1) {
    if (localStorage.getItem("counts")) {

      let counts = JSON.parse(localStorage.getItem("counts"))
      counts.forEach(obj => {
        if (obj.product === product) {
          counts.splice(counts.indexOf(obj), 1)
        }
      })

      counts.push({product: product, count: +counter.innerHTML})

      localStorage.setItem("counts", JSON.stringify(counts))

    } else {
      localStorage.setItem("counts", JSON.stringify([{product: product, count: +counter.innerHTML}]))
    }
  }

  updateCartIcon()
})


// Sizes
toggleClass(sizes)


async function moreProducts() {

  let forYouProducts = []

  await fetch("data/all-products.json").then(res => res.json())
  .then(data => {
    data.forEach(prod => {
      if (prod.data !== product) {
        forYouProducts.push(prod)
      }
    })
  })

  let productsCount
  if (forYouProducts.length >= 4) {
    productsCount = 4
  } else {
    productsCount = forYouProducts.length
  }
  let productToAppend = new Set()
  while (productToAppend.size < productsCount) {
    const randomNum = Math.floor(Math.random() * forYouProducts.length)
    productToAppend.add(forYouProducts[randomNum])
  }
  productToAppend.forEach(product => {
    moreProductsContainer.append(createProduct(product))
  })

}