const overlay = document.getElementById('sidebarOverlay');
const sidebar = document.getElementById('mobileSidebar');
const openBtn = document.getElementById('openSidebarBtn');
const closeBtn = document.getElementById('closeSidebar');

const navLinks = document.querySelectorAll('.nav-link');

// Function to remove all active classes
function clearActive() {
    navLinks.forEach(link => link.classList.remove('active'));
}

openBtn.addEventListener('click', () => {
    gsap.set(sidebar, { xPercent: -100 });
    gsap.to(sidebar, {
        xPercent: 0,
        duration: 0.4,
        ease: "power2.out"
    });
    gsap.to(overlay, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power1.out"
    });

    overlay.style.display = 'block';
    sidebar.classList.add('active');

    // Reset WOW.js animations every open
    document.querySelectorAll('#mobileSidebar .nav-link').forEach((el) => {
        el.classList.remove('animate__animated', 'animate__fadeInLeft', 'wow');
        void el.offsetWidth;
        el.classList.add('wow', 'animate__animated', 'animate__fadeInLeft');
    });


    new WOW().sync();
});

// CLOSE SIDEBAR
function closeSidebar() {
    gsap.to(sidebar, {
        xPercent: -100,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
            sidebar.classList.remove('active');
        }
    });
    gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => {
            overlay.style.display = 'none';
        }
    });
}

closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
}

function getCurrentHash() {
    return window.location.hash;
}

function clearActive() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
}


function setActiveBasedOnCurrentPageAndHash() {
    const currentPage = getCurrentPage();
    const currentHash = getCurrentHash();

    clearActive();

    if (currentPage === 'index.html' && currentHash) {

        const hashLinks = document.querySelectorAll(`.nav-link[href="index.html${currentHash}"]`);
        if (hashLinks.length > 0) {
            hashLinks.forEach(link => link.classList.add('active'));
            return;
        }

        // Fallback: look for direct hash links
        const directHashLinks = document.querySelectorAll(`.nav-link[href="${currentHash}"]`);
        if (directHashLinks.length > 0) {
            directHashLinks.forEach(link => link.classList.add('active'));
            return;
        }
    }

    // Default: set active based on current page
    const currentPageLinks = document.querySelectorAll(`.nav-link[href="${currentPage}"]`);
    currentPageLinks.forEach(link => link.classList.add('active'));
}

if (window.location.hash) {

    const targetHash = window.location.hash;

    history.replaceState(null, null, window.location.pathname);

    window.addEventListener('DOMContentLoaded', () => {
        history.replaceState(null, null, window.location.pathname + targetHash);

        setActiveBasedOnCurrentPageAndHash();

        setTimeout(() => {
            const targetElement = document.querySelector(targetHash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 50);
    });
} else {

    window.addEventListener('DOMContentLoaded', () => {
        setActiveBasedOnCurrentPageAndHash();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const clickedHref = this.getAttribute('href');

            clearActive();


            document.querySelectorAll(`.nav-link[href="${clickedHref}"]`).forEach(l => {
                l.classList.add('active');
            });

            if (typeof closeSidebar === 'function') {
                closeSidebar();
            }
        });
    });
});

window.addEventListener('hashchange', () => {
    setActiveBasedOnCurrentPageAndHash();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    setActiveBasedOnCurrentPageAndHash();
});

// ENHANCED NAVBAR SCROLL EFFECTS 
function initializeNavbarEffects() {
    let ticking = false;
    let lastScrollTop = 0;

    function updateNavbar() {
        const navbar = document.getElementById('mainNavbar');
        if (!navbar) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (typeof gsap !== 'undefined') {
            if (scrollTop > lastScrollTop && scrollTop > 200) {

                gsap.to(navbar, {
                    duration: 0.3,
                    y: -100,
                    ease: "power2.out"
                });
            } else if (scrollTop < lastScrollTop || scrollTop <= 200) {

                gsap.to(navbar, {
                    duration: 0.3,
                    y: 0,
                    ease: "power2.out"
                });
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    function requestNavbarTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    // Smooth scroll for navbar links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let offsetTop = targetElement.offsetTop;


                if (targetId !== '#location') {
                    offsetTop -= 80;
                }

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', requestNavbarTick);

    updateNavbar();
}

// ENHANCED SIDEBAR EFFECTS 
function initializeSidebarEffects() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const openBtn = document.getElementById('openSidebarBtn');
    const closeBtn = document.getElementById('closeSidebar');

    function openSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        body.style.overflow = 'hidden';

        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 100);
        });
    }

    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        body.style.overflow = '';

        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.transform = 'translateX(20px)';
            link.style.opacity = '0';
        });
    }

    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.transform = 'translateX(20px)';
        link.style.opacity = '0';
        link.style.transition = 'all 0.3s ease';
    });

    openBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeSidebar, 300);
        });
    });
}


