// utils.js — helpers pequeños y sin dependencias
export function trapFocus(container) {
    trapFocus._cleanup?.();
    if (!container) return;

    const focusable = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handle(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    }

    container.addEventListener('keydown', handle);
    trapFocus._cleanup = () => container.removeEventListener('keydown', handle);
    first?.focus();
}
trapFocus._cleanup = null;

export function releaseFocus() {
    trapFocus._cleanup?.();
    trapFocus._cleanup = null;
}


// Bloquear scroll del body cuando un modal está abierto
let _scrollY = 0;
export function lockBodyScroll() {
    _scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_scrollY}px`;
    document.body.style.width = '100%';
}
export function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, _scrollY);
}


// Formato de fecha local (es-ES)
export function formatDateISO(iso) {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(d);
}


// Guatemala no tiene DST; offset UTC-6 todo el año.
// Construye Date para medianoche en Guatemala.
export function guatemalaMidnight(yyyy_mm_dd) {
    const [y, m, d] = yyyy_mm_dd.split('-').map(Number);
    // 00:00 GT = 06:00 UTC
    return new Date(Date.UTC(y, m - 1, d, 6, 0, 0));
}


export function diffParts(fromDate, toDate = new Date()) {
    let delta = Math.max(0, toDate - fromDate);
    const days = Math.floor(delta / 86400000); delta -= days * 86400000;
    const hours = Math.floor(delta / 3600000); delta -= hours * 3600000;
    const minutes = Math.floor(delta / 60000); delta -= minutes * 60000;
    const seconds = Math.floor(delta / 1000);
    return { days, hours, minutes, seconds };
}

export function preloadImage(src) { 
    return new Promise((res, rej) => { 
        const img = new Image(); 
        img.onload = () => res(src); 
        img.onerror = rej; 
        img.src = src; 
    }); 
}

// Shortcuts para DOM
export const qs = (sel, ctx = document) => ctx.querySelector(sel);
export const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
export const on = (el, evt, fn) => el?.addEventListener(evt, fn);

// Detectar prefers-reduced-motion
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}