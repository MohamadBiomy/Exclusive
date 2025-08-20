import { createProduct, toggleClass, updateFavPage } from "./main.js"

// Variables
const flashSalesContainer = document.getElementById("flash-sales")
const bestSellingContainer = document.getElementById("best-selling")
const ourProductsContainer = document.getElementById("our-products")
let favIconPage, cartIconPage;


// Initialize components first
async function initializeApp() {

  // Wait for all components to load
  await Promise.all([
    flashSalesAppend(),
    bestSellingAppend(),
    ourProductsAppend()
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
async function bestSellingAppend() {
  const res = await fetch(`data/best-selling.json`)
  const data = await res.json()
  data.forEach(product => {
    const productElement = createProduct(product)
    bestSellingContainer.append(productElement)
  })
}
async function ourProductsAppend() {
  const res = await fetch(`data/our-products.json`)
  const data = await res.json()
  data.forEach(product => {
    const productElement = createProduct(product)
    ourProductsContainer.append(productElement)
  })
}

// Initialize event listeners after components are ready
function initializeEventListeners() {
  // Add to favorite and View Icons
  const favIcons = document.querySelectorAll(".fav")
  favIconPage = document.getElementById("fav-page")
  cartIconPage = document.getElementById("cart-page")

  if (favIcons) {
    favIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        const product = icon.parentElement.parentElement.dataset.product
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
        updateFavPage()
      })
    })
  }
}

// Start the application
initializeApp()

// Carousal
const track = document.querySelector('.carousel-track');
if (track) {
  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  let updateArrowState;
  function updateCarousel() {
    track.style.transform = `translateX(-${index * 50}%)`;
    if (typeof updateArrowState === 'function') {
      updateArrowState();
    }
  }

  // --- TOUCH EVENTS (mobile) ---
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });
  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    handleSwipe();
    isDragging = false;
  });

  // --- MOUSE EVENTS (desktop) ---
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });
  track.addEventListener('mouseup', () => {
    if (!isDragging) return;
    handleSwipe();
    isDragging = false;
  });
  track.addEventListener('mouseleave', () => {
    if (isDragging) {
      handleSwipe();
      isDragging = false;
    }
  });

  // --- SWIPE HANDLER ---
  function handleSwipe() {
    const deltaX = startX - currentX;
    if (deltaX > 50 && index < track.children.length - 1) {
      index++;
    } else if (deltaX < -50 && index > 0) {
      index--;
    }
    updateCarousel();
  }

  // --- ARROW CONTROLS ---
  // Create arrow buttons
  const carousel = track.closest('.carousel');
  if (carousel) {
    // Style helpers
    const arrowBase =
      'carousel-arrow absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center ' +
      'w-8 h-8 rounded-full shadow-lg transition-all duration-200 ' +
      'bg-gradient-to-br from-white/90 to-white/60 hover:from-white hover:to-white ' +
      'border border-black/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/30 ' +
      'backdrop-blur-sm';

    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
    leftArrow.setAttribute('aria-label', 'Previous');
    leftArrow.className = arrowBase + ' left-2';
    leftArrow.style.fontSize = '1.15rem';
    leftArrow.style.color = '#222';
    leftArrow.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.10)';
    leftArrow.style.opacity = '0.92';
    leftArrow.style.cursor = 'pointer';
    leftArrow.style.padding = '0';

    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
    rightArrow.setAttribute('aria-label', 'Next');
    rightArrow.className = arrowBase + ' right-2';
    rightArrow.style.fontSize = '1.15rem';
    rightArrow.style.color = '#222';
    rightArrow.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.10)';
    rightArrow.style.opacity = '0.92';
    rightArrow.style.cursor = 'pointer';
    rightArrow.style.padding = '0';

    // Add subtle shadow and hover effect
    leftArrow.addEventListener('mouseenter', () => {
      leftArrow.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.18)';
      leftArrow.style.opacity = '1';
    });
    leftArrow.addEventListener('mouseleave', () => {
      leftArrow.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.10)';
      leftArrow.style.opacity = '0.92';
    });
    rightArrow.addEventListener('mouseenter', () => {
      rightArrow.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.18)';
      rightArrow.style.opacity = '1';
    });
    rightArrow.addEventListener('mouseleave', () => {
      rightArrow.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.10)';
      rightArrow.style.opacity = '0.92';
    });

    // Insert arrows into carousel
    carousel.appendChild(leftArrow);
    carousel.appendChild(rightArrow);

    // Arrow event listeners
    leftArrow.addEventListener('click', () => {
      if (index > 0) {
        index--;
        updateCarousel();
      }
    });
    rightArrow.addEventListener('click', () => {
      if (index < track.children.length - 1) {
        index++;
        updateCarousel();
      }
    });

    // Keyboard arrow support
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        if (index > 0) {
          index--;
          updateCarousel();
        }
      } else if (e.key === 'ArrowRight') {
        if (index < track.children.length - 1) {
          index++;
          updateCarousel();
        }
      }
    });

    // Update arrow state (disable at ends, fade out)
    updateArrowState = function() {
      if (index === 0) {
        leftArrow.disabled = true;
        leftArrow.style.opacity = '0.4';
        leftArrow.style.pointerEvents = 'none';
      } else {
        leftArrow.disabled = false;
        leftArrow.style.opacity = '0.92';
        leftArrow.style.pointerEvents = '';
      }
      if (index === track.children.length - 1) {
        rightArrow.disabled = true;
        rightArrow.style.opacity = '0.4';
        rightArrow.style.pointerEvents = 'none';
      } else {
        rightArrow.disabled = false;
        rightArrow.style.opacity = '0.92';
        rightArrow.style.pointerEvents = '';
      }
    }
    updateArrowState();
  }
}

// CountDown Timer - Flash Sales
const counters = document.querySelectorAll(".counter")
if (counters) {
  counters.forEach(counter => {
    let days = +counter.dataset.days;
    let hours = +counter.dataset.hours;
    let minutes = +counter.dataset.minutes;
    let seconds = +counter.dataset.seconds;
  
    const daysElement = counter.querySelector("[data-type='days'] p")
    daysElement.innerHTML = days.toString().length < 2 ? `0${days}` : days
    const hoursElement = counter.querySelector("[data-type='hours'] p")
    hoursElement.innerHTML = hours.toString().length < 2 ? `0${hours}` : hours
    const minutesElement = counter.querySelector("[data-type='minutes'] p")
    minutesElement.innerHTML = minutes.toString().length < 2 ? `0${minutes}` : minutes
    const secondsElement = counter.querySelector("[data-type='seconds'] p")
    secondsElement.innerHTML = seconds.toString().length < 2 ? `0${seconds}` : seconds
  
    let timer = setInterval(() => {
      let value = (--secondsElement.innerHTML).toString()
      secondsElement.innerHTML = value.length < 2 ? `0${value}` : value
      if (+secondsElement.innerHTML === 0) {
        secondsElement.innerHTML = 59
        minutesElement.innerHTML--
        minutesElement.innerHTML = minutesElement.innerHTML.toString().length < 2 ? `0${minutesElement.innerHTML}` : minutesElement.innerHTML
        if (+minutesElement.innerHTML === 0) {
          minutesElement.innerHTML = 59
          hoursElement.innerHTML--
          hoursElement.innerHTML = hoursElement.innerHTML.toString().length < 2 ? `0${hoursElement.innerHTML}` : hoursElement.innerHTML
          if (+hoursElement.innerHTML === 0) {
            hoursElement.innerHTML = 23
            daysElement.innerHTML--
            daysElement.innerHTML = daysElement.innerHTML.toString().length < 2 ? `0${daysElement.innerHTML}` : daysElement.innerHTML
          }
        }
      }
    }, 1000)
  })
} 

// Categories
const categories = document.querySelectorAll("#categories > div")
toggleClass(categories)
