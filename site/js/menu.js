(function () {
  'use strict';

  var tabs     = document.querySelectorAll('.menu-tab');
  var sections = document.querySelectorAll('.menu-category');
  var tabsWrap = document.querySelector('.menu-tabs-wrap');

  if (!tabs.length || !sections.length) return;

  /* ── Tab click → smooth scroll to section ── */
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = tab.getAttribute('data-target');
      var el = document.getElementById(targetId);
      if (!el) return;
      var navH  = (document.querySelector('nav') || {}).offsetHeight || 58;
      var tabsH = tabsWrap ? tabsWrap.offsetHeight : 44;
      /* header = marquee(35) + nav(58) + tabs bar height + 16px breathing room */
      var offset = 35 + navH + tabsH + 16;
      var top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll → update active tab ── */
  window.addEventListener('scroll', function () {
    var navH  = (document.querySelector('nav') || {}).offsetHeight || 58;
    var tabsH = tabsWrap ? tabsWrap.offsetHeight : 44;
    var offset = 35 + navH + tabsH + 40;
    var cur = 0;
    sections.forEach(function (s, i) {
      if (s.getBoundingClientRect().top <= offset) cur = i;
    });
    tabs.forEach(function (t) { t.classList.remove('active'); });
    if (tabs[cur]) tabs[cur].classList.add('active');
  }, { passive: true });

})();
