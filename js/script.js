document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".banner-slider");

    const slides = document.querySelectorAll(".banner-slide");

    const dots = document.querySelectorAll(".banner-dot");

    const prevButton = document.querySelector(".banner-prev");

    const nextButton = document.querySelector(".banner-next");


    let currentSlide = 0;

    let autoPlay;

    const slideCount = slides.length;

    const autoPlayTime = 5000;


    /* =========================================
       SHOW SLIDE
    ========================================= */

    function showSlide(index) {

        /* Handle next */

        if (index >= slideCount) {
            index = 0;
        }


        /* Handle previous */

        if (index < 0) {
            index = slideCount - 1;
        }


        currentSlide = index;


        /* -----------------------------------------
           Update slides
        ----------------------------------------- */

        slides.forEach(function (slide, i) {

            slide.classList.remove("active");
            slide.classList.remove("prev");


            /*
             * Slides before current slide
             * move to the left.
             */

            if (i < currentSlide) {

                slide.classList.add("prev");

            }

            /*
             * Current slide stays in center.
             */

            else if (i === currentSlide) {

                slide.classList.add("active");

            }

            /*
             * Slides after current slide
             * stay on the right.
             */

            else {

                slide.style.transform = "translateX(100%)";

            }

        });


        /* -----------------------------------------
           Update dots
        ----------------------------------------- */

        dots.forEach(function (dot, i) {

            dot.classList.toggle(
                "active",
                i === currentSlide
            );

        });

    }


    /* =========================================
       NEXT SLIDE
    ========================================= */

    function nextSlide() {

        showSlide(currentSlide + 1);

    }


    /* =========================================
       PREVIOUS SLIDE
    ========================================= */

    function previousSlide() {

        showSlide(currentSlide - 1);

    }


    /* =========================================
       NEXT BUTTON
    ========================================= */

    nextButton.addEventListener("click", function () {

        nextSlide();

        restartAutoPlay();

    });


    /* =========================================
       PREVIOUS BUTTON
    ========================================= */

    prevButton.addEventListener("click", function () {

        previousSlide();

        restartAutoPlay();

    });


    /* =========================================
       DOT CLICK
    ========================================= */

    dots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            showSlide(index);

            restartAutoPlay();

        });

    });


    /* =========================================
       AUTOPLAY
    ========================================= */

    function startAutoPlay() {

        autoPlay = setInterval(function () {

            nextSlide();

        }, autoPlayTime);

    }


    /* =========================================
       STOP AUTOPLAY
    ========================================= */

    function stopAutoPlay() {

        clearInterval(autoPlay);

    }


    /* =========================================
       RESTART AUTOPLAY
    ========================================= */

    function restartAutoPlay() {

        stopAutoPlay();

        startAutoPlay();

    }


    /* =========================================
       PAUSE ON HOVER
    ========================================= */

    slider.addEventListener("mouseenter", function () {

        stopAutoPlay();

    });


    slider.addEventListener("mouseleave", function () {

        startAutoPlay();

    });


    /* =========================================
       KEYBOARD
    ========================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "ArrowRight") {

            nextSlide();

            restartAutoPlay();

        }


        if (event.key === "ArrowLeft") {

            previousSlide();

            restartAutoPlay();

        }

    });


    /* =========================================
       TOUCH SWIPE
    ========================================= */

    let touchStartX = 0;

    let touchEndX = 0;


    slider.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;

            stopAutoPlay();

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

            startAutoPlay();

        },
        {
            passive: true
        }
    );


    /* =========================================
       SWIPE FUNCTION
    ========================================= */

    function handleSwipe() {

        const distance =
            touchEndX - touchStartX;


        if (Math.abs(distance) < 50) {

            return;

        }


        /* Swipe left = next */

        if (distance < 0) {

            nextSlide();

        }


        /* Swipe right = previous */

        else {

            previousSlide();

        }

    }


    /* =========================================
       INITIALIZE
    ========================================= */

    showSlide(0);

    startAutoPlay();

});