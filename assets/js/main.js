// Function to remove all active classes
function clearActive() {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
}

// Activate the current section on scroll
window.addEventListener('scroll', () => {
  const sections = [
    { id: 'about', nav: 'a[href*="#about"]' },
    { id: 'location', nav: 'a[href*="#location"]' }
  ];

  const scrollY = window.scrollY;

  sections.forEach(({ id, nav }) => {
    const section = document.getElementById(id);
    const link = document.querySelector(nav);
    if (section && link) {
      const offset = section.offsetTop - 120; // adjust for fixed navbar
      const height = section.offsetHeight;

      if (scrollY >= offset && scrollY < offset + height) {
        clearActive();
        link.classList.add('active');
      }
    }
  });

  // Optional: Default to Home if not in any section
  if (scrollY < document.getElementById('about').offsetTop - 150) {
    clearActive();
    const homeLink = document.querySelector('a[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }
});

// Click-based active switching (optional for instant feedback)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    clearActive();
    this.classList.add('active');
  });
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