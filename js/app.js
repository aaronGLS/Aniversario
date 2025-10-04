import { qs, on, formatDateISO } from './utils.js';
import { SITE } from './data.js';
import { initCountdown } from './countdown.js';
import { renderTimeline } from './timeLine.js';
import { initLetter } from './letter.js';
import { initGallery } from './gallery.js';
import { renderVows } from './vows.js';
import { shootConfetti } from './confetti.js';
import { shareOrFallback } from './share.js';


// 1) Theming (tokens) desde data.js
(function theme() {
    const root = document.documentElement;
    const p = SITE.palette || {};
    if (p.primary) root.style.setProperty('--color-primary', p.primary);
    if (p.accent) root.style.setProperty('--color-accent', p.accent);
    if (p.bg) root.style.setProperty('--color-bg', p.bg);
    if (p.text) root.style.setProperty('--color-text', p.text);
})();


// 2) Hero / nombres / tagline
qs('#partner-name').textContent = SITE.couple.partner;
qs('#hero-title').firstChild && (qs('#hero-title').firstChild.textContent = `Feliz ${SITE.meta?.annivLabel || 'Aniversario'}, `);
qs('#tagline').textContent = SITE.couple.tagline || 'Nuestro amor en una página';


// 3) Footer
qs('#footer-names').textContent = `${SITE.couple.you} & ${SITE.couple.partner}`;
qs('#footer-date').textContent = new Date().getFullYear();


// 4) Contador (America/Guatemala)
initCountdown({
    sinceISO: SITE.couple.since, els: {
        days: qs('#days'), hours: qs('#hours'), minutes: qs('#minutes'), seconds: qs('#seconds')
    }
});


// 5) Timeline
renderTimeline({ items: SITE.timeline, mount: qs('#timeline') });


// 5.1) Animar secciones al entrar en viewport
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});


// 6) Carta
initLetter({
    html: SITE.letter,
    selectors: {
        open: '#open-letter',
        panel: '#letter-panel',
        paper: '#letter-paper',
        close: '#close-letter',
        print: '#print-letter'
    }
});


// 7) Galería
initGallery({
    photos: SITE.gallery,
    mount: qs('#gallery'),
    lightbox: {
        root: '#lightbox',
        img: '#lightbox-img',
        caption: '#lightbox-caption',
        close: '#lightbox-close',
        prev: '#lightbox-prev',
        next: '#lightbox-next'
    }
});


// 8) Votos
renderVows({ vows: SITE.vows, mount: qs('#vows') });


// 9) Botón Empezar - scroll suave y confetti
const btnStart = qs('#btn-start');
const main = qs('#main');

// Debounce para prevenir múltiples clicks
let isScrolling = false;

on(btnStart, 'click', async () => {
    // Prevenir clicks múltiples durante scroll
    if (isScrolling) return;
    isScrolling = true;
    
    // Lanzar confetti inmediatamente
    shootConfetti();
    
    // Scroll suave después de un pequeño delay
    setTimeout(() => {
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Resetear flag después del scroll (aproximadamente)
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }, 100);
});


// 9.1) Parallax suave en el hero al hacer scroll (solo desktop)
if (window.matchMedia('(min-width: 769px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const hero = qs('#hero');
                if (hero) {
                    const scrolled = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;
                    if (scrolled < heroHeight) {
                        const opacity = 1 - (scrolled / heroHeight) * 0.5;
                        const translateY = scrolled * 0.3;
                        hero.style.opacity = opacity;
                        hero.style.transform = `translateY(${translateY}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}


// 10) Botón de compartir (si existe)
const btnShare = qs('#btn-share');
if (btnShare) {
    on(btnShare, 'click', () => {
        shareOrFallback({
            message: `¡Celebramos nuestro ${SITE.meta.annivLabel}! 💕`,
            url: window.location.href,
            hashtags: ['Aniversario', 'Amor', 'Nosotros']
        });
    });
}


// 11) Partículas flotantes de corazones en el hero
import { initFloatingHearts } from './extras.js';
initFloatingHearts();


// 12) Extras opcionales (comentar si no se desean)
// Descomenta las líneas siguientes para habilitar funcionalidades adicionales:
/*
import { 
    initScrollProgress, 
    initScrollIndicator, 
    initSectionAnimations,
    initEasterEgg
} from './extras.js';

// Barra de progreso de scroll
initScrollProgress();

// Indicador de scroll en el hero
initScrollIndicator();

// Animaciones de entrada para secciones
initSectionAnimations();

// Easter egg en el footer
initEasterEgg();
*/