// Variables
let favIconPage, cartIconPage;

// Initialize components first
async function initializeApp() {
  const message = document.getElementById("message")
  const header = document.getElementById("header")
  const footer = document.getElementById("footer")

  
  // Wait for all components to load
  await Promise.all([
    appendComponent(message),
    appendComponent(header),
    appendComponent(footer)
  ])
  
  // Now initialize DOM elements after components are loaded
  initializeEventListeners()
  updateFavPage()
}

// Initialize event listeners after components are ready
function initializeEventListeners() {
  const menu = document.getElementById("menu")
  const burgerIcon = document.getElementById("menu").previousElementSibling
  favIconPage = document.getElementById("fav-page")
  cartIconPage = document.getElementById("cart-page")

  // mobile menu
  burgerIcon.addEventListener("click", () => {
    burgerIcon.classList.toggle("active")
    if (burgerIcon.classList.contains("active")) {
      burgerIcon.src = "./assets/icons/x.svg"
    } else burgerIcon.src = "./assets/icons/menu.svg"
  })
  
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      burgerIcon.classList.remove("active")
    }
  })
}

// Start the application
initializeApp()


// Move to top button
const moveTop = document.getElementById("move-to-top")
if (moveTop) {
  const toggleMoveTopVisibility = () => {
    if (document.documentElement.scrollTop < 1000) {
      moveTop.style.display = "none"
    } else {
      moveTop.style.display = ""
    }
  }

  toggleMoveTopVisibility()
  window.addEventListener("scroll", toggleMoveTopVisibility)

  moveTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}


// FUNCTIONS

async function appendComponent(componentContainer) {

  const component = await getComponent(componentContainer.id)

  componentContainer.innerHTML = component

}
async function getComponent(componentName) {
  const res = await fetch(`./components/${componentName}.htm`)
  const data = await res.text()
  return data
}



function createProduct(prodObj) {

  const template = `
  <div data-product='${prodObj.data}' >
    <div class="relative rounded-sm bg-(--bg) flex items-center justify-center aspect-square lg:aspect-[unset] lg:h-[230px]">
      <img src="${prodObj.img}" class="w-[70%] max-h-[80%] object-contain" alt="${prodObj.title}">
      <div class="fav"><img src="./assets/icons/heart.svg" alt="Add to wishlist"></div>
      <div class="view"><img src="./assets/icons/eye.svg" alt="View product"></div>
    </div>
    <p class="text-[12px] md:text-[16px] uppercase font-[500] my-2 md:mt-3">${prodObj.title}</p>
    <p class="text-[12px] md:text-[16px] uppercase mb-2 md:mb-2.5 "><span class="mr-1 text-(--red)" >${prodObj.price}</span> <span class="text-gray-400 line-through">${prodObj.oldPrice}</span></p>
    <div class="flex items-center gap-2">
      <p class="flex items-center gap-0.5 md:gap-1">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="Rating star">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="Rating star">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="Rating star">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="Rating star">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="Rating star">
      </p>
      <span class="text-[8px] md:text-[10px] text-gray-400">(${prodObj.reviews})</span>
    </div>
  </div>`

  const wrapper = document.createElement('div')
  wrapper.innerHTML = template.trim()
  if (localStorage.getItem("favorites")) {
    let favs = JSON.parse(localStorage.getItem("favorites"))
    if (favs.includes(prodObj.data)) {
      wrapper.querySelector(".fav img").src = "./assets/icons/red-heart.png"
    }
  }
  return wrapper.firstElementChild
}


function toggleClass(elements, className = "active") {
  elements.forEach(element => {
    element.addEventListener("click", () => {
      elements.forEach(ele => ele.classList.remove(className))
      element.classList.add(className)
    })
  });
}

function updateFavPage() {
  let favItems = JSON.parse(localStorage.getItem("favorites")) || []

  // update data items
  favIconPage.dataset.items = favItems.length

  // update items number
  favIconPage.nextElementSibling.children[0].innerHTML = favItems.length

}

export { createProduct, toggleClass, updateFavPage }