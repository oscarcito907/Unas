# Pétalo · Nail Studio

Web de ejemplo para una tienda de uñas, hecha con **HTML, CSS y JavaScript puro** (sin dependencias ni compilación).

## Secciones incluidas

- **Hero** con llamada a la acción y valoraciones.
- **Servicios / ejemplos de uñas**: 6 diseños con filtros por categoría y botón «Reservar» que precarga el servicio.
- **Galería de fotos** con lightbox (flechas del teclado, clic y Escape para cerrar).
- **Reseñas** de clientas con puntuación.
- **Reserva de citas**: formulario con validación, selector de fecha (mínimo hoy, máximo 60 días, domingos cerrados), horarios y confirmación con código de reserva.
- **Contacto** con dirección, horario, email, teléfono y enlace a Google Maps.

## Cómo verla

Abre `index.html` directamente en el navegador o levanta un servidor local:

```bash
cd nail-studio
python3 -m http.server 8000
```

Después visita `http://localhost:8000`.

## Personalización

1. **Fotos**: las imágenes de `assets/` son ilustraciones SVG de ejemplo. Sustitúyelas por tus fotos manteniendo el mismo nombre de archivo (o cambia las rutas en `index.html`). Si usas JPG/PNG, actualiza también la extensión en `index.html` y en el atributo `data-src` de la galería.
2. **Datos del negocio**: editan el nombre, dirección, teléfono, email y horario en `index.html` (sección `#contacto` y footer). El enlace de Google Maps también está ahí.
3. **Servicios y precios**: modifica las tarjetas en `#servicios` y las `<option>` del `<select>` en `#reserva` para que coincidan.
4. **Colores**: cambia las variables de `:root` al inicio de `styles.css`.
5. **Reservas**: el sistema es una demo: valida y muestra confirmación en pantalla, pero **no guarda datos ni envía emails**. Para producción habría que conectar el formulario a un backend y a una base de datos.

## Accesibilidad y detalles

- Navegación por teclado, etiquetas en formularios, mensajes de error y `aria-live` en el resumen.
- Diseño responsive (móvil, tablet y escritorio) y respeto a `prefers-reduced-motion`.
- Las fuentes se cargan desde Google Fonts; si no hay conexión se usan fuentes del sistema.
