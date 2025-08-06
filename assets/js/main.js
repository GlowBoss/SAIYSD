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

// Loading Screen
let loadingProgress = 0;
const progressBar = document.getElementById('progress-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const loadingScreen = document.getElementById('loading-screen');
const body = document.body;

function updateLoadingProgress() {
    if (loadingProgress < 100) {

        const increment = Math.random() * 20 + 1;
        loadingProgress = Math.min(loadingProgress + increment, 100);

        progressBar.style.width = loadingProgress + '%';
        loadingPercentage.textContent = Math.floor(loadingProgress) + '%';

        setTimeout(updateLoadingProgress, Math.random() * 100 + 50);
    } else {
        // Loading complete - IMMEDIATE smooth transition
        body.classList.remove('loading'); // Show main content immediately

        // Start landing animations right away - NO WOW ANIMATIONS FOR LANDING
        setTimeout(() => {
            triggerLandingAnimations();
        }, 100);

        // Fade out loading screen while animations play
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
        }, 200);

        // Initialize main site features
        setTimeout(() => {
            initializeMainSite();
        }, 600);
    }
}

function triggerLandingAnimations() {
    const mainContent = document.querySelector('.main-content');

    // Add ready class to trigger CSS transitions ONLY
    mainContent.classList.add('ready');

}

function initializeMainSite() {
    // Scroll to top
    if (!window.location.hash) {
        scrollTo(0, 0);
    }

    // Initialize WOW.js for NON-LANDING elements only
    new WOW().init();

    // Enhanced Navbar Scroll Effects
    initializeNavbarEffects();

    // Enhanced Sidebar Effects
    initializeSidebarEffects();

    // Back to top functionality
    initializeBackToTop();

    // Branch switching functionality
    initializeBranchSwitching();

    // Toggle text functionality
    initializeToggleButtons();
}



function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    function checkScrollPosition() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (window.scrollY <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    }

    window.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('DOMContentLoaded', checkScrollPosition);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopBtn.style.transition = 'all 0.3s ease';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transform = 'translateY(20px)';
}

function initializeBranchSwitching() {
    window.showBranch = function (event, branch) {
        event.preventDefault();

        const branches = ['suplang', 'santor'];
        branches.forEach(b => {
            const branchElement = document.getElementById(`branch-${b}`);
            if (branchElement) {
                branchElement.style.opacity = '0';
                branchElement.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    branchElement.classList.add('d-none');
                }, 300);
            }
        });

        setTimeout(() => {
            const selectedBranch = document.getElementById(`branch-${branch}`);
            if (selectedBranch) {
                selectedBranch.classList.remove('d-none');
                setTimeout(() => {
                    selectedBranch.style.opacity = '1';
                    selectedBranch.style.transform = 'translateY(0)';
                }, 50);
            }
        }, 320);


        document.querySelectorAll('.branch-nav a').forEach(link => {
            link.classList.remove('active');
            link.style.transform = 'scale(1)';
        });
        event.target.classList.add('active');
        event.target.style.transform = 'scale(1.05)';
    };

    const branchElements = document.querySelectorAll('[id^="branch-"]');
    branchElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = element.classList.contains('d-none') ? '0' : '1';
        element.style.transform = 'translateY(0)';
    });


    document.querySelectorAll('.branch-nav a').forEach(link => {
        link.style.transition = 'all 0.3s ease';
        link.addEventListener('mouseenter', () => {
            if (!link.classList.contains('active')) {
                link.style.transform = 'scale(1.02)';
            }
        });
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                link.style.transform = 'scale(1)';
            }
        });
    });
}

function initializeToggleButtons() {
    function setupToggleText(buttonId, collapseId) {
        const button = document.getElementById(buttonId);
        const collapse = document.getElementById(collapseId);

        if (button && collapse) {
            button.style.transition = 'all 0.3s ease';

            collapse.addEventListener('shown.bs.collapse', function () {
                button.textContent = 'View Less';
                button.style.transform = 'scale(1.05)';
            });

            collapse.addEventListener('hidden.bs.collapse', function () {
                button.textContent = 'View More';
                button.style.transform = 'scale(1)';
            });


            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                const isExpanded = button.textContent === 'View Less';
                button.style.transform = isExpanded ? 'scale(1.05)' : 'scale(1)';
            });
        }
    }


    setupToggleText('toggleSantorBtn', 'santorDetails');
    setupToggleText('toggleSuplangBtn', 'suplangDetails');
}

// FULL SLIDING BULLET ANIMATION - LAHAT NG BULLETS NAG-SLIDE!
let carouselIsSliding = false; // Global flag to prevent conflicts

function updateDynamicPagination(activeIndex, totalSlides, paginationSelector = '.carousel-pagination-bullet', direction = 'none') {
    const container = document.querySelector('.carousel-pagination');
    const track = document.querySelector('.carousel-pagination-track');

    if (!container || !track || carouselIsSliding) return;

    // Calculate bullet state
    const state = calculateBulletState(activeIndex, totalSlides);

    // Update container class
    container.className = `carousel-pagination max-${state.bulletCount}`;

    // Get current bullets
    const currentBullets = track.children.length;
    const targetBullets = state.bulletCount;

    // Handle bullet count changes with animation
    if (currentBullets !== targetBullets) {
        animateBulletCountChange(track, currentBullets, targetBullets, state).then(() => {

            animateFullSliding(track, state, direction);
        });
    } else {

        animateFullSliding(track, state, direction);
    }
}

// HELPER FUNCTIONS FOR FULL SLIDING ANIMATION 
function calculateBulletState(currentIndex, totalSlides) {
    const current = currentIndex;
    const total = totalSlides;

    let bulletCount, startPicture, activeBulletPosition;

    if (total <= 3) {
        bulletCount = total;
        startPicture = 0;
        activeBulletPosition = current;
    } else if (total <= 4) {
        if (current === 0) {
            bulletCount = 3;
            startPicture = 0;
            activeBulletPosition = 0;
        } else {
            bulletCount = 4;
            startPicture = 0;
            activeBulletPosition = current;
        }
    } else if (total <= 5) {
        if (current === 0) {
            bulletCount = 3;
            startPicture = 0;
            activeBulletPosition = 0;
        } else if (current === 1) {
            bulletCount = 4;
            startPicture = 0;
            activeBulletPosition = 1;
        } else {
            bulletCount = 5;
            startPicture = 0;
            activeBulletPosition = current;
        }
    } else {

        if (current === 0) {
            bulletCount = 3;
            startPicture = 0;
            activeBulletPosition = 0;
        } else if (current === 1) {
            bulletCount = 4;
            startPicture = 0;
            activeBulletPosition = 1;
        } else if (current >= total - 2) {
            if (current === total - 2) {
                bulletCount = 4;
                startPicture = total - 4;
                activeBulletPosition = 2;
            } else {
                bulletCount = 3;
                startPicture = total - 3;
                activeBulletPosition = 2;
            }
        } else {
            bulletCount = 5;
            startPicture = current - 2;
            activeBulletPosition = 2;
        }
    }

    return {
        bulletCount,
        startPicture,
        activeBulletPosition
    };
}

// FULL SLIDING ANIMATION - INSIDE OF CAFE
async function animateFullSliding(track, state, direction) {
    if (carouselIsSliding) return;
    carouselIsSliding = true;

    const bullets = Array.from(track.children);

    let slideDistance = 0;
    if (direction === 'next') {
        slideDistance = -25;
    } else if (direction === 'prev') {
        slideDistance = 25;
    }
    bullets.forEach(bullet => {
        bullet.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        bullet.style.boxShadow = '0 0 0 0 rgba(196, 162, 119, 0.4)';
        setTimeout(() => {
            bullet.style.boxShadow = '0 0 0 8px rgba(196, 162, 119, 0)';
        }, 50);
    });

    if (slideDistance !== 0) {
        track.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = `translateX(${slideDistance}px)`;
        await delay(0);

        updateBulletContentDuringSlide(track, state);
        await delay(0);

        track.style.transform = 'translateX(0)';
        await delay(0);
    } else {

        updateBulletStatesInstant(track, state);
        await delay(0);
    }

    await applyFinalStatesWithSlidingWave(track, state);


    bullets.forEach(bullet => {
        bullet.style.transition = '';
        bullet.style.boxShadow = '';
    });
    track.style.transition = '';

    carouselIsSliding = false;
}

function updateBulletContentDuringSlide(track, state) {
    const bullets = Array.from(track.children);

    bullets.forEach((bullet, index) => {
        bullet.style.opacity = '0.6';
        bullet.style.transform = 'scale(0.4)';

        setTimeout(() => {
            bullet.style.opacity = '0.2';
            bullet.style.transform = 'scale(.33)';
        }, 100);
    });
}

async function applyFinalStatesWithSlidingWave(track, state) {
    const bullets = Array.from(track.children);

    // Apply states with sequential wave timing for sliding effect
    bullets.forEach((bullet, index) => {
        const delay = Math.abs(index - state.activeBulletPosition) * 120;

        setTimeout(() => {
            bullet.className = 'carousel-pagination-bullet';
            bullet.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';


            bullet.style.transform = 'scale(0.4) translateX(-3px)';

            setTimeout(() => {
                if (index === state.activeBulletPosition) {
                    bullet.classList.add('active');
                    bullet.style.transform = 'scale(1) translateX(0)';
                    bullet.style.opacity = '1';
                } else if (index === state.activeBulletPosition - 1) {
                    bullet.classList.add('active-prev');
                    bullet.style.transform = 'scale(.66) translateX(0)';
                    bullet.style.opacity = '0.4';
                } else if (index === state.activeBulletPosition + 1) {
                    bullet.classList.add('active-next');
                    bullet.style.transform = 'scale(.66) translateX(0)';
                    bullet.style.opacity = '0.4';
                } else if (index === state.activeBulletPosition - 2) {
                    bullet.classList.add('active-prev-prev');
                    bullet.style.transform = 'scale(.33) translateX(0)';
                    bullet.style.opacity = '0.2';
                } else if (index === state.activeBulletPosition + 2) {
                    bullet.classList.add('active-next-next');
                    bullet.style.transform = 'scale(.33) translateX(0)';
                    bullet.style.opacity = '0.2';
                } else {
                    bullet.style.transform = 'scale(.33) translateX(0)';
                    bullet.style.opacity = '0.2';
                }
            }, 150);
        }, delay);
    });

    await delay(600);

    // Clean up inline styles
    bullets.forEach(bullet => {
        bullet.style.transition = '';
        bullet.style.transform = '';
        bullet.style.opacity = '';
    });
}

function updateBulletStatesInstant(track, state) {
    const bullets = track.children;

    Array.from(bullets).forEach((bullet, index) => {
        bullet.className = 'carousel-pagination-bullet';

        if (index === state.activeBulletPosition) {
            bullet.classList.add('active');
        } else if (index === state.activeBulletPosition - 1) {
            bullet.classList.add('active-prev');
        } else if (index === state.activeBulletPosition + 1) {
            bullet.classList.add('active-next');
        } else if (index === state.activeBulletPosition - 2) {
            bullet.classList.add('active-prev-prev');
        } else if (index === state.activeBulletPosition + 2) {
            bullet.classList.add('active-next-next');
        }
    });
}

async function animateBulletCountChange(track, currentCount, targetCount, state) {
    if (targetCount > currentCount) {
        // Add bullets with sliding enter animation
        for (let i = currentCount; i < targetCount; i++) {
            const bullet = document.createElement('div');
            bullet.className = 'carousel-pagination-bullet';
            bullet.style.opacity = '0';
            bullet.style.transform = 'scale(0) translateY(15px) translateX(-10px)';
            bullet.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            bullet.addEventListener('click', () => {
                const actualIndex = state.startPicture + i;
                if (window.cafeCarouselInstance) {
                    window.cafeCarouselInstance.goToSlide(actualIndex);
                }
            });

            track.appendChild(bullet);

            // Trigger sliding enter animation with sequence
            setTimeout(() => {
                bullet.style.opacity = '0.2';
                bullet.style.transform = 'scale(.33) translateY(0) translateX(0)';
            }, i * 150 + 100);
        }

        await delay(0);

    } else if (targetCount < currentCount) {
        // Remove bullets with sliding exit animation
        for (let i = currentCount - 1; i >= targetCount; i--) {
            const bullet = track.children[i];
            bullet.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            bullet.style.opacity = '0';
            bullet.style.transform = 'scale(0) translateY(-15px) translateX(10px)';
        }

        await delay(0);

        // Remove bullets after animation
        while (track.children.length > targetCount) {
            track.removeChild(track.lastChild);
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start loading when page loads
window.addEventListener('load', () => {
    setTimeout(updateLoadingProgress, 300);
});

setTimeout(() => {
    if (loadingProgress === 0) {
        updateLoadingProgress();
    }
}, 2000);


window.addEventListener('DOMContentLoaded', () => {
    const criticalImages = [
        'assets/img/saisydLogo.png',
        'assets/img/coffee.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// CENTERED CAROUSEL WITH FULL SLIDING ANIMATIONS 
document.addEventListener('DOMContentLoaded', function () {
    class CafeCarousel {
        constructor() {
            this.currentIndex = 0;
            this.slides = document.querySelectorAll('.centered-carousel-slide');
            this.totalSlides = this.slides.length;
            this.pagination = document.getElementById('cafePagination');
            this.autoPlayInterval = null;
            this.autoPlayDelay = 5000000;

            if (this.slides.length > 0) {
                this.init();
                this.createPagination();
                this.startAutoPlay();
                this.addEventListeners();
            }
        }

        init() {
            this.updateSlider();
        }

        createPagination() {
            if (!this.pagination) return;


            this.pagination.innerHTML = '';


            const track = document.createElement('div');
            track.className = 'carousel-pagination-track';
            track.id = 'paginationTrack';

            // Start with 3 bullets 
            const initialBullets = Math.min(3, this.totalSlides);

            for (let i = 0; i < initialBullets; i++) {
                const bullet = document.createElement('div');
                bullet.className = 'carousel-pagination-bullet';
                if (i === 0) bullet.classList.add('active');

                bullet.addEventListener('click', () => {
                    this.goToSlide(i);
                });

                track.appendChild(bullet);
            }

            this.pagination.appendChild(track);

            // Store reference for global access
            window.cafeCarouselInstance = this;

            //  INITIAL PAGINATION UPDATE
            updateDynamicPagination(this.currentIndex, this.totalSlides, '#cafePagination .carousel-pagination-bullet', 'none');
        }

        updateSlider(direction = 'none') {
            this.slides.forEach((slide, index) => {
                slide.className = 'centered-carousel-slide';

                if (index === this.currentIndex) {
                    slide.classList.add('active');
                } else if (index === this.getPrevIndex()) {
                    slide.classList.add('prev');
                } else if (index === this.getNextIndex()) {
                    slide.classList.add('next');
                } else {
                    slide.classList.add('hidden');
                }
            });

            //  UPDATE PAGINATION with full sliding animations
            if (this.pagination) {
                updateDynamicPagination(
                    this.currentIndex,
                    this.totalSlides,
                    '#cafePagination .carousel-pagination-bullet',
                    direction
                );
            }
        }

        getPrevIndex() {
            return (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        }

        getNextIndex() {
            return (this.currentIndex + 1) % this.totalSlides;
        }

        nextSlide() {
            this.currentIndex = this.getNextIndex();
            this.updateSlider('next');
            this.restartAutoPlay();
        }

        prevSlide() {
            this.currentIndex = this.getPrevIndex();
            this.updateSlider('prev');
            this.restartAutoPlay();
        }

        goToSlide(index) {
            const direction = index > this.currentIndex ? 'next' : 'prev';
            this.currentIndex = index;
            this.updateSlider(direction);
            this.restartAutoPlay();
        }

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        restartAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }

        addEventListeners() {
            const nextBtn = document.getElementById('cafeNextBtn');
            const prevBtn = document.getElementById('cafePrevBtn');

            if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
            if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());

            // Click on slides to navigate
            this.slides.forEach((slide, index) => {
                slide.addEventListener('click', () => {
                    if (index !== this.currentIndex) {
                        this.goToSlide(index);
                    }
                });
            });

            // Touch support
            let startX = 0;
            let endX = 0;
            const wrapper = document.getElementById('cafeCarouselWrapper');

            if (wrapper) {
                wrapper.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    this.stopAutoPlay();
                });

                wrapper.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;

                    if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    } else {
                        this.startAutoPlay();
                    }
                });

                // Pause on hover
                wrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
                wrapper.addEventListener('mouseleave', () => this.startAutoPlay());
            }

            // Keyboard support
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            });
        }
    }

    new CafeCarousel();
});