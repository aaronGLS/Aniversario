// countdown.js — Contador en tiempo real desde una fecha
import { guatemalaMidnight, diffParts } from './utils.js';


export function initCountdown({ sinceISO, els }) {
    const since = guatemalaMidnight(sinceISO);

    function update() {
        const { days, hours, minutes, seconds } = diffParts(since);
        els.days.textContent = days;
        els.hours.textContent = hours;
        els.minutes.textContent = minutes;
        els.seconds.textContent = seconds;
    }

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
}
