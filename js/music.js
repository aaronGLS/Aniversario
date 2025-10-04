const DEFAULT_VOLUME = 0.6;

/**
 * Inicializa la reproducción en loop de una pista de audio.
 * @param {Object} options
 * @param {string} options.src - Ruta del archivo de audio.
 * @param {HTMLElement} [options.trigger] - Elemento que arrancará la música al interactuar.
 * @param {number} [options.volume=0.6] - Volumen inicial entre 0 y 1.
 * @returns {{ audio: HTMLAudioElement, start: () => Promise<void>, pause: () => void }}
 */
export function initBackgroundMusic({ src, trigger, volume = DEFAULT_VOLUME } = {}) {
    if (!src || typeof Audio === "undefined") {
        return {
            audio: null,
            start: () => Promise.resolve(),
            pause: () => undefined
        };
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = clamp(volume, 0, 1);

    let hasStarted = false;

    const tryPlay = () => {
        if (hasStarted) {
            return Promise.resolve();
        }

        return audio.play().then(() => {
            hasStarted = true;
        }).catch((error) => {
            console.warn("No se pudo reproducir la música automáticamente. Intenta interactuar nuevamente.", error);
            scheduleRetry();
        });
    };

    const handleFirstInteraction = () => {
        trigger?.removeEventListener("click", handleFirstInteraction);
        trigger?.removeEventListener("touchstart", handleFirstInteraction);
        tryPlay();
    };

    const scheduleRetry = () => {
        document.addEventListener("click", tryPlay, { once: true });
        document.addEventListener("touchstart", tryPlay, { once: true });
    };

    if (trigger) {
        trigger.addEventListener("click", handleFirstInteraction, { once: true });
        trigger.addEventListener("touchstart", handleFirstInteraction, { once: true });
    } else {
        scheduleRetry();
    }

    return {
        audio,
        start: tryPlay,
        pause: () => audio.pause()
    };
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
