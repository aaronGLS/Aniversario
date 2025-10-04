import { qs, on, trapFocus, releaseFocus, lockBodyScroll, unlockBodyScroll } from './utils.js';


export function initLetter({ html, selectors }) {
    const btnOpen = qs(selectors.open);
    const panel = qs(selectors.panel);
    const paper = qs(selectors.paper);
    const btnClose = qs(selectors.close);

    // Validar elementos
    if (!btnOpen || !panel || !paper || !btnClose) {
        console.warn('Letter: algunos elementos no fueron encontrados');
        return;
    }

    paper.innerHTML = html;

    // Evitar que un ancestro con transform (p. ej. .section) convierta
    // el position:fixed del panel en relativo al contenedor. Reparentamos
    // temporalmente el panel al <body> al abrir, y lo devolvemos al cerrar.
    const originalParent = panel.parentElement;
    let marker = null;

    function mountToBody() {
        if (panel.parentElement !== document.body) {
            marker = document.createComment('letter-panel-marker');
            originalParent.insertBefore(marker, panel);
            document.body.appendChild(panel);
        }
    }

    function restoreToOriginal() {
        if (marker && marker.parentNode && originalParent) {
            originalParent.insertBefore(panel, marker);
            marker.remove();
            marker = null;
        }
    }


    function open() {
        mountToBody();
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
        restoreToOriginal();
        
        // Prevenir scroll al devolver el foco
        const scrollY = window.scrollY;
        btnOpen.focus({ preventScroll: true });
        window.scrollTo(0, scrollY);
    }


    on(btnOpen, 'click', open);
    on(btnClose, 'click', close);
    on(panel, 'keydown', (e) => { if (e.key === 'Escape') close(); });
    
    // Cerrar al hacer clic fuera de la carta
    on(panel, 'click', (e) => {
        if (e.target === panel) close();
    });


    return { open, close };
}
