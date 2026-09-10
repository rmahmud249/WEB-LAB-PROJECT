//==========Banner sliding code Stat===============//
const slides = document.querySelectorAll(".banner-slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slider = document.querySelector(".banner-slider");
let currentSlide = 0;
let autoSlide;
function nextSlide() {
    const current = slides[currentSlide];
    let nextIndex = currentSlide + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    const next = slides[nextIndex];
    next.style.transition = "none";
    next.style.transform = "translateX(100%)";
    next.style.zIndex = "2";
    next.classList.add("active");
    next.offsetHeight;
    current.style.transition = "transform 0.6s ease-in-out";
    next.style.transition = "transform 0.6s ease-in-out";
    current.style.transform = "translateX(-100%)";
    next.style.transform = "translateX(0)";
    dots.forEach(function(dot) {
        dot.classList.remove("active");
    });
    dots[nextIndex].classList.add("active");
    setTimeout(function() {
        current.style.transition = "none";
        current.style.transform = "translateX(100%)";
        current.style.zIndex = "1";
        next.style.zIndex = "2";
    }, 400);
    currentSlide = nextIndex;
}
function previousSlide() {
    const current = slides[currentSlide];
    let previousIndex = currentSlide - 1;
    if (previousIndex < 0) {
        previousIndex = slides.length - 1;
    }
    const previous = slides[previousIndex];
    previous.style.transition = "none";
    previous.style.transform = "translateX(-100%)";
    previous.style.zIndex = "2";
    previous.classList.add("active");
    previous.offsetHeight;
    current.style.transition = "transform 0.6s ease-in-out";
    previous.style.transition = "transform 0.6s ease-in-out";
    current.style.transform = "translateX(100%)";
    previous.style.transform = "translateX(0)";
    dots.forEach(function(dot) {
        dot.classList.remove("active");
    });
    dots[previousIndex].classList.add("active");
    setTimeout(function() {
        current.style.transition = "none";
        current.style.transform = "translateX(-100%)";
        current.style.zIndex = "1";
        previous.style.zIndex = "2";
    }, 600);
    currentSlide = previousIndex;
}
nextBtn.addEventListener("click", function() {
    nextSlide();
    restartAutoSlide();
});
prevBtn.addEventListener("click", function() {
    previousSlide();
    restartAutoSlide();
});
dots.forEach(function(dot) {
    dot.addEventListener("click", function() {
        const index = Number(
            this.getAttribute("data-slide")
        );
        if (index === currentSlide) {
            return;
        }
        slides.forEach(function(slide) {
            slide.style.transition = "none";
            slide.style.transform = "translateX(100%)";
        });
        slides[index].style.transform = "translateX(0)";
        slides[index].style.zIndex = "2";
        dots.forEach(function(dot) {
            dot.classList.remove("active");
        });
        dots[index].classList.add("active");
        currentSlide = index;
        restartAutoSlide();
    });
});
function startAutoSlide() {
    autoSlide = setInterval(function() {
        nextSlide();
    }, 4000);
}
function restartAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}
slider.addEventListener("mouseenter", function() {
    clearInterval(autoSlide);
});
slider.addEventListener("mouseleave", function() {

    restartAutoSlide();
});
slides.forEach(function(slide, index) {
    slide.style.position = "absolute";
    slide.style.top = "0";
    slide.style.left = "0";
    if (index === 0) {
        slide.style.transform = "translateX(0)";
        slide.style.zIndex = "2";
    } else {
        slide.style.transform = "translateX(100%)";
        slide.style.zIndex = "1";
    }
});
dots[0].classList.add("active");
startAutoSlide();
//==========Banner sliding code end===============//

//==========Shopping cart code start===============//
const cartButtons = document.querySelectorAll(".add-cart");
const cartSidebar = document.querySelector(".cart-sidebar");
const cartOverlay = document.querySelector(".cart-overlay");
const cartHeaderToggle = document.querySelector(".cart-header-toggle");
const cartClose = document.querySelector(".cart-close");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const wishlistCount = document.querySelector(".wishlist-count");
const cart = new Map();
const dealCards = document.querySelectorAll(".deal-card");
let wishlistTotal = 0;
const cartStorageKey = "nexoraCart";
const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");

if (Array.isArray(savedCart)) {
    savedCart.forEach(function(entry) {
        if (Array.isArray(entry) && entry.length === 2) {
            cart.set(entry[0], entry[1]);
        }
    });
}

dealCards.forEach(function(card) {
    const likeButton = document.createElement("button");
    likeButton.className = "like-button";
    likeButton.type = "button";
    likeButton.setAttribute("aria-label", "Add product to wishlist");
    likeButton.setAttribute("aria-pressed", "false");
    likeButton.innerHTML = '<i class="ri-heart-line"></i>';
    card.appendChild(likeButton);

    likeButton.addEventListener("click", function() {
        const isLiked = likeButton.classList.toggle("is-liked");
        wishlistTotal += isLiked ? 1 : -1;
        wishlistCount.textContent = wishlistTotal;
        likeButton.setAttribute("aria-pressed", String(isLiked));
        likeButton.setAttribute("aria-label", isLiked ? "Remove product from wishlist" : "Add product to wishlist");
        likeButton.innerHTML = `<i class="ri-heart${isLiked ? "-fill" : "-line"}"></i>`;
    });

});

function formatPrice(price) {
    return `৳${price.toLocaleString("en-US")}`;
}

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(Array.from(cart.entries())));
}

function renderCart() {
    let itemCount = 0;
    let total = 0;
    cartItems.innerHTML = "";

    cart.forEach(function(item, key) {
        itemCount += item.quantity;
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.dataset.name = item.name;
        cartItem.dataset.price = item.price;
        cartItem.dataset.image = item.image;
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)} x ${item.quantity}</p>
            </div>
            <button class="cart-item-remove" type="button" data-key="${key}" aria-label="Remove ${item.name}">
                <i class="ri-delete-bin-line"></i>
            </button>`;
        cartItems.appendChild(cartItem);
    });

    if (cart.size === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    }

    cartCount.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);
    saveCart();
}

function setCartOpen(isOpen) {
    cartSidebar.classList.toggle("is-open", isOpen);
    cartOverlay.classList.toggle("is-visible", isOpen);
    cartSidebar.setAttribute("aria-hidden", String(!isOpen));
    cartHeaderToggle.setAttribute("aria-expanded", String(isOpen));
}

cartButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const card = button.closest(".deal-card");
        const name = card.querySelector(".product-name").textContent.trim();
        const price = Number(card.querySelector(".price").textContent.replace(/[^0-9]/g, ""));
        const image = card.querySelector(".product-image img").getAttribute("src");
        const key = `${name}-${price}`;
        const existingItem = cart.get(key);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.set(key, { name, price, image, quantity: 1 });
        }

        renderCart();
    });
});

cartItems.addEventListener("click", function(event) {
    const removeButton = event.target.closest(".cart-item-remove");
    if (removeButton) {
        cart.delete(removeButton.dataset.key);
        renderCart();
        return;
    }

});

cartHeaderToggle.addEventListener("click", function() {
    setCartOpen(true);
});
cartClose.addEventListener("click", function() {
    setCartOpen(false);
});
cartOverlay.addEventListener("click", function() {
    setCartOpen(false);
});
renderCart();

if (new URLSearchParams(window.location.search).get("cart") === "open") {
    setCartOpen(true);
}
//==========Shopping cart code end=================//