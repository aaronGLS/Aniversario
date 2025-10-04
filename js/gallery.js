import { qs, qsa, preloadImage, on, lockBodyScroll, unlockBodyScroll, trapFocus, releaseFocus } from './utils.js';


export function initGallery({ photos, mount, lightbox }) {
    if (!photos?.length || !mount) return;


    const frag = document.createDocumentFragment();
    photos.forEach((p, i) => {
        const fig = document.createElement('figure');
        fig.className = 'gallery__item';
        fig.innerHTML = `<img src="${p.src}" alt="${p.alt || 'Foto ' + (i + 1)}" loading="lazy" decoding="async" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23ffd1dc%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23e91e63%22 font-family=%22sans-serif%22 font-size=%2240%22%3E%F0%9F%92%95%3C/text%3E%3C/svg%3E'" />`;
        fig.dataset.idx = String(i);
        fig.tabIndex = 0;
        fig.setAttribute('role', 'button');
        fig.setAttribute('aria-haspopup', 'dialog');
        frag.appendChild(fig);
    });
    mount.innerHTML = '';
    mount.appendChild(frag);


    // Lightbox
    const lb = qs(lightbox.root);
    const img = qs(lightbox.img);
    const caption = qs(lightbox.caption);
    const btnClose = qs(lightbox.close);
    const btnPrev = qs(lightbox.prev);
    const btnNext = qs(lightbox.next);

    // Validar que existan los elementos del lightbox
    if (!lb || !img || !caption || !btnClose || !btnPrev || !btnNext) {
        console.warn('Lightbox: algunos elementos no fueron encontrados');
        return;
    }

    let current = 0;
    let lastTrigger = null;
    function show(i) {
        current = (i + photos.length) % photos.length;
        const p = photos[current];
        lb.hidden = false;
        lb.setAttribute('aria-label', `Imagen ${current + 1} de ${photos.length}`);
        lockBodyScroll();
        trapFocus(lb);
        
        // Prevenir scroll al hacer focus
        const scrollY = window.scrollY;
        btnClose.focus({ preventScroll: true });
        window.scrollTo(0, scrollY);
        
        preloadImage(p.src).then(() => { 
            img.src = p.src; 
            img.alt = p.alt || `Foto ${current + 1}`; 
            caption.textContent = p.alt || `Foto ${current + 1} de ${photos.length}`; 
        }).catch(() => {
            // Fallback en caso de error al cargar
            img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect fill=%22%23ffd1dc%22 width=%22800%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23e91e63%22 font-family=%22sans-serif%22 font-size=%2230%22%3EImagen no disponible %E2%9D%A4%EF%B8%8F%3C/text%3E%3C/svg%3E';
            caption.textContent = 'Imagen no disponible';
        });
    }
    function hide() { 
        lb.hidden = true; 
        releaseFocus(); 
        unlockBodyScroll(); 
        if (lastTrigger && typeof lastTrigger.focus === 'function') { 
            // Prevenir scroll al devolver el foco
            const scrollY = window.scrollY;
            lastTrigger.focus({ preventScroll: true }); 
            window.scrollTo(0, scrollY);
        } 
        lastTrigger = null; 
    }
    function prev() { show(current - 1); }
    function next() { show(current + 1); }

    // Event listeners
    on(btnClose, 'click', hide);
    on(btnPrev, 'click', prev);
    on(btnNext, 'click', next);
    on(lb, 'keydown', (e) => {
        if (e.key === 'Escape') hide();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // Click en las imágenes de la galería
    qsa('.gallery__item', mount).forEach((item, idx) => {
        on(item, 'click', () => {
            lastTrigger = item;
            show(idx);
        });
        on(item, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' ) {
                e.preventDefault();
                lastTrigger = item;
                show(idx);
            }
        });
    });

    return { show, hide };
}