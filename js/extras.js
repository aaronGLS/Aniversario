// extras.js — Funcionalidades adicionales opcionales
import { qs, on, prefersReducedMotion } from './utils.js';


// Barra de progreso de scroll
export function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}


// Indicador de scroll en el hero
export function initScrollIndicator() {
    const hero = qs('.hero');
    if (!hero) return;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.setAttribute('aria-label', 'Scroll hacia abajo');
    hero.appendChild(indicator);

    // Ocultar al hacer scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100 && lastScroll < 100) {
            indicator.style.opacity = '0';
            indicator.style.transition = 'opacity 0.3s';
        }
        lastScroll = window.scrollY;
    }, { passive: true });

    // Click para scroll suave
    on(indicator, 'click', () => {
        const main = qs('#main');
        if (main) {
            main.scrollIntoView({ behavior: 'smooth' });
        }
    });
}


// Animación de entrada para secciones con IntersectionObserver
export function initSectionAnimations() {
    if (prefersReducedMotion()) return;

    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
}


// Cursor personalizado (solo en desktop con mouse)
export function initCustomCursor() {
    if (window.innerWidth < 1024 || !matchMedia('(hover: hover)').matches) return;
    if (prefersReducedMotion()) return;

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);
    document.body.classList.add('custom-cursor');

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    const speed = 0.2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * speed;
        dotY += (mouseY - dotY) * speed;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}


// Efecto parallax simple en imágenes
export function initParallax() {
    if (prefersReducedMotion()) return;
    if (window.innerWidth < 768) return;

    const images = document.querySelectorAll('.timeline__media img');
    
    window.addEventListener('scroll', () => {
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrolled = window.scrollY;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (rect.top - window.innerHeight / 2) * 0.1;
                img.style.transform = `translateY(${offset}px)`;
            }
        });
    }, { passive: true });
}


// Contador animado con efecto de incremento
export function animateCounterNumbers() {
    const counters = document.querySelectorAll('.counter__unit span');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}


// Lazy loading mejorado con placeholder blur
export function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        // Agregar clase mientras carga
        img.style.filter = 'blur(10px)';
        img.style.transition = 'filter 0.3s ease-out';
        
        img.addEventListener('load', () => {
            img.style.filter = 'blur(0)';
        }, { once: true });
    });
}


// Easter egg: doble click en el corazón del footer
export function initEasterEgg() {
    const heart = qs('.footer__heart');
    if (!heart) return;

    let clicks = 0;
    let timer = null;

    on(heart, 'click', () => {
        clicks++;
        clearTimeout(timer);

        if (clicks === 2) {
            // Efecto especial
            heart.style.transform = 'scale(2)';
            heart.textContent = '💕';
            
            setTimeout(() => {
                heart.style.transform = 'scale(1)';
                heart.textContent = '❤️';
            }, 500);

            // Lanzar confetti
            const canvas = qs('#confetti-canvas');
            if (canvas) {
                import('./confetti.js').then(({ shootConfetti }) => {
                    shootConfetti(canvas);
                });
            }

            clicks = 0;
        }

        timer = setTimeout(() => {
            clicks = 0;
        }, 500);
    });
}
