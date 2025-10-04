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
        li.style.transitionDelay = `${idx * 0.1}s`;
        li.setAttribute('data-index', idx);
        
        li.innerHTML = `
<div class="timeline__media" role="button" tabindex="0" aria-label="Ver imagen: ${it.title}">
<picture>
<img src="${it.img}" alt="${it.alt || it.title || 'Momento especial'}" loading="lazy" decoding="async" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ffd1dc%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23e91e63%22 font-family=%22sans-serif%22 font-size=%2220%22%3E%E2%9D%A4%EF%B8%8F%3C/text%3E%3C/svg%3E'" />
</picture>
</div>
<div class="timeline__content">
<time class="timeline__meta" datetime="${it.date}">${formatDateISO(it.date)}</time>
<h3 class="timeline__title">${it.title}</h3>
<p class="timeline__text">${it.text}</p>
</div>`;
        frag.appendChild(li);
    });
    mount.innerHTML = '';
    mount.appendChild(frag);


    // Animación al entrar en viewport con mejor threshold
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { 
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
    
    qsa('.timeline__item', mount).forEach(el => io.observe(el));
    
    // Hacer las imágenes clickeables para abrir en lightbox
    setupTimelineImageClick(mount);
}

function setupTimelineImageClick(mount) {
    const lightbox = qs('#lightbox');
    const lightboxImg = qs('#lightbox-img');
    const lightboxCaption = qs('#lightbox-caption');
    const lightboxClose = qs('#lightbox-close');
    const lightboxPrev = qs('#lightbox-prev');
    const lightboxNext = qs('#lightbox-next');
    
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    
    // Ocultar controles de navegación para timeline (solo una imagen)
    if (lightboxPrev) lightboxPrev.style.display = 'none';
    if (lightboxNext) lightboxNext.style.display = 'none';
    
    qsa('.timeline__media', mount).forEach(media => {
        media.addEventListener('click', () => openTimelineImage(media));
        media.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openTimelineImage(media);
            }
        });
    });
    
    function openTimelineImage(media) {
        const img = media.querySelector('img');
        const content = media.closest('.timeline__item').querySelector('.timeline__content');
        const title = content.querySelector('.timeline__title').textContent;
        const date = content.querySelector('.timeline__meta').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = `${title} — ${date}`;
        lightbox.hidden = false;
        
        // Prevenir scroll al hacer focus
        const scrollY = window.scrollY;
        lightbox.focus({ preventScroll: true });
        window.scrollTo(0, scrollY);
        
        // Bloquear scroll del body sin causar saltos
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
    
    // Restaurar controles y scroll cuando se cierre
    if (lightboxClose) {
        const closeHandler = () => {
            if (lightboxPrev) lightboxPrev.style.display = '';
            if (lightboxNext) lightboxNext.style.display = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
        lightboxClose.addEventListener('click', closeHandler);
        
        // También manejar ESC
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeHandler();
            }
        });
    }
}