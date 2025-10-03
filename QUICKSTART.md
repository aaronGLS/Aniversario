# 🚀 Guía Rápida de Inicio

## ⚡ 3 Pasos para Personalizar

### 1️⃣ Edita tus datos (5 minutos)

Abre `js/data.js` y cambia:
- ✏️ Nombres (líneas 4-5)
- 📅 Fecha de inicio (línea 6)
- 💌 Tu carta personalizada (línea 10)
- 📸 Nombres de tus fotos (línea 17+)

### 2️⃣ Agrega tus fotos

Arrastra tus fotos a `assets/img/`:
- Para timeline: `01-inicio.jpg`, `02-peli.jpg`, etc.
- Para galería: `g1.jpg`, `g2.jpg`, etc.

### 3️⃣ Ejecuta el sitio

**Windows (cmd):**
```bash
cd "c:\Users\aaron\Desktop\Proyectos html\Aniversario"
python -m http.server 8000
```

**Mac/Linux (terminal):**
```bash
cd ~/ruta/al/proyecto
python3 -m http.server 8000
```

Luego abre: http://localhost:8000

---

## 🎨 Cambios Rápidos de Estilo

### Cambiar colores
Edita `css/styles.css` línea 2-6:
```css
--color-primary: #e91e63;  /* Tu color favorito */
--color-accent: #ffd1dc;   /* Color suave */
```

### Agregar fuente bonita
Agrega en `index.html` después de la línea 17:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
```

Luego en `css/styles.css` línea 42:
```css
font-family: 'Poppins', sans-serif;
```

---

## 🌟 Funciones Extra (Opcional)

Para activar animaciones adicionales:

1. Abre `index.html`
2. Después de la línea 17, agrega:
```html
<link rel="stylesheet" href="css/animations-extra.css" />
```

3. Abre `js/app.js`
4. Descomenta las líneas 63-80 (quita los `/*` y `*/`)

Esto activará:
- ✨ Barra de progreso al scrollear
- 👆 Indicador de scroll animado
- 🎭 Animaciones de entrada suaves
- 🎉 Easter egg en el footer

---

## 📤 Publicar en Internet (Gratis)

### Netlify (Más fácil)
1. Arrastra la carpeta completa a: https://app.netlify.com/drop
2. ¡Listo! Te da una URL automática

### GitHub Pages
1. Crea cuenta en GitHub.com
2. Crea nuevo repositorio
3. Sube todos los archivos
4. Settings > Pages > Selecciona rama main
5. Tu sitio estará en: `https://tu-usuario.github.io/nombre-repo`

---

## ❓ Problemas Comunes

### ❌ "Las imágenes no aparecen"
✅ Verifica que los nombres coincidan exactamente con `data.js`
✅ Usa un servidor local (no abras index.html directamente)

### ❌ "No funciona nada"
✅ Abre la consola del navegador (F12) y revisa errores
✅ Asegúrate de estar usando Chrome/Firefox/Safari actualizado

### ❌ "El confetti no sale"
✅ Verifica que existe `<canvas id="confetti-canvas">` en index.html

---

## 💡 Tips Finales

- 📸 Optimiza fotos antes de subirlas (máx 1MB cada una)
- 🎨 Usa colores que combinen con tus fotos
- 📱 Prueba en móvil antes de compartir
- 💾 Guarda copias de respaldo
- ❤️ ¡Disfruta el proceso de crear algo especial!

---

## 📞 Ayuda

Si tienes problemas:
1. Lee el `README.md` completo
2. Revisa la consola del navegador (F12)
3. Verifica que todos los archivos estén en su lugar

---

**¡Todo listo! Ahora solo personaliza y comparte. 💝**
