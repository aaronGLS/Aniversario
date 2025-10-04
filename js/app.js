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

// 5.0) Pre-warm del render para evitar lag en primera interacción
// Forzar cálculos de layout temprano
requestAnimationFrame(() => {
    const timelineSection = qs('#timeline-section');
    if (timelineSection) {
        // Leer dimensiones para forzar layout
        timelineSection.getBoundingClientRect();
    }
});


// 5.1) Animar elementos al entrar en viewport - Optimizado
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Para timeline items, agregar delay escalonado
            if (entry.target.classList.contains('timeline__item')) {
                const index = parseInt(entry.target.dataset.index || '0');
                const delay = Math.min(index * 80, 500); // Max 500ms delay
                
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
            } else {
                // Para secciones, agregar inmediatamente
                entry.target.classList.add('is-visible');
            }
            
            // Una vez visible, dejar de observar para mejorar performance
            animationObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.05, // Más sensible para detectar antes
    rootMargin: '100px 0px -50px 0px' // Precargar antes de que sea visible
});

// Observar secciones
document.querySelectorAll('.section').forEach(section => {
    animationObserver.observe(section);
});

// Observar items del timeline individualmente para animaciones escalonadas
// Usar setTimeout para permitir que el DOM se asiente
setTimeout(() => {
    document.querySelectorAll('.timeline__item').forEach(item => {
        animationObserver.observe(item);
    });
}, 100);


// 6) Carta
initLetter({
    html: SITE.letter,
    selectors: {
        open: '#open-letter',
        panel: '#letter-panel',
        paper: '#letter-paper',
        close: '#close-letter'
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


// 9) Botón Empezar - scroll suave y confetti - Optimizado
const btnStart = qs('#btn-start');
const main = qs('#main');
const timelineSection = qs('#timeline-section');

// Debounce para prevenir múltiples clicks
let isScrolling = false;

on(btnStart, 'click', async () => {
    // Prevenir clicks múltiples durante scroll
    if (isScrolling) return;
    isScrolling = true;
    
    // Lanzar confetti inmediatamente
    shootConfetti();
    
    // Pre-renderizar el timeline para evitar flash blanco
    // Forzar la clase is-visible antes del scroll para que esté listo
    if (timelineSection && !timelineSection.classList.contains('is-visible')) {
        timelineSection.classList.add('is-visible');
    }
    
    // Hacer visibles los primeros items del timeline inmediatamente
    const timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach((item, index) => {
        if (index < 3) { // Precargar los primeros 3 items
            setTimeout(() => {
                item.classList.add('is-visible');
            }, index * 100); // Efecto cascada
        }
    });
    
    // Scroll suave después de un pequeño delay
    setTimeout(() => {
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Resetear flag después del scroll (aproximadamente)
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }, 150);
});


// 9.1) Parallax suave en el hero al hacer scroll (solo desktop) - Optimizado
if (window.matchMedia('(min-width: 769px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const hero = qs('#hero');
    let ticking = false;
    let heroHeight = hero ? hero.offsetHeight : 0;
    
    // Recalcular altura del hero en resize
    window.addEventListener('resize', () => {
        heroHeight = hero ? hero.offsetHeight : 0;
    });
    
    window.addEventListener('scroll', () => {
        if (!ticking && hero) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Solo aplicar parallax si estamos en el rango del hero
                if (scrolled < heroHeight) {
                    const opacity = Math.max(0.3, 1 - (scrolled / heroHeight) * 0.7);
                    const translateY = scrolled * 0.3;
                    
                    // Usar transform3d para mejor performance
                    hero.style.opacity = opacity;
                    hero.style.transform = `translate3d(0, ${translateY}px, 0)`;
                } else if (scrolled >= heroHeight && hero.style.opacity !== '') {
                    // Reset cuando pasamos el hero completamente
                    hero.style.opacity = '0';
                    hero.style.transform = 'translate3d(0, 0, 0)';
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // passive para mejor scroll performance
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