import { updateFavIcon as updateIcon, updateCartIcon, createProduct } from "./main.js"


const favsNum = document.getElementById("favs-num")
const productsContainer = document.getElementById("products")
const noProductsMessage = document.getElementById("no-products")
const removeAll = document.getElementById("remove-all")
const moveCartAll = document.getElementById("move-all")
const moreProducts = document.getElementById("more-products")
let favItemsNEW = []
let forYouProducts = []

updateNum()

if (localStorage.getItem("favorites")) {
  favItemsNEW = JSON.parse(localStorage.getItem("favorites"))
}



noProductsMessage.remove()
if (favItemsNEW.length > 0) {
  fetch("data/all-products.json").then(res => res.json()) 
  .then(data => {
    data.forEach(product => {
      if (favItemsNEW.includes(product.data)) {
        const eleProduct = createFavProduct(product)
        productsContainer.append(eleProduct)
      } else {
        forYouProducts.push(product)
      }
    });
    updateForYouProducts()
  })
} else productsContainer.append(noProductsMessage)

removeAll.addEventListener("click", () => {
  localStorage.setItem("favorites", JSON.stringify([]))
  productsContainer.innerHTML = ""
  fetch("data/all-products.json").then(res => res.json()) 
  .then(data => {
    data.forEach(product => {
      if (JSON.parse(localStorage.getItem("favorites")).includes(product.data)) {
        const eleProduct = createFavProduct(product)
        productsContainer.append(eleProduct)
      }
    });
  })
  updateNum()
  updateIcon()
})

moveCartAll.addEventListener("click", () => {
  if (localStorage.getItem("cartItems")) {
    let favoritesItems = JSON.parse(localStorage.getItem("favorites")) || []
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

    favoritesItems.forEach(item => {
      if (!cartItems.includes(item)) {
        cartItems.push(item)
      }
    })

    localStorage.setItem("cartItems", JSON.stringify(cartItems))

  } else {
    localStorage.setItem("cartItems", localStorage.getItem("favorites"))
  }
  updateCartIcon()
})




function updateNum() {
  favsNum.innerHTML = JSON.parse(localStorage.getItem("favorites")).length
  if (JSON.parse(localStorage.getItem("favorites")).length === 0) {
    productsContainer.append(noProductsMessage)
  }
}

function createFavProduct(prodObj) {
  const template = `
  <div data-product='${prodObj.data}' >
    <div class="relative rounded-sm bg-(--bg) flex items-center justify-center aspect-square lg:aspect-[unset] lg:h-[230px]">
      <img src="${prodObj.img}" class="w-[70%] max-h-[80%] object-contain" alt="${prodObj.title}">
      <div class="remove"><img src="./assets/icons/remove.png" alt="remove"></div>
      <div class="view"><img src="./assets/icons/eye.svg" alt="View product"></div>
    </div>
    <p class="text-[12px] md:text-[16px] uppercase font-[500] my-2 md:mt-3">${prodObj.title}</p>
    <p class="text-[12px] md:text-[16px] uppercase mb-2 md:mb-2.5 "><span class="mr-1 text-(--red)" >${prodObj.price}</span> <span class="text-gray-400 line-through">${prodObj.oldPrice}</span></p>
  </div>`

  const wrapper = document.createElement('div')
  wrapper.innerHTML = template.trim()

  wrapper.querySelector(".view").addEventListener("click", () => {
    console.log("go to product page")
  })

  wrapper.querySelector(".remove").addEventListener("click", () => {
    let temp = JSON.parse(localStorage.getItem("favorites"))
    temp.splice(temp.indexOf(prodObj.data), 1)
    localStorage.setItem("favorites", JSON.stringify(temp))
    productsContainer.innerHTML = ""
    fetch("data/all-products.json").then(res => res.json()) 
    .then(data => {
      data.forEach(product => {
        if (JSON.parse(localStorage.getItem("favorites")).includes(product.data)) {
          const eleProduct = createFavProduct(product)
          productsContainer.append(eleProduct)
        }
      });
    })
    updateNum()
    updateIcon()
  })

  return wrapper.firstElementChild
}


function updateForYouProducts() {
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
    moreProducts.append(createProduct(product))
  })
}