import { updateCartIcon } from "./main.js"

const main = document.querySelector("main")
const noProductsMessage = document.getElementById("no-products")
noProductsMessage.remove()


if (localStorage.getItem("cartItems") && JSON.parse(localStorage.getItem("cartItems")).length > 0) {
  
  let cartItems = JSON.parse(localStorage.getItem("cartItems"))

  fetch("data/all-products.json").then(res => res.json())
  .then(data => {
    data.forEach(element => {
      if (cartItems.includes(element.data)) {

        let count = "01"

        if (localStorage.getItem("counts")) {
          let counts = JSON.parse(localStorage.getItem("counts"))

          counts.forEach(ele => {
            if (ele.product === element.data) {
              count = ele.count
            }
          })
        }

        main.append(createCartProduct(element, count))
      }
    });
  })

} else {
  main.append(noProductsMessage)
}










function createCartProduct(prodObj, count = "01") {
  const template = `
      <div class="container grid grid-cols-4 gap-2 mt-10 items-center relative">
        <div class="remove-prod aspect-square rounded-full w-4 md:w-6 cursor-pointer bg-(--red) flex items-center justify-center
        absolute left-[90%] top-[50%] -translate-x-1/2 -translate-y-1/2">
          <img src="./assets/icons/x.svg" class="brightness-0 invert w-[75%]" alt="x">
        </div>
      <div class="flex items-center gap-1.5 md:gap-3">
        <img src="${prodObj.img}" alt="img" class="w-5 md:w-10">
        <a href="./product.htm" class="text-[10px] md:text-base">${prodObj.title}</a>
      </div>
      <p class="text-[12px] md:text-base">${prodObj.price}</p>
      <div class="flex items-center border border-gray-300 rounded w-fit gap-3 md:gap-5 md:py-3 py-2 px-3 md:px-4 pr-2 md:pr-3">
        <p class="text-[14px] md:text-base">${addZero(+count)}</p>
        <div class="flex flex-col items-center gap-1">
          <img class="cursor-pointer" src="./assets/icons/angel-up.png" alt="up">
          <img class="cursor-pointer" src="./assets/icons/angel-down.png" alt="down">
        </div>
      </div>
      <p class="text-[12px] md:text-base">${prodObj.price}</p>
    </div>
  `

  const div = document.createElement("div")
  div.innerHTML = template

  div.querySelector(".remove-prod").addEventListener("click", () => {
    removeProd(prodObj.data, div)
  })

  div.querySelector("a").addEventListener("click", () => {
    updateCurrentProd(prodObj.data)
  })

  return div
}

function removeProd(prodData, parent) {
  
  parent.remove()

  let cartItems = JSON.parse(localStorage.getItem("cartItems"))
  cartItems.splice(cartItems.indexOf(prodData), 1)
  localStorage.setItem("cartItems", JSON.stringify(cartItems))

  if (cartItems.length === 0) main.append(noProductsMessage)

  updateCartIcon()

}

function addZero(num) {
  if (num.toString().length === 1) {
    return `0${num}`
  }
}

function updateCurrentProd(data) {
  localStorage.setItem("current", JSON.stringify(data))
}