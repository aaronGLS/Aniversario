/**
 * Confetti mejorado usando canvas-confetti
 * Optimizado, robusto y con control de estado
 * @see https://github.com/catdad/canvas-confetti
 */

import { prefersReducedMotion } from './utils.js';

// Estado de la animación para prevenir múltiples ejecuciones
let isAnimating = false;
let animationTimeout = null;

// Colores temáticos del sitio
const THEME_COLORS = [
    '#e91e63', // Primary pink
    '#f48fb1', // Light pink
    '#ffd1dc', // Accent pink
    '#ff4081', // Vibrant pink
    '#ff80ab', // Soft pink
    '#c2185b', // Dark pink
    '#ffffff', // White
];

/**
 * Lanza confeti con animación elegante
 * Previene ejecuciones múltiples y respeta accesibilidad
 */
export async function shootConfetti() {
    // Respetar preferencias de usuario
    if (prefersReducedMotion()) {
        console.log('Confetti deshabilitado: usuario prefiere movimiento reducido');
        return;
    }
    
    // Prevenir múltiples ejecuciones simultáneas
    if (isAnimating) {
        console.log('Confetti ya en ejecución, ignorando click');
        return;
    }
    
    // Verificar que canvas-confetti esté cargado
    if (typeof confetti === 'undefined') {
        console.error('canvas-confetti no está cargado');
        return;
    }
    
    // Marcar como activo
    isAnimating = true;
    
    try {
        // Configuración base optimizada
        const defaults = {
            colors: THEME_COLORS,
            disableForReducedMotion: true,
            useWorker: true, // Usar Web Worker para mejor performance
        };
        
        // Configurar instancia con defaults
        const fire = confetti.create(undefined, {
            resize: true, // Auto-resize en cambios de viewport
            ...defaults
        });
        
        // 🎉 EFECTO 1: Explosión desde abajo (centro)
        await fire({
            particleCount: 200,
            spread: 100,
            origin: { x: 0.5, y: 1 }, // Centro-abajo
            startVelocity: 60,
            gravity: 1.2,
            ticks: 200,
            scalar: 1.2,
            shapes: ['circle', 'square'],
        });
        
        // 🎊 EFECTO 2: Lluvia lateral izquierda (delay 150ms)
        await delay(150);
        fire({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 }, // Izquierda-medio
            startVelocity: 45,
            gravity: 1,
            ticks: 180,
            scalar: 0.9,
        });
        
        // 🎊 EFECTO 3: Lluvia lateral derecha (delay 150ms)
        await delay(150);
        fire({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 }, // Derecha-medio
            startVelocity: 45,
            gravity: 1,
            ticks: 180,
            scalar: 0.9,
        });
        
        // 💖 EFECTO 4: Corazones flotantes (delay 200ms)
        await delay(200);
        fire({
            particleCount: 30,
            spread: 100,
            origin: { x: 0.5, y: 0.9 },
            startVelocity: 35,
            gravity: 0.8,
            ticks: 250,
            scalar: 1.5,
            shapes: ['heart'],
            flat: false, // Partículas más planas (efecto 2D)
        });
        
        // ✨ EFECTO 5: Estallido final central (delay 300ms)
        await delay(300);
        fire({
            particleCount: 60,
            spread: 360,
            origin: { x: 0.5, y: 0.5 }, // Centro pantalla
            startVelocity: 25,
            gravity: 0.6,
            ticks: 150,
            scalar: 0.8,
            decay: 0.9,
        });
        
        // Esperar que todas las animaciones terminen (aproximadamente 3s)
        animationTimeout = setTimeout(() => {
            isAnimating = false;
            console.log('Animación de confetti completada');
        }, 3500);
        
    } catch (error) {
        console.error('Error al ejecutar confetti:', error);
        isAnimating = false;
    }
}

/**
 * Cancela la animación de confetti en progreso
 */
export function cancelConfetti() {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    
    if (typeof confetti !== 'undefined') {
        confetti.reset(); // Limpia todas las partículas
    }
    
    isAnimating = false;
}

/**
 * Helper para crear delays entre efectos
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verifica si canvas-confetti está disponible
 */
export function isConfettiAvailable() {
    return typeof confetti !== 'undefined';
}