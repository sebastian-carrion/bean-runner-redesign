/* ════════════════════════════════════════════════════════════════
   BeanRunner — global behaviour (runs on every page)
   - Mobile nav toggle
   - Smooth in-page scroll for #anchors
   The nav/footer markup is duplicated into each page (no build step),
   so this file is the single source of truth for their behaviour.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

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
})();
