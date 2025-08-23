import { updateCartIcon } from "./main.js"

const main = document.querySelector("main")
const noProductsMessage = document.getElementById("no-products")
noProductsMessage.remove()
const totalPrices = document.querySelectorAll(".total-price")

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
    updateTotalPriceSS()
  })

} else {
  main.append(noProductsMessage)
  updateTotalPriceSS()
}










function createCartProduct(prodObj, count = "01") {
  const template = `
      <div class="container grid grid-cols-4 gap-2 mt-10 items-center relative" data-product="${prodObj.data}">
        <div class="remove-prod aspect-square rounded-full w-4 md:w-6 cursor-pointer bg-(--red) flex items-center justify-center
        absolute left-[90%] top-[50%] -translate-x-1/2 -translate-y-1/2">
          <img src="./assets/icons/x.svg" class="brightness-0 invert w-[75%]" alt="x">
        </div>
      <div class="flex items-center gap-1.5 md:gap-3">
        <img src="${prodObj.img}" alt="img" class="w-5 md:w-10">
        <a href="./product.htm" class="text-[10px] md:text-base">${prodObj.title}</a>
      </div>
      <p class="text-[12px] md:text-base" id="price">${prodObj.price}</p>
      <div class="flex items-center border border-gray-300 rounded w-fit gap-3 md:gap-5 md:py-3 py-2 px-3 md:px-4 pr-2 md:pr-3">
        <p class="text-[14px] md:text-base" id="show-count">${addZero(+count)}</p>
        <div class="flex flex-col items-center gap-1">
          <img class="cursor-pointer" id="up" src="./assets/icons/angel-up.png" alt="up">
          <img class="cursor-pointer" id="down" src="./assets/icons/angel-down.png" alt="down">
        </div>
      </div>
      <p class="text-[12px] md:text-base" id="total">$${+prodObj.price.split("$").join("") * +count}</p>
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

  const showCount = div.querySelector("#show-count")

  div.querySelector("#up").addEventListener("click", () => {
    increaseCount(prodObj.data, showCount)
  })
  div.querySelector("#down").addEventListener("click", () => {
    decreaseCount(prodObj.data, showCount)
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
  updateTotalPriceSS()
}

function addZero(num) {
  if (num.toString().length === 1) {
    return `0${num}`
  } else {
    return num
  }
}

function updateCurrentProd(data) {
  localStorage.setItem("current", JSON.stringify(data))
}
function decreaseCount(prodData, showCount) {

  let count = +showCount.innerHTML

  if (count > 1) {
    count--
  }

  showCount.innerHTML = addZero(count)

  updateCount(prodData, count)
}
function increaseCount(prodData, showCount) {

  let count = +showCount.innerHTML

  count++

  showCount.innerHTML = addZero(count)

  updateCount(prodData, count)
}



function updateCount(prodData, count) {
  if (localStorage.getItem("counts")) {
    let counts = JSON.parse(localStorage.getItem("counts"))

    counts.forEach(obj => {
      if (obj.product === prodData) {
        counts.splice(counts.indexOf(obj), 1)
      }
    })

    counts.push({product: prodData, count: count})

    localStorage.setItem("counts", JSON.stringify(counts))
  } else {
    localStorage.setItem("counts", JSON.stringify([{product: prodData, count, count}]))
  }

  updateTotalPrice(prodData, count)
}


function updateTotalPrice(prodData, count) {
  const totalEle = main.querySelector(`[data-product="${prodData}"] #total`)
  const priceEle = main.querySelector(`[data-product="${prodData}"] #price`)
  let price = +priceEle.innerHTML.split("$").join("")

  totalEle.innerHTML = `$${+count * price}`
  updateTotalPriceSS()
}

function updateTotalPriceSS() {
  const eles = main.querySelectorAll("[data-product]")
  let total = 0

  eles.forEach(ele => {
    total += +(ele.querySelector("#total").innerHTML.split("$").join(""))
  })

  totalPrices.forEach(e => e.innerHTML = `$${total}`)
}