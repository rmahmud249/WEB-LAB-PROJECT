const productDetails = document.querySelector(".product-details-section");

if (productDetails) {
    const params = new URLSearchParams(window.location.search);
    const fallbackProduct = {
        name: "Wireless Earbuds Pro",
        image: "../images/best-deal/wireless_earbuds.png",
        price: "৳1,890",
        oldPrice: "৳2,700",
        discount: "-30%",
        reviews: "(128 reviews)",
        category: "Electronics"
    };
    let product;

    try {
        product = JSON.parse(params.get("product") || "null");
    } catch (error) {
        product = null;
    }

    product = product && product.name ? product : fallbackProduct;
    const productImage = product.image && product.image.startsWith("images/")
        ? `../${product.image}`
        : product.image;
    const mainImage = document.querySelector("#mainProductImage");
    const thumbnails = Array.from(document.querySelectorAll(".thumbnail"));
    const galleryImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images.map(function(image) {
            return image.startsWith("images/") ? `../${image}` : image;
        })
        : thumbnails.map(function(thumbnail) {
            return thumbnail.querySelector("img")?.getAttribute("src") || productImage;
        }).map(function(image) {
            return params.has("product") ? productImage : image;
        });

    if (mainImage) {
        mainImage.src = galleryImages[0] || productImage;
        mainImage.alt = product.name;
    }

    const quantityValue = document.querySelector(".quantity-box span");
    const cartCount = document.querySelector(".cart-count");
    const wishlistCount = document.querySelector(".wishlist-count");
    const cartSidebar = document.querySelector(".cart-sidebar");
    const cartOverlay = document.querySelector(".cart-overlay");
    const cartItems = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    const cartPopup = document.querySelector(".cart-popup");
    const cartPopupText = document.querySelector(".cart-popup-text");
    const cartStorageKey = "nexoraCart";
    const wishlistStorageKey = "nexoraWishlist";

    const setText = function(selector, value) {
        const element = document.querySelector(selector);
        if (element && value) {
            element.textContent = value;
        }
    };

    const formatPrice = function(price) {
        return `৳${price.toLocaleString("en-US")}`;
    };

    const readStorage = function(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        } catch (error) {
            return fallback;
        }
    };

    const updateCartCount = function() {
        const cart = readStorage(cartStorageKey, []);
        const count = Array.isArray(cart)
            ? cart.reduce(function(total, item) {
                return total + Number(item[1]?.quantity || 0);
            }, 0)
            : 0;

        if (cartCount) {
            cartCount.textContent = count;
        }
    };

    const updateWishlistCount = function() {
        const wishlist = readStorage(wishlistStorageKey, []);
        if (wishlistCount) {
            wishlistCount.textContent = Array.isArray(wishlist) ? wishlist.length : 0;
        }
    };

    const getProductPrice = function() {
        return Number(String(product.price).replace(/[^0-9]/g, "")) || 0;
    };

    const renderCart = function() {
        const cart = readStorage(cartStorageKey, []);
        let total = 0;
        let itemCount = 0;

        if (!cartItems) {
            return;
        }

        cartItems.innerHTML = "";
        if (!Array.isArray(cart) || cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        } else {
            cart.forEach(function(entry) {
                const item = entry[1];
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${formatPrice(item.price)} x ${item.quantity}</p>
                    </div>
                    <button class="cart-item-remove" type="button" data-key="${entry[0]}" aria-label="Remove ${item.name}">
                        <i class="ri-delete-bin-line"></i>
                    </button>`;
                cartItems.appendChild(cartItem);
                itemCount += Number(item.quantity) || 0;
                total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
            });
        }

        if (cartTotal) {
            cartTotal.textContent = formatPrice(total);
        }
        if (cartCount) {
            cartCount.textContent = itemCount;
        }
    };

    const setCartOpen = function(isOpen) {
        cartSidebar?.classList.toggle("is-open", isOpen);
        cartOverlay?.classList.toggle("is-visible", isOpen);
        cartSidebar?.setAttribute("aria-hidden", String(!isOpen));
        document.querySelector(".cart-header-toggle")?.setAttribute("aria-expanded", String(isOpen));
    };

    const addToCart = function() {
        const cart = readStorage(cartStorageKey, []);
        const key = `${product.name}-${getProductPrice()}`;
        const existing = Array.isArray(cart) ? cart.find(function(item) {
            return item[0] === key;
        }) : null;
        const quantity = Math.max(1, Number.parseInt(quantityValue?.textContent, 10) || 1);
        const item = {
            name: product.name,
            price: getProductPrice(),
            image: productImage,
            quantity: quantity
        };

        if (existing) {
            existing[1].quantity += quantity;
        } else if (Array.isArray(cart)) {
            cart.push([key, item]);
        }

        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        updateCartCount();
        renderCart();

        if (cartPopup && cartPopupText) {
            cartPopupText.textContent = `${product.name} successfully added to cart.`;
            cartPopup.classList.add("is-visible");
            cartPopup.setAttribute("aria-hidden", "false");
            setTimeout(function() {
                cartPopup.classList.remove("is-visible");
                cartPopup.setAttribute("aria-hidden", "true");
            }, 3000);
        }

        const addButton = document.querySelector(".add-cart-btn");
        if (addButton) {
            addButton.innerHTML = '<i class="ri-check-line"></i> Added to Cart';
            setTimeout(function() {
                addButton.innerHTML = '<i class="ri-shopping-cart-line"></i> Add to Cart';
            }, 1400);
        }
    };

    const toggleWishlist = function() {
        let wishlist = readStorage(wishlistStorageKey, []);
        if (!Array.isArray(wishlist)) {
            wishlist = [];
        }

        const productKey = `${product.name}-${getProductPrice()}`;
        const index = wishlist.indexOf(productKey);
        const wishlistButton = document.querySelector(".wishlist-btn");

        if (index === -1) {
            wishlist.push(productKey);
            if (wishlistButton) {
                wishlistButton.innerHTML = '<i class="ri-heart-fill"></i> In Wishlist';
            }
        } else {
            wishlist.splice(index, 1);
            if (wishlistButton) {
                wishlistButton.innerHTML = '<i class="ri-heart-line"></i> Add to Wishlist';
            }
        }

        localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
        updateWishlistCount();
    };

    const showImage = function(index) {
        const total = galleryImages.length || 1;
        const selectedIndex = (index + total) % total;
        const selectedImage = galleryImages[selectedIndex] || productImage;

        if (mainImage) {
            mainImage.src = selectedImage;
            mainImage.alt = product.name;
        }

        thumbnails.forEach(function(thumbnail, thumbnailIndex) {
            thumbnail.classList.toggle("active", thumbnailIndex === selectedIndex % thumbnails.length);
        });
    };

    setText(".product-breadcrumb span", product.name);
    setText(".product-category", product.category);
    setText(".product-information h1", product.name);
    setText(".current-price", product.price);
    setText(".old-price", product.oldPrice);
    setText(".product-discount", product.discount);
    setText(".product-price .save-badge", product.discount ? `Save ${product.discount.replace("-", "")}` : "");
    setText(".product-rating a", product.reviews);
    setText(".product-information .product-short-description", `Shop the ${product.name} from NexoraBD with reliable quality and great value.`);
    setText(".description-text p", `${product.name} is selected for customers who want dependable performance, practical design, and excellent everyday value.`);
    setText(".tabs-header .tab-button:last-child", `Reviews ${product.reviews}`);

    document.querySelectorAll(".product-thumbnails img").forEach(function(thumbnail, index) {
        thumbnail.src = galleryImages[index] || productImage;
        thumbnail.alt = product.name;
    });

    thumbnails.forEach(function(thumbnail, index) {
        thumbnail.addEventListener("click", function() {
            showImage(index);
        });
    });

    document.querySelector(".gallery-prev")?.addEventListener("click", function() {
        const activeIndex = thumbnails.findIndex(function(thumbnail) {
            return thumbnail.classList.contains("active");
        });
        showImage(activeIndex - 1);
    });

    document.querySelector(".gallery-next")?.addEventListener("click", function() {
        const activeIndex = thumbnails.findIndex(function(thumbnail) {
            return thumbnail.classList.contains("active");
        });
        showImage(activeIndex + 1);
    });

    document.querySelectorAll(".color-option").forEach(function(option) {
        option.addEventListener("click", function() {
            document.querySelectorAll(".color-option").forEach(function(item) {
                item.classList.remove("active");
            });
            option.classList.add("active");
        });
    });

    document.querySelectorAll(".quantity-box button").forEach(function(button) {
        button.addEventListener("click", function() {
            const currentQuantity = Number.parseInt(quantityValue?.textContent, 10) || 1;
            const nextQuantity = button.dataset.action === "decrease"
                ? Math.max(1, currentQuantity - 1)
                : currentQuantity + 1;

            if (quantityValue) {
                quantityValue.textContent = String(nextQuantity);
            }
        });
    });

    document.querySelector(".add-cart-btn")?.addEventListener("click", addToCart);
    document.querySelector(".wishlist-btn")?.addEventListener("click", toggleWishlist);

    document.querySelectorAll(".tab-button").forEach(function(button, index) {
        button.addEventListener("click", function() {
            document.querySelectorAll(".tab-button").forEach(function(item) {
                item.classList.remove("active");
            });
            button.classList.add("active");

            const description = document.querySelector(".description-text");
            if (index === 0) {
                description.innerHTML = `<p>${product.name} is selected for customers who want dependable performance, practical design, and excellent everyday value.</p><p>Enjoy reliable quality, fast delivery, and a smooth shopping experience from NexoraBD.</p>`;
            } else if (index === 1) {
                description.innerHTML = `<p><strong>Product:</strong> ${product.name}</p><p><strong>Category:</strong> ${product.category || "General"}</p><p><strong>Availability:</strong> In stock</p>`;
            } else {
                description.innerHTML = `<p>Customers have rated ${product.name} highly for quality, value, and everyday performance.</p>`;
            }
        });
    });

    document.querySelector(".cart-header-toggle")?.addEventListener("click", function() {
        renderCart();
        setCartOpen(true);
    });

    document.querySelector(".cart-header-content a")?.addEventListener("click", function(event) {
        event.preventDefault();
        renderCart();
        setCartOpen(true);
    });

    document.querySelector(".cart-close")?.addEventListener("click", function() {
        setCartOpen(false);
    });

    cartOverlay?.addEventListener("click", function() {
        setCartOpen(false);
    });

    cartItems?.addEventListener("click", function(event) {
        const removeButton = event.target.closest(".cart-item-remove");
        if (!removeButton) {
            return;
        }

        const cart = readStorage(cartStorageKey, []);
        const updatedCart = Array.isArray(cart)
            ? cart.filter(function(entry) {
                return entry[0] !== removeButton.dataset.key;
            })
            : [];
        localStorage.setItem(cartStorageKey, JSON.stringify(updatedCart));
        renderCart();
        updateCartCount();
    });

    document.querySelector(".checkout-button")?.addEventListener("click", function() {
        window.location.href = "checkout.html";
    });

    document.querySelector(".search-btn")?.addEventListener("click", function() {
        const query = document.querySelector(".search-input")?.value.trim();
        window.location.href = query ? `../index.html?search=${encodeURIComponent(query)}` : "../index.html";
    });

    document.querySelector(".search-input")?.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            document.querySelector(".search-btn")?.click();
        }
    });

    document.querySelectorAll("a[href='#']").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    document.querySelector(".logo a")?.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "../index.html";
    });

    document.querySelectorAll(".nav-links a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = `../index.html#${link.textContent.trim().toLowerCase().replaceAll(" ", "-")}`;
        });
    });

    updateCartCount();
    if (wishlistCount) {
        wishlistCount.textContent = "0";
    }
    renderCart();
    document.title = `${product.name} | NexoraBD`;
}