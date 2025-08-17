// Variables

// Initialize components first
async function initializeApp() {
  const message = document.getElementById("message")
  const header = document.getElementById("header")
  const flashSalesContainer = document.getElementById("flash-sales")


  
  // Wait for all components to load
  await Promise.all([
    appendComponent(message),
    appendComponent(header),
  ])
  
  // Now initialize DOM elements after components are loaded
  initializeEventListeners()
}

// Initialize event listeners after components are ready
function initializeEventListeners() {
  const menu = document.getElementById("menu")
  const burgerIcon = document.getElementById("menu").previousElementSibling

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

// Carousal
const track = document.querySelector('.carousel-track');
if (track) {
  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 50}%)`;
    updateArrowState();
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
    function updateArrowState() {
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
const counter = document.getElementById("counter")
if (counter) {
  let days = 3;
  let hours = 23;
  let minutes = 12;
  let seconds = 56;

  const daysElement = counter.querySelector("#days p")
  daysElement.innerHTML = days.toString().length < 2 ? `0${days}` : days
  const hoursElement = counter.querySelector("#hours p")
  hoursElement.innerHTML = hours.toString().length < 2 ? `0${hours}` : hours
  const minutesElement = counter.querySelector("#minutes p")
  minutesElement.innerHTML = minutes.toString().length < 2 ? `0${minutes}` : minutes
  const secondsElement = counter.querySelector("#seconds p")
  secondsElement.innerHTML = seconds.toString().length < 2 ? `0${seconds}` : seconds

  let timer = setInterval(() => {
    let value = (--secondsElement.innerHTML).toString()
    console.log()
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
    <div class="relative rounded-sm bg-(--bg) flex items-center justify-center aspect-square">
      <img src="${prodObj.img}" class="w-[70%] max-h-[80%] object-contain" alt="">
      <div class="fav"><img src="./assets/icons/heart.svg" alt=""></div>
      <div class="view"><img src="./assets/icons/eye.svg" alt=""></div>
    </div>
    <p class="text-[12px] md:text-[16px] uppercase my-2 md:my-2.5">${prodObj.title}</p>
    <p class="text-[12px] md:text-[16px] uppercase mb-2 md:mb-2.5 "><span class="text-(--red)" >${prodObj.price}</span> <span class="text-gray-600 line-through">${prodObj.oldPrice}</span></p>
    <div class="flex items-center gap-2">
      <p class="flex items-center gap-0.5 md:gap-1">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="">
        <img src="./assets/icons/star.svg" class="w-2 md:w-3" alt="">
      </p>
      <span class="text-[8px] md:text-[10px] text-gray-600">(${prodObj.reviews})</span>
    </div>
  </div>`
  const wrapper = document.createElement('div')
  wrapper.innerHTML = template.trim()
  return wrapper.firstElementChild
}

export { createProduct }