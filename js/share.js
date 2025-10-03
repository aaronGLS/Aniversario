export function shareOrFallback({ message, url, hashtags = [] }) {
    const text = [message, hashtags.map(h => h.startsWith('#') ? h : '#' + h).join(' ')].filter(Boolean).join(' ');
    if (navigator.share) {
        navigator.share({ title: document.title, text, url }).catch(() => {/* silencioso */ });
    } else {
        const link = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        window.open(link, '_blank', 'noopener');
    }
}