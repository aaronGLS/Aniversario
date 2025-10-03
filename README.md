# 💝 Sitio Web de Aniversario

Un hermoso sitio web para celebrar tu primer aniversario con diseño romántico y funcionalidades interactivas.

## ✨ Características

- 🎉 **Hero animado** con contador en tiempo real
- 📅 **Línea de tiempo** interactiva con fotos de momentos especiales
- 💌 **Carta romántica** en modal con opción de impresión a PDF
- 🖼️ **Galería de fotos** con lightbox
- 💍 **Sección de promesas/votos**
- 🎊 **Efecto confetti** al hacer clic en "Empezar"
- 🌙 **Modo oscuro automático** (según preferencias del sistema)
- 📱 **Totalmente responsive** (móvil, tablet, desktop)
- ♿ **Accesible** (ARIA labels, navegación por teclado)
- 🖨️ **Impresión optimizada** de la carta

## 🚀 Cómo usar

### 1. Personalización básica

Edita el archivo `js/data.js` para personalizar todo el contenido:

```javascript
export const SITE = {
    meta: { annivLabel: '1er Aniversario' },
    couple: {
        you: 'Tu Nombre',        // ← Cambia aquí
        partner: 'Su Nombre',    // ← Cambia aquí
        since: '2024-10-03',     // ← Fecha de inicio (YYYY-MM-DD)
        tagline: '365 días de nosotros 💘'
    },
    palette: {
        primary: '#e91e63',      // Color principal
        accent: '#ffd1dc',       // Color de acento
        bg: '#fff8f9',          // Fondo
        text: '#231f20'         // Texto
    },
    letter: `...`,              // Tu carta personalizada
    timeline: [...],            // Momentos importantes
    gallery: [...],             // Fotos para la galería
    vows: [...]                 // Promesas/votos
};
```

### 2. Agregar tus fotos

Coloca tus imágenes en la carpeta `assets/img/`:

**Para el timeline:**
- `01-inicio.jpg`
- `02-peli.jpg`
- `03-nochebuena.jpg`
- etc.

**Para la galería:**
- `g1.jpg`
- `g2.jpg`
- `g3.jpg`
- etc.

**Para Open Graph (compartir en redes):**
- `og.jpg` (1200x630px recomendado)

### 3. Ejecutar el sitio

Debido a que usa ES6 Modules, necesitas un servidor web local:

**Opción 1 - Con Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Opción 2 - Con Node.js:**
```bash
npx serve
```

**Opción 3 - Con VS Code:**
Instala la extensión "Live Server" y haz clic derecho > "Open with Live Server"

Luego abre en tu navegador: `http://localhost:8000`

## 📁 Estructura del proyecto

```
Aniversario/
├── index.html              # Página principal
├── css/
│   ├── styles.css         # Estilos principales
│   └── print.css          # Estilos para impresión
├── js/
│   ├── app.js            # Inicialización principal
│   ├── data.js           # ⭐ EDITA ESTE ARCHIVO
│   ├── countdown.js      # Contador en tiempo real
│   ├── timeline.js       # Línea de tiempo
│   ├── letter.js         # Modal de carta
│   ├── gallery.js        # Galería con lightbox
│   ├── vows.js          # Sección de promesas
│   ├── confetti.js      # Animación de confetti
│   ├── share.js         # Compartir en redes
│   └── utils.js         # Funciones auxiliares
└── assets/
    ├── img/             # ⭐ AGREGA TUS FOTOS AQUÍ
    │   ├── 01-inicio.jpg
    │   ├── g1.jpg
    │   └── og.jpg
    └── icons/
        └── heart.svg    # Ícono de corazón
```

## 🎨 Personalización avanzada

### Cambiar colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --color-primary: #e91e63;  /* Rosa */
    --color-accent: #ffd1dc;   /* Rosa claro */
    --color-bg: #fff8f9;       /* Fondo */
    --color-text: #231f20;     /* Texto */
}
```

### Agregar más fuentes

Agrega en el `<head>` de `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
```

Luego en CSS:

```css
body {
    font-family: 'Poppins', sans-serif;
}

h1, h2, h3 {
    font-family: 'Playfair Display', serif;
}
```

## 🌐 Publicar en línea

### Opción 1 - GitHub Pages (Gratis)

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages
4. Selecciona la rama `main` y carpeta `/ (root)`
5. Tu sitio estará en: `https://tu-usuario.github.io/nombre-repo`

### Opción 2 - Netlify (Gratis)

1. Arrastra la carpeta del proyecto a [Netlify Drop](https://app.netlify.com/drop)
2. ¡Listo! Obtendrás una URL automática

### Opción 3 - Vercel (Gratis)

1. Instala Vercel CLI: `npm i -g vercel`
2. En la carpeta del proyecto: `vercel`
3. Sigue las instrucciones

## 📱 Compartir

El sitio incluye un botón de compartir que:
- En móvil: usa la API nativa de compartir
- En desktop: abre WhatsApp Web

## 💡 Tips

1. **Optimiza las imágenes** antes de subirlas (máx 1MB cada una)
2. **Usa formato WebP** para mejor rendimiento
3. **Prueba en diferentes dispositivos** (móvil, tablet, desktop)
4. **Revisa en modo oscuro** si tu sistema lo soporta
5. **Imprime la carta** como prueba antes de compartir

## 🐛 Solución de problemas

### Las imágenes no se ven
- Verifica que los nombres de archivo coincidan exactamente con `data.js`
- Asegúrate de estar usando un servidor web (no `file://`)

### El confetti no funciona
- Revisa la consola del navegador (F12)
- Verifica que `confetti-canvas` exista en el HTML

### Los módulos JS no cargan
- Debes usar un servidor web local (no abrir directamente el HTML)
- Los navegadores bloquean ES6 Modules con `file://`

## 📄 Licencia

Este proyecto es de uso personal. Siéntete libre de modificarlo y personalizarlo.

## ❤️ Hecho con amor

Este sitio fue creado para celebrar momentos especiales. ¡Disfrútalo y compártelo!

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver errores.
