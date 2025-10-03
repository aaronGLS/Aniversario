// Confeti mejorado (canvas) — respeta prefers-reduced-motion
import { prefersReducedMotion } from './utils.js';


export function shootConfetti(canvas) {
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Validar contexto
    
    // Hacer visible el canvas primero
    canvas.classList.add('active');
    
    // Ahora obtener las dimensiones correctas
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    // Colores temáticos del sitio
    const colors = [
        '#e91e63', // Primary pink
        '#f48fb1', // Light pink
        '#ffd1dc', // Accent pink
        '#ff4081', // Vibrant pink
        '#ff80ab', // Soft pink
        '#c2185b', // Dark pink
        '#ffffff', // White
    ];

    // Tipos de partículas
    const shapes = ['circle', 'square', 'heart', 'star'];

    const N = 150; // Más partículas
    const parts = [];
    
    for (let i = 0; i < N; i++) {
        parts.push({
            x: Math.random() * W,
            y: Math.random() * -H - 100, // Empiezan más arriba
            r: 3 + Math.random() * 5, // Tamaño variable
            vx: -2 + Math.random() * 4, // Velocidad horizontal más variada
            vy: 1 + Math.random() * 3, // Velocidad vertical inicial
            gravity: 0.15 + Math.random() * 0.1, // Gravedad realista
            a: Math.random() * Math.PI * 2, // Ángulo inicial
            rotationSpeed: -0.05 + Math.random() * 0.1, // Velocidad de rotación
            opacity: 1, // Opacidad para fade-out
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            wobble: Math.random() * 0.5, // Efecto de bamboleo
            wobbleSpeed: 0.03 + Math.random() * 0.02
        });
    }

    const DURATION = 4000; // 4 segundos total
    const FADE_START = 3000; // Empieza a desaparecer a los 3s

    let start = performance.now();
    
    function frame(t) {
        const elapsed = t - start;
        
        if (elapsed > DURATION) {
            // Limpiar el canvas completamente
            ctx.clearRect(0, 0, W, H);
            // Ocultar con fade-out suave del canvas
            canvas.classList.remove('active');
            return;
        }
        
        // Limpiar frame anterior
        ctx.clearRect(0, 0, W, H);
        
        // Calcular factor de fade-out para las partículas
        let globalFade = 1;
        if (elapsed > FADE_START) {
            globalFade = 1 - (elapsed - FADE_START) / (DURATION - FADE_START);
        }
        
        for (const p of parts) {
            // Actualizar física
            p.vy += p.gravity; // Aplicar gravedad
            p.x += p.vx + Math.sin(elapsed * p.wobbleSpeed) * p.wobble; // Bamboleo
            p.y += p.vy;
            p.a += p.rotationSpeed;
            
            // Fade-out gradual
            p.opacity = globalFade;
            
            // Si sale por abajo, reiniciar arriba (solo en los primeros 2.5s)
            if (p.y > H + 50 && elapsed < 2500) {
                p.y = -50;
                p.x = Math.random() * W;
                p.vy = 1 + Math.random() * 2;
            }
            
            // Dibujar partícula
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.a);
            ctx.globalAlpha = p.opacity;
            
            // Dibujar según forma
            switch(p.shape) {
                case 'circle':
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'square':
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
                    break;
                    
                case 'heart':
                    ctx.fillStyle = p.color;
                    drawHeart(ctx, 0, 0, p.r * 0.8);
                    break;
                    
                case 'star':
                    ctx.fillStyle = p.color;
                    drawStar(ctx, 0, 0, 5, p.r, p.r * 0.5);
                    break;
            }
            
            ctx.restore();
        }
        
        requestAnimationFrame(frame);
    }
    
    requestAnimationFrame(frame);
}

// Función para dibujar corazón
function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // Curva izquierda superior
    ctx.bezierCurveTo(
        x, y, 
        x - size / 2, y, 
        x - size / 2, y + topCurveHeight
    );
    // Curva izquierda inferior
    ctx.bezierCurveTo(
        x - size / 2, y + (size + topCurveHeight) / 2, 
        x, y + (size + topCurveHeight) / 2, 
        x, y + size
    );
    // Curva derecha inferior
    ctx.bezierCurveTo(
        x, y + (size + topCurveHeight) / 2, 
        x + size / 2, y + (size + topCurveHeight) / 2, 
        x + size / 2, y + topCurveHeight
    );
    // Curva derecha superior
    ctx.bezierCurveTo(
        x + size / 2, y, 
        x, y, 
        x, y + topCurveHeight
    );
    ctx.fill();
}

// Función para dibujar estrella
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}