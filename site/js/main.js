/* ════════════════════════════════════════════════════════════════
   BeanRunner — global behaviour (runs on every page)
   - Mobile nav toggle
   - Smooth in-page scroll for #anchors
   The nav/footer markup is duplicated into each page (no build step),
   so this file is the single source of truth for their behaviour.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Design & Branding ─────────────────────────────────────────
     Reads content/design.json (editable in the CMS "Design & Branding"
     panel) and applies it as CSS-variable overrides. Falls back silently
     to the built-in BeanRunner palette if the file is missing/invalid. */
  (function applyDesign() {
    var FONTS = {
      'Playfair Display': "'Playfair Display', Georgia, serif",
      'DM Sans': "'DM Sans', system-ui, sans-serif",
      'DM Mono': "'DM Mono', monospace",
      'Georgia': 'Georgia, serif'
    };
    fetch('content/design.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        var s = document.documentElement.style;
        if (d.accent_color) s.setProperty('--amber', d.accent_color);
        if (d.highlight_color) s.setProperty('--gold', d.highlight_color);
        if (d.page_background) s.setProperty('--white', d.page_background);
        if (d.heading_font && FONTS[d.heading_font]) s.setProperty('--serif', FONTS[d.heading_font]);
        if (d.body_font && FONTS[d.body_font]) s.setProperty('--sans', FONTS[d.body_font]);
      })
      .catch(function () { /* keep defaults */ });
  })();

  /* ── Mobile nav toggle ─────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu after tapping a link
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Smooth scroll for same-page anchors ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    a.addEventListener('click', function (e) {
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Scroll reveal (IntersectionObserver) ──────────────────── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
    io.observe(el);
  });

  /* ── Stage-light parallax (homepage only) ──────────────────── */
  var light = document.querySelector('.stage-light');
  if (light && document.body.classList.contains('page-home')) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var drift = Math.min(window.scrollY * 0.14, 200);
        light.style.transform = 'translateX(-50%) translateY(' + drift + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }
})();
