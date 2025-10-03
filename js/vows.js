import { qs } from './utils.js';


export function renderVows({ vows, mount }) {
    if (!vows?.length || !mount) return;
    const norm = vows.map(v => typeof v === 'string' ? { title: v, text: '' } : v);
    const html = norm.map(v => `
<article class="vows__card">
<h3 class="vows__title">${v.title}</h3>
${v.text ? `<p class="vows__text">${v.text}</p>` : ''}
</article>`).join('');
    mount.innerHTML = html;
}