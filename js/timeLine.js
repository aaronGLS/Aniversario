import { qs, qsa, formatDateISO } from './utils.js';


export function renderTimeline({ items, mount }) {
    if (!items?.length || !mount) return;
    
    // Actualizar contador de eventos
    const badge = qs('#timeline-count');
    if (badge) {
        badge.textContent = items.length;
    }
    
    const frag = document.createDocumentFragment();
    items.forEach((it, idx) => {
        const li = document.createElement('li');
        li.className = 'timeline__item';
        li.setAttribute('data-index', idx);
        
        // Crear estructura optimizada (solo imagen y fecha)
        const media = document.createElement('div');
        media.className = 'timeline__media';
        media.setAttribute('role', 'button');
        media.setAttribute('tabindex', '0');
        media.setAttribute('aria-label', `Ver imagen: ${it.title}`);
        
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = it.img;
        img.alt = it.alt || it.title || 'Momento especial';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = function() {
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ffd1dc' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23e91e63' font-family='sans-serif' font-size='20'%3E%E2%9D%A4%EF%B8%8F%3C/text%3E%3C/svg%3E";
        };
        picture.appendChild(img);
        media.appendChild(picture);
        
        const content = document.createElement('div');
        content.className = 'timeline__content';
        
        const time = document.createElement('time');
        time.className = 'timeline__meta';
        time.setAttribute('datetime', it.date);
        time.textContent = formatDateISO(it.date);
        
        content.appendChild(time);
        
        // Guardamos title y text como data attributes por si se necesitan más tarde
        li.dataset.title = it.title;
        li.dataset.text = it.text;
        
        li.appendChild(media);
        li.appendChild(content);
        frag.appendChild(li);
    });
    
    mount.innerHTML = '';
    mount.appendChild(frag);

    // Hacer las imágenes clickeables para abrir en lightbox
    setupTimelineImageClick(mount);
    
    // NOTA: La animación de entrada se maneja en app.js con el observer global
    // para evitar duplicación y mejorar performance
}

function setupTimelineImageClick(mount) {
    const lightbox = qs('#lightbox');
    const lightboxImg = qs('#lightbox-img');
    const lightboxCaption = qs('#lightbox-caption');
    const lightboxClose = qs('#lightbox-close');
    const lightboxPrev = qs('#lightbox-prev');
    const lightboxNext = qs('#lightbox-next');
    
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    
    // Delegación de eventos para mejor rendimiento
    mount.addEventListener('click', (e) => {
        const media = e.target.closest('.timeline__media');
        if (media) openTimelineImage(media);
    });
    
    mount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const media = e.target.closest('.timeline__media');
            if (media) {
                e.preventDefault();
                openTimelineImage(media);
            }
        }
    });
    
    function openTimelineImage(media) {
        const img = media.querySelector('img');
        const item = media.closest('.timeline__item');
        const date = item.querySelector('.timeline__meta').textContent;
        const title = item.dataset.title || '';
        
        // Ocultar controles de navegación (no se necesitan en timeline)
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = title ? `${title} — ${date}` : date;
        lightbox.hidden = false;
        
        // Marcar que se abrió desde timeline
        lightbox.dataset.source = 'timeline';
        
        // Prevenir scroll al hacer focus
        requestAnimationFrame(() => {
            lightbox.focus({ preventScroll: true });
        });
        
        // Bloquear scroll del body sin causar saltos
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
    
    // Manejar cierre del lightbox (solo agregamos si no existe ya)
    if (!lightboxClose.dataset.timelineListenerAdded) {
        lightboxClose.dataset.timelineListenerAdded = 'true';
        
        lightboxClose.addEventListener('click', handleTimelineClose);
        
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                handleTimelineClose();
            }
        });
    }
    
    function handleTimelineClose() {
        // Solo restaurar si se abrió desde timeline
        if (lightbox.dataset.source === 'timeline') {
            // Restaurar controles para la galería
            if (lightboxPrev) lightboxPrev.style.display = '';
            if (lightboxNext) lightboxNext.style.display = '';
            delete lightbox.dataset.source;
        }
        
        // Siempre desbloquear scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
}