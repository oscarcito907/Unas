/* =========================================================
   PÉTALO · NAIL STUDIO — Interacciones
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año en el footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header al hacer scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

  /* ---------- Animación de entrada ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Filtros de diseños ---------- */
  const chips = document.querySelectorAll('.filter-chip');
  const serviceCards = document.querySelectorAll('.service-card');
  const noResults = document.getElementById('noResults');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach(c => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      let visible = 0;
      serviceCards.forEach(card => {
        const show = filter === 'todos' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      noResults.hidden = visible !== 0;
    });
  });

  /* ---------- Lightbox de galería ---------- */
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  let currentIndex = 0;
  let lastFocused = null;

  const showPhoto = (index) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.src;
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption;
  };

  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    showPhoto(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
  lightboxClose.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => showPhoto(currentIndex - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => showPhoto(currentIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ---------- Formulario de reserva ---------- */
  const form = document.getElementById('bookingForm');
  const servicio = document.getElementById('servicio');
  const fecha = document.getElementById('fecha');
  const summaryText = document.getElementById('summaryText');
  const horaInputs = [...document.querySelectorAll('input[name="hora"]')];

  // Fecha mínima = hoy (en hora local)
  const toLocalISO = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  };
  const today = new Date();
  fecha.min = toLocalISO(today);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);
  fecha.max = toLocalISO(maxDate);

  const prettyDate = (value) => {
    if (!value) return '';
    const [y, m, d] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
      .format(new Date(y, m - 1, d)).replace('.', '');
  };

  const updateSummary = () => {
    const selectedHora = horaInputs.find(input => input.checked);
    const parts = [servicio.value, prettyDate(fecha.value), selectedHora?.value].filter(Boolean);
    summaryText.textContent = parts.length ? parts.join(' · ') : 'Completa los datos para ver el resumen';
  };
  [servicio, fecha, ...horaInputs].forEach(el => el.addEventListener('change', updateSummary));

  // Reservar desde una tarjeta de servicio
  document.querySelectorAll('.book-service').forEach(btn => {
    btn.addEventListener('click', () => {
      servicio.value = btn.dataset.service;
      updateSummary();
      document.getElementById('reserva').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => document.getElementById('nombre').focus({ preventScroll: true }), 550);
    });
  });

  // Validación
  const setError = (name, message) => {
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (error) error.textContent = message;

    if (name === 'hora') {
      document.querySelector('.hora-field').classList.toggle('has-error', Boolean(message));
      return;
    }
    // form.elements devuelve un RadioNodeList para grupos de radios; los campos
    // simples sí son elementos y pueden usar closest().
    const input = form.elements[name];
    if (input && typeof input.closest === 'function') {
      input.closest('.field')?.classList.toggle('has-error', Boolean(message));
    }
  };

  const validate = () => {
    const data = new FormData(form);
    const nombre = data.get('nombre').trim();
    const telefono = data.get('telefono').trim();
    const email = data.get('email').trim();
    const dateValue = data.get('fecha');
    const errors = {};

    if (nombre.length < 3 || !nombre.includes(' ')) errors.nombre = 'Escribe tu nombre y apellidos.';
    if (!/^[\d\s()+-]{9,16}$/.test(telefono) || telefono.replace(/\D/g, '').length < 9) errors.telefono = 'Introduce un teléfono válido (9 dígitos).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Introduce un email válido.';
    if (!servicio.value) errors.servicio = 'Elige un servicio.';

    if (!dateValue) {
      errors.fecha = 'Elige una fecha.';
    } else {
      const [y, m, d] = dateValue.split('-').map(Number);
      const chosen = new Date(y, m - 1, d);
      if (chosen < new Date(today.getFullYear(), today.getMonth(), today.getDate())) errors.fecha = 'La fecha no puede ser anterior a hoy.';
      else if (chosen.getDay() === 0) errors.fecha = 'Los domingos estamos cerrados.';
      else if (chosen > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) errors.fecha = 'Reserva como máximo con 60 días de antelación.';
    }
    if (!data.get('hora')) errors.hora = 'Selecciona una hora.';

    ['nombre', 'telefono', 'email', 'servicio', 'fecha', 'hora'].forEach(name => setError(name, errors[name] || ''));
    return errors;
  };

  // Limpiar error al corregir
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      const name = el.name;
      if (name) setError(name, '');
    });
  });

  /* ---------- Modal de confirmación ---------- */
  const confirmModal = document.getElementById('confirmModal');
  const confirmClose = document.getElementById('confirmClose');
  let modalTrigger = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validate();
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const target = firstError === 'hora'
        ? form.querySelector('input[name="hora"]')
        : form.elements[firstError];
      target?.focus();
      return;
    }

    const data = new FormData(form);
    const details = document.getElementById('confirmDetails');
    details.innerHTML = `
      <div><span>Nombre</span><strong>${escapeHTML(data.get('nombre'))}</strong></div>
      <div><span>Servicio</span><strong>${escapeHTML(data.get('servicio'))}</strong></div>
      <div><span>Fecha</span><strong>${prettyDate(data.get('fecha'))}</strong></div>
      <div><span>Hora</span><strong>${data.get('hora')}</strong></div>`;
    document.getElementById('confirmCode').textContent = 'PET-' + Math.floor(10000 + Math.random() * 89999);

    modalTrigger = document.activeElement;
    confirmModal.hidden = false;
    document.body.style.overflow = 'hidden';
    confirmClose.focus();
  });

  const closeConfirm = () => {
    confirmModal.hidden = true;
    document.body.style.overflow = '';
    form.reset();
    updateSummary();
    ['nombre', 'telefono', 'email', 'servicio', 'fecha', 'hora'].forEach(name => setError(name, ''));
    if (modalTrigger) modalTrigger.focus();
  };
  confirmClose.addEventListener('click', closeConfirm);
  confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) closeConfirm(); });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  /* ---------- Tecla Escape ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!lightbox.hidden) closeLightbox();
    else if (!confirmModal.hidden) closeConfirm();
    else if (mainNav.classList.contains('is-open')) closeNav();
  });

  /* ---------- Navegación con flechas en el lightbox ---------- */
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
});
