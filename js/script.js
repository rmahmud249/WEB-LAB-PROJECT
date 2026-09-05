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