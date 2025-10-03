import { qs, qsa, formatDateISO } from './utils.js';


export function renderTimeline({ items, mount }) {
    if (!items?.length || !mount) return;
    const frag = document.createDocumentFragment();
    items.forEach((it, idx) => {
        const li = document.createElement('li');
        li.className = 'timeline__item';
        li.innerHTML = `
<div class="timeline__media">
<picture>
<img src="${it.img}" alt="${it.alt || it.title || 'Momento especial'}" loading="lazy" decoding="async" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ffd1dc%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23e91e63%22 font-family=%22sans-serif%22 font-size=%2220%22%3E%E2%9D%A4%EF%B8%8F%3C/text%3E%3C/svg%3E'" />
</picture>
</div>
<div class="timeline__content">
<div class="timeline__meta">${formatDateISO(it.date)}</div>
<h3 class="timeline__title">${it.title}</h3>
<p class="timeline__text">${it.text}</p>
</div>`;
        frag.appendChild(li);
    });
    mount.innerHTML = '';
    mount.appendChild(frag);


    // Animación al entrar en viewport
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.2 });
    qsa('.timeline__item', mount).forEach(el => io.observe(el));
}