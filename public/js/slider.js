document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.home-slider', {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 5000,
    },
  });
});