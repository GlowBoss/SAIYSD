// NAVBAR
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// SWIPER
let swiperCards = new Swiper(".card__content", {
  loop: true,
  spaceBetween: 32,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    600: {
      slidesPerView: 2,
    },
    968: {
      slidesPerView: 3,
    },
  },
});

// LOCATION
function showBranch(event, branch) {
  event.preventDefault();


  document.getElementById('branch-suplang').classList.add('d-none');
  document.getElementById('branch-santor').classList.add('d-none');


  document.getElementById('branch-' + branch).classList.remove('d-none');


  document.getElementById('link-suplang').classList.remove('active');
  document.getElementById('link-santor').classList.remove('active');
  document.getElementById('link-' + branch).classList.add('active');
}