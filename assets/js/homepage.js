import {createProduct} from "./main.js"

const flashSalesContainer = document.getElementById("flash-sales")


// Initialize components first
async function initializeApp() {
  
  // Wait for all components to load
  await Promise.all([
    flashSalesAppend()
  ])
  
  // Now initialize DOM elements after components are loaded
  initializeEventListeners()
}

async function flashSalesAppend() {
  const res = await fetch(`data/flash-sales.json`)
  const data = await res.json()
  data.forEach(product => {
    const productElement = createProduct(product)
    flashSalesContainer.append(productElement)
  })
}

// Initialize event listeners after components are ready
function initializeEventListeners() {
  // Add to favorite and View Icons
  const favIcons = document.querySelectorAll(".fav")
  const viewIcons = document.querySelectorAll(".view")

  if (favIcons || viewIcons) {
    favIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        const product = icon.parentElement.parentElement.dataset.product
        if (localStorage.getItem("favorites")) {
          let favs = JSON.parse(localStorage.getItem("favorites"))
          if (!favs.includes(product)) {
            favs.push(product)
            localStorage.setItem("favorites", JSON.stringify(favs))
          }
        } else {
          let temp = [product]
          localStorage.setItem("favorites", JSON.stringify(temp))
        }
      })
    })
    viewIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        const product = icon.parentElement.parentElement.dataset.product
        // go to product page
      })
    })
  }
}

// Start the application
initializeApp()

