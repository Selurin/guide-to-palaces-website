document.addEventListener('DOMContentLoaded', function () {
    const swiperEl = document.querySelector('.mySwiper');
    if (swiperEl && typeof Swiper !== 'undefined') {
        new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 3700,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    }
});
