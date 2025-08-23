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

  // Put class active on navigation links
  header.querySelectorAll("li a").forEach(a => {
    if (document.body.dataset.page === a.dataset.page) {
      a.classList.add("active")
    } else if (document.body.dataset.page === "login" && a.dataset.page === "signup") {
      a.classList.add("active")
      a.href = "./login.htm"
      a.innerHTML = "LogIn"
    }
  })
  
  // Now initialize DOM elements after components are loaded
  initializeEventListeners()
  updateFavIcon()
  updateCartIcon()
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
  <div data-product='${prodObj.data}'>

    <div class="relative rounded-sm bg-(--bg) flex items-center cursor-pointer justify-center aspect-square lg:aspect-[unset] lg:h-[230px] overflow-hidden group">
      <img src="${prodObj.img}" class="w-[70%] go-to-this-prod max-h-[80%] object-contain" alt="${prodObj.title}">
      <div class="fav"><img src="./assets/icons/heart.svg" alt="Add to wishlist"></div>
      <a class="view block" href="./product.htm"><img src="./assets/icons/eye.svg" alt="View product"></a>

      <div id="add-to-cart-btn" class="absolute w-full left-0 top-full transition-all -translate-y-full md:-translate-y-0 duration-300 md:group-hover:-translate-y-full cursor-pointer py-3 bg-black flex items-center justify-center text-white">
        <p class="flex items-center text-[13px] md:text-base"><img src="./assets/icons/cart.png" class="invert mr-1.5 w-4  md:mr-2.5 md:w-6"> Add To Cart</p>
      </div>
    </div>
    <p id="title" class="go-to-this-prod cursor-pointer text-[12px] md:text-[16px] uppercase font-[500] my-2 md:mt-3">${prodObj.title}</p>
    <p class="text-[12px] md:text-[16px] go-to-this-prod uppercase mb-2 md:mb-2.5 "><span class="mr-1 text-(--red)" >${prodObj.price}</span> <span class="text-gray-400 line-through">${prodObj.oldPrice}</span></p>
    <div class="flex items-center gap-2 go-to-this-prod">
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
  // when clicking view icon
  wrapper.querySelector(".view").addEventListener("click", () => {
    localStorage.setItem("current", JSON.stringify(prodObj.data))
  })

  wrapper.querySelector(".go-to-this-prod").addEventListener("click", () => {
    localStorage.setItem("current", JSON.stringify(prodObj.data))
    location.href = "./product.htm"
  })

  wrapper.querySelector("#add-to-cart-btn").addEventListener("click", () => {
    if (localStorage.getItem("cartItems")) {
      let cartItems = JSON.parse(localStorage.getItem("cartItems"))
  
      if (!cartItems.includes(prodObj.data)) {
        cartItems.push(prodObj.data)
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
      }
  
  
  
    } else {
  
      localStorage.setItem("cartItems", JSON.stringify([prodObj.data]))
  
    }

    updateCartIcon()
  })

  const icon = wrapper.querySelector(".fav")

  if (icon) {
    icon.addEventListener("click", () => {
      const product = prodObj.data
      if (localStorage.getItem("favorites")) {
        let favs = JSON.parse(localStorage.getItem("favorites"))
        if (!favs.includes(product)) {
          favs.push(product)
          localStorage.setItem("favorites", JSON.stringify(favs))
          icon.querySelector("img").src = "./assets/icons/red-heart.png"
        } else {
          icon.querySelector("img").src = "./assets/icons/heart.svg"
          favs.splice(favs.indexOf(product), 1)
          localStorage.setItem("favorites", JSON.stringify(favs))
        }
      } else {
        let temp = [product]
        icon.querySelector("img").src = "./assets/icons/red-heart.png"
        localStorage.setItem("favorites", JSON.stringify(temp))
      }
      updateFavIcon()
    })
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

function updateFavIcon() {
  let favItems = JSON.parse(localStorage.getItem("favorites")) || []

  // update data items
  favIconPage.dataset.items = favItems.length

  // update items number
  favIconPage.nextElementSibling.children[0].innerHTML = favItems.length
}
function updateCartIcon() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // update data items
  cartIconPage.dataset.items = cartItems.length

  // update items number
  cartIconPage.nextElementSibling.children[0].innerHTML = cartItems.length
}

export { createProduct, toggleClass, updateFavIcon, updateCartIcon } 