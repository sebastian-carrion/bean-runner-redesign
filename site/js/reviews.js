/* ════════════════════════════════════════════════════════════════
   BeanRunner — reviews carousel
   Auto-advances, pauses on hover/focus, supports arrows + dots + keys.
   Expects: .reviews-track > .review-card, .reviews-dot buttons,
            [data-review-prev] / [data-review-next] arrow buttons.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var track = document.querySelector('.reviews-track');
  if (!track) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.review-card'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.reviews-dot'));
  var section = document.querySelector('.reviews-section');
  var DELAY = 5500;
  var cur = 0;
  var timer = null;

  function show(idx) {
    cards[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = (idx + cards.length) % cards.length;
    cards[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  }

  function start() { stop(); timer = setInterval(function () { show(cur + 1); }, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function go(idx) { show(idx); start(); }

  // Dots
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { go(i); });
    dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
  });

  // Arrows
  var prev = document.querySelector('[data-review-prev]');
  var next = document.querySelector('[data-review-next]');
  if (prev) prev.addEventListener('click', function () { go(cur - 1); });
  if (next) next.addEventListener('click', function () { go(cur + 1); });

  // Pause on hover / focus within
  if (section) {
    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', start);
  }

  // Keyboard arrows when carousel region is focused
  if (section) {
    section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(cur - 1); }
      else if (e.key === 'ArrowRight') { go(cur + 1); }
    });
  }

  start();
})();
