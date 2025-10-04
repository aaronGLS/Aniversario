import { qs, on, trapFocus, releaseFocus, lockBodyScroll, unlockBodyScroll } from './utils.js';


export function initLetter({ html, selectors }) {
    const btnOpen = qs(selectors.open);
    const panel = qs(selectors.panel);
    const paper = qs(selectors.paper);
    const btnClose = qs(selectors.close);
    const btnPrint = qs(selectors.print);

    // Validar elementos
    if (!btnOpen || !panel || !paper || !btnClose || !btnPrint) {
        console.warn('Letter: algunos elementos no fueron encontrados');
        return;
    }

    paper.innerHTML = html;


    function open() {
        panel.hidden = false;
        btnOpen.setAttribute('aria-expanded', 'true');
        lockBodyScroll();
        trapFocus(panel);
        
        // Prevenir scroll al hacer focus
        const scrollY = window.scrollY;
        paper.focus({ preventScroll: true });
        window.scrollTo(0, scrollY);
    }
    function close() {
        panel.hidden = true;
        btnOpen.setAttribute('aria-expanded', 'false');
        releaseFocus();
        unlockBodyScroll();
        
        // Prevenir scroll al devolver el foco
        const scrollY = window.scrollY;
        btnOpen.focus({ preventScroll: true });
        window.scrollTo(0, scrollY);
    }


    on(btnOpen, 'click', open);
    on(btnClose, 'click', close);
    on(panel, 'keydown', (e) => { if (e.key === 'Escape') close(); });
    on(btnPrint, 'click', () => window.print());


    return { open, close };
}