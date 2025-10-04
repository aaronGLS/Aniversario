// extras.js — Funcionalidades adicionales opcionales
import { qs, on, prefersReducedMotion } from './utils.js';


// Partículas flotantes de corazones en el hero
export function initFloatingHearts() {
    if (prefersReducedMotion()) return;
    
    const hero = qs('.hero');
    if (!hero) return;
    
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    const particlesCount = 8; // Número de partículas flotantes
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Posición inicial aleatoria
        const startX = Math.random() * 100;
        const duration = 10 + Math.random() * 8; // 10-18 segundos
        const delay = Math.random() * 5; // 0-5 segundos de delay
        const size = 1.5 + Math.random() * 1.5; // 1.5-3rem
        
        heart.style.cssText = `
            position: absolute;
            left: ${startX}%;
            bottom: -50px;
            font-size: ${size}rem;
            opacity: 0;
            pointer-events: none;
            filter: blur(0.5px);
            animation: floatingUp ${duration}s ease-in-out ${delay}s infinite;
            z-index: 0;
        `;
        
        hero.appendChild(heart);
    }
    
    // Crear partículas iniciales
    for (let i = 0; i < particlesCount; i++) {
        createHeart();
    }
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#floating-hearts-style')) {
        const style = document.createElement('style');
        style.id = 'floating-hearts-style';
        style.textContent = `
            @keyframes floatingUp {
                0% {
                    bottom: -50px;
                    opacity: 0;
                    transform: translateX(0) rotate(0deg) scale(0.8);
                }
                10% {
                    opacity: 0.6;
                }
                30% {
                    transform: translateX(${Math.random() > 0.5 ? '' : '-'}${15 + Math.random() * 25}px) 
                               rotate(${90 + Math.random() * 90}deg) 
                               scale(${0.95 + Math.random() * 0.2});
                }
                50% {
                    transform: translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px) 
                               rotate(${180 + Math.random() * 90}deg) 
                               scale(${0.9 + Math.random() * 0.3});
                }
                70% {
                    transform: translateX(${Math.random() > 0.5 ? '' : '-'}${30 + Math.random() * 30}px) 
                               rotate(${270 + Math.random() * 45}deg) 
                               scale(${0.85 + Math.random() * 0.25});
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    bottom: 110%;
                    opacity: 0;
                    transform: translateX(${Math.random() > 0.5 ? '' : '-'}${50 + Math.random() * 80}px) 
                               rotate(${360 + Math.random() * 180}deg) 
                               scale(0.7);
                }
            }
            
            /* Respetar prefers-reduced-motion */
            @media (prefers-reduced-motion: reduce) {
                .floating-heart {
                    animation: none !important;
                    opacity: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}


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
