document.addEventListener('DOMContentLoaded', () => {
    // 1. Ustawienie roku w stopce
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear().toString();
    }

    /* --- 2. SCROLL: PASEK NAWIGACJI --- */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link-desktop');
    const menuIcon = document.getElementById('mobile-menu-icon');
    const logoImg = document.getElementById('nav-logo');

    // Upewnij się, że ta ścieżka prowadzi poprawnie do Twojego logo we wszystkich plikach!
    const logoPath1 = "images/logoWhite.png";
    const logoPath2 = "images/logoGreen.png";

    const handleScroll = () => {
        if (window.scrollY > 50) {
            if (navbar) {
                navbar.classList.remove('bg-transparent', 'py-4');
                navbar.classList.add('bg-white', 'shadow-md', 'py-2');
            }
            if (logoImg) logoImg.src = logoPath2;
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                link.classList.add('text-forest');
            });
            if (menuIcon) {
                menuIcon.classList.remove('text-white');
                menuIcon.classList.add('text-forest');
            }
        } else {
            if (navbar) {
                navbar.classList.add('bg-transparent', 'py-4');
                navbar.classList.remove('bg-white', 'shadow-md', 'py-2');
            }
            if (logoImg) logoImg.src = logoPath1;
            navLinks.forEach(link => {
                link.classList.remove('text-forest');
                link.classList.add('text-white');
            });
            if (menuIcon) {
                menuIcon.classList.remove('text-forest');
                menuIcon.classList.add('text-white');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Wywołaj przy starcie, gdyby od razu zjechano w dół

    /* --- 3. MENU MOBILNE --- */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isClosed = mobileMenu.classList.contains('max-h-0');
            if (isClosed) {
                mobileMenu.classList.remove('max-h-0', 'opacity-0', 'invisible');
                mobileMenu.classList.add('max-h-96', 'opacity-100');
            } else {
                mobileMenu.classList.add('max-h-0', 'opacity-0', 'invisible');
                mobileMenu.classList.remove('max-h-96', 'opacity-100');
            }
        });

        // Zamykanie po kliknięciu linka w menu mobilnym
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('max-h-0', 'opacity-0', 'invisible');
                mobileMenu.classList.remove('max-h-96', 'opacity-100');
            });
        });
    }

    /* --- 4. PŁYNNE PRZEWIJANIE (Dla lokalnych kotwic) --- */
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Zdobądź cały atrybut href (np. "index.html#wybierz-diete" lub "#wybierz-diete")
            const href = this.getAttribute('href');

            // Jeśli to zwykły powrót na górę # lub #home
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Rozdziel link by sprawdzić czy celuje w aktualną stronę
            const pathInfo = href.split('#');
            const pagePath = pathInfo[0];
            const targetId = pathInfo[1];

            // Jeśli href zaczyna się od # LUB kieruje na stronę na której aktualnie jesteśmy (np. index.html na index.html)
            // Wtedy animuj przewijanie (smooth scroll)
            if (pagePath === '' || window.location.pathname.endsWith(pagePath)) {
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault(); // Zatrzymaj natywny skok przeglądarki
                        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80; // 80px to wysokość navbara
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                }
            }
            // W przeciwnym razie - pozwól przeglądarce normalnie otworzyć nową stronę html (e.g., z diety wracasz na index.html)
        });
    });

    // Płynny przeskok po załadowaniu nowej strony (jeśli przyszliśmy np. z innej diety i adres to "index.html#kontakt")
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }, 100);
    }

    /* --- 5. ANIMACJE OBSERVER --- */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Wyłączamy śledzenie gdy element się pojawi
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    /* --- 6. BANER COOKIE --- */
    const cookieBannerHTML = `
<div id="cookie-banner" class="cookie-banner"><div class="container-custom flex flex-col sm:flex-row items-center justify-between"><div class="mb-4 sm:mb-0 text-center sm:text-left"><p class="text-sm text-gray-700">Używamy plików cookie, aby poprawić jakość korzystania z naszej strony. Kontynuując przeglądanie, zgadzasz się na używanie plików cookie.<br><a href="polityka-prywatnosci.html" class="text-forest hover:underline ml-1">Polityka prywatności</a></p></div><div class="flex space-x-4"><button id="accept-cookie" class="btn btn-primary py-2 px-4" aria-label="Zaakceptuj pliki cookie">Akceptuję</button></div></div></div>
`;

    // Funkcja do sprawdzania cookie
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Sprawdzenie czy cookie istnieje
    if (!getCookie('cookiesAccepted')) {
        document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookie');

        if (banner && acceptBtn) {
            setTimeout(() => {
                banner.classList.add('is-visible');
            }, 500);

            acceptBtn.addEventListener('click', () => {
                // Ustawienie cookie na 1 rok
                document.cookie = "cookiesAccepted=true; path=/; max-age=" + 365 * 24 * 60 * 60;
                banner.classList.remove('is-visible');
            });
        }
    }
});