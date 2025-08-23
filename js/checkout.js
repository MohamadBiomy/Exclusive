

const productsContainer = document.getElementById("products-checkout")


if (localStorage.getItem("cartItems")) {

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

        productsContainer.append(createOutProduct(element, count))
      }
    });
    updateTotal()
  })


} 

function updateTotal() {
  const totalElements = document.querySelectorAll(".total-price")

  const eles = productsContainer.querySelectorAll(".product")
  let total = 0

  eles.forEach(ele => {
    total += +(ele.querySelector("#total").innerHTML.split("$").join(""))
  })

  totalElements.forEach(e => e.innerHTML = `$${total}`)
}

function updateCurrentProd(data) {
  localStorage.setItem("current", JSON.stringify(data))
}

function addZero(num) {
  if (num.toString().length === 1) {
    return `0${num}`
  } else {
    return num
  }
}



function createOutProduct(prodObj, count) {

  const template = `
          <div class="items-center justify-between flex mb-4 md:mb-8 product">
          <div class="flex items-center gap-1.5 md:gap-3">
            <img src="${prodObj.img}" id="image" alt="product" class="w-7 md:w-12">
            <a href="./product.htm" class="text-[12px] md:text-base">${prodObj.title}</a>
          </div>
          <p class="text-[12px] md:text-base" id="price">(${+count}) <span id="total">$${addZero( +count * +prodObj.price.split("$").join("") )}</span></p>
        </div>
  `

  const div = document.createElement("div")
  div.innerHTML = template

  div.querySelector("a").addEventListener("click", () => {
    updateCurrentProd(prodObj.data)
  })

  return div

}























// VALIDATION start ----------------------------

const form = document.querySelector('form');
const sendButton = document.getElementById('send');

// Required field IDs
const requiredFields = ['name', 'street', 'town', 'number', 'email'];

// Validation patterns
const validationPatterns = {
  name: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Please enter a valid name (2-50 characters, letters only)'
  },
  street: {
      pattern: /^[a-zA-Z0-9\s,.-]{5,100}$/,
      message: 'Please enter a valid street address (5-100 characters)'
  },
  town: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Please enter a valid town/city name (2-50 characters, letters only)'
  },
  number: {
      pattern: /^[\d]{0,15}$/,
      message: 'Please enter a valid phone number'
  },
  email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
  }
};

// Function to show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.nextElementSibling;
    
    if (errorSpan && errorSpan.tagName === 'SPAN') {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
    
    field.classList.add('border-red-500');
    field.classList.remove('border-green-500');
}

// Function to clear error message
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = field.nextElementSibling;
    
    if (errorSpan && errorSpan.tagName === 'SPAN') {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }
    
    field.classList.remove('border-red-500');
    field.classList.add('border-green-500');
}

// Function to validate a single field
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    // Check if field is empty
    if (!value) {
        showError(fieldId, `This field is required`);
        return false;
    }
    
    // Check pattern validation
    if (validationPatterns[fieldId]) {
        if (!validationPatterns[fieldId].pattern.test(value)) {
            showError(fieldId, validationPatterns[fieldId].message);
            return false;
        }
    }
    
    // Clear error if validation passes
    clearError(fieldId);
    return true;
}

// Function to validate all required fields
function validateForm() {
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Add real-time validation on input
requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    
    field.addEventListener('input', function() {
        if (this.value.trim()) {
            validateField(fieldId);
        } else {
            // Clear error when field is empty
            const errorSpan = this.nextElementSibling;
            if (errorSpan && errorSpan.tagName === 'SPAN') {
                errorSpan.textContent = '';
                errorSpan.style.display = 'none';
            }
            this.classList.remove('border-red-500', 'border-green-500');
        }
    });
    
    field.addEventListener('blur', function() {
        if (this.value.trim()) {
            validateField(fieldId);
        }
    });
});

// Handle form submission
sendButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Form is valid - clear all form fields
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.value = '';
            // Clear any validation styling
            field.classList.remove('border-red-500', 'border-green-500');
            // Clear error messages
            const errorSpan = field.nextElementSibling;
            if (errorSpan && errorSpan.tagName === 'SPAN') {
                errorSpan.textContent = '';
                errorSpan.style.display = 'none';
            }
        });
        
        // Clear optional fields as well
        const optionalFields = ['company', 'floor'];
        optionalFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });
        
        // Redirect to index.htm
        window.location.href = 'index.htm';

        localStorage.removeItem("cartItems")
        localStorage.removeItem("counts")
        localStorage.removeItem("current")
    } else {
        // Form has errors - scroll to first error
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Prevent form submission on Enter key
form.addEventListener('submit', function(e) {
    e.preventDefault();
});


// VALIDATION end ----------------------------


