/* ════════════════════════════════════════════════════════════════
   BeanRunner — CMS collection renderers
   Fetches the JSON files that Decap CMS writes to /content/ and renders
   them client-side. Each render function is a no-op unless its target
   container exists on the current page, so this one file is safe to
   include anywhere.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Minimal HTML-escaping for text pulled from the CMS
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + url + ' (' + r.status + ')');
      return r.json();
    });
  }

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // "18:30" -> "6:30pm"
  function fmtTime(hm) {
    if (!hm) return '';
    var p = String(hm).split(':');
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10) || 0;
    var ap = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (m < 10 ? '0' + m : m) + ap;
  }

  // Derive the display bits from an event. Supports the new schema
  // (date + doors + show) and falls back to the legacy day/month/time fields.
  function eventParts(e) {
    if (e.date) {
      var p = String(e.date).split('-');
      var dt = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10)); // local, no TZ shift
      var weekday = WEEKDAYS[dt.getDay()];
      var time = weekday;
      if (e.doors) time += ' · Doors ' + fmtTime(e.doors);
      if (e.show) time += ' · Show ' + fmtTime(e.show);
      return { day: String(dt.getDate()), month: MONTHS[dt.getMonth()] + ' ' + dt.getFullYear(), time: time };
    }
    return { day: e.day, month: e.month, time: e.time }; // legacy
  }

  /* ── EVENTS ────────────────────────────────────────────────── */
  function renderEvents() {
    var list = document.getElementById('events-list');
    if (!list) return;
    getJSON('content/events.json').then(function (data) {
      var events = (data && data.events) || [];
      if (!events.length) { list.innerHTML = '<p class="events-empty">No upcoming shows posted right now — check back soon.</p>'; return; }
      list.innerHTML = events.map(function (e) {
        var p = eventParts(e);
        return '' +
          '<article class="event-row">' +
            '<div class="event-row-date">' +
              '<div class="event-row-day">' + esc(p.day) + '</div>' +
              '<div class="event-row-month">' + esc(p.month) + '</div>' +
            '</div>' +
            '<div class="event-row-body">' +
              '<div class="event-row-type">' + esc(e.type) + '</div>' +
              '<h3 class="event-row-name">' + esc(e.name) + '</h3>' +
              '<p class="event-row-detail">' + esc(e.detail) + '</p>' +
              '<div class="event-row-time">' + esc(p.time) + '</div>' +
            '</div>' +
            '<a class="schedule-btn" href="tel:+19147371701">Reserve</a>' +
          '</article>';
      }).join('');
    }).catch(function (err) {
      list.innerHTML = '<p class="events-empty">Couldn\'t load events. Please call 914-737-1701 for the schedule.</p>';
      console.error(err);
    });
  }

  /* ── EVENTS PREVIEW (home — first 3, card style) ───────────── */
  function renderEventsPreview() {
    var grid = document.getElementById('events-preview-grid');
    if (!grid) return;
    getJSON('content/events.json').then(function (data) {
      var events = ((data && data.events) || []).slice(0, 3);
      if (!events.length) { grid.innerHTML = '<p class="event-detail">No upcoming shows posted — check back soon.</p>'; return; }
      grid.innerHTML = events.map(function (e) {
        var p = eventParts(e);
        return '' +
          '<article class="event-card">' +
            '<div class="event-type">' + esc(e.type) + '</div>' +
            '<div class="event-day">' + esc(p.day) + '</div>' +
            '<div class="event-month">' + esc(p.month) + '</div>' +
            '<h3 class="event-name">' + esc(e.name) + '</h3>' +
            '<p class="event-detail">' + esc(e.detail) + '</p>' +
            '<div class="event-time">' + esc(p.time) + '</div>' +
          '</article>';
      }).join('');
    }).catch(function (err) {
      grid.innerHTML = '<p class="event-detail">See our upcoming shows on the <a href="events.html" style="color:var(--amber);">Events page</a>.</p>';
      console.error(err);
    });
  }

  /* ── EXHIBITS (gallery) ────────────────────────────────────── */
  function renderExhibits() {
    var grid = document.getElementById('exhibit-grid');
    if (!grid) return;
    getJSON('content/exhibits.json').then(function (data) {
      var items = (data && data.exhibits) || [];
      if (!items.length) { grid.innerHTML = '<p class="gallery-empty">No exhibits posted right now — check back soon.</p>'; return; }
      grid.innerHTML = items.map(function (x) {
        return '' +
          '<figure class="exhibit-card">' +
            '<img src="' + esc(x.image) + '" alt="' + esc(x.title) + ' by ' + esc(x.artist) + '" loading="lazy">' +
            '<figcaption class="exhibit-meta">' +
              '<div class="exhibit-meta-eyebrow">' + esc(x.status || 'Exhibit') + '</div>' +
              '<div class="exhibit-meta-title">' + esc(x.title) + '</div>' +
              '<div class="exhibit-meta-sub">' + esc(x.artist) + (x.dates ? ' · ' + esc(x.dates) : '') + '</div>' +
            '</figcaption>' +
          '</figure>';
      }).join('');
    }).catch(function (err) {
      grid.innerHTML = '<p class="gallery-empty">Couldn\'t load exhibits right now.</p>';
      console.error(err);
    });
  }

  /* ── MENU ──────────────────────────────────────────────────── */
  function renderMenu() {
    var tabbar = document.getElementById('menu-tabbar');
    var body = document.getElementById('menu-body');
    if (!tabbar || !body) return;

    getJSON('content/menu.json').then(function (data) {
      var cats = (data && data.categories) || [];
      if (!cats.length) { body.innerHTML = '<p class="menu-foot-note">Menu coming soon — call 914-737-1701.</p>'; return; }

      // Tabs
      tabbar.innerHTML = '<div class="menu-tabbar-inner">' + cats.map(function (c, i) {
        return '<button data-target="cat-' + esc(c.id) + '"' + (i === 0 ? ' class="active"' : '') + '>' + esc(c.title) + '</button>';
      }).join('') + '</div>';

      // Sections
      body.innerHTML = cats.map(function (c) {
        var items = (c.items || []).map(function (it) {
          var thumb = it.image ? '<img class="menu-row-thumb" src="' + esc(it.image) + '" alt="' + esc(it.name) + '" loading="lazy" width="76" height="76">' : '';
          var priceClass = (String(it.price).indexOf('/') > -1 || String(it.price).indexOf('–') > -1) ? 'menu-row-price range' : 'menu-row-price';
          var tag = it.badge ? '<span class="menu-tag ' + esc(it.badge) + '">' + badgeLabel(it.badge) + '</span>' : '';
          var desc = it.desc ? '<p class="menu-row-desc">' + esc(it.desc) + '</p>' : '';
          return '' +
            '<div class="menu-row">' +
              thumb +
              '<div class="menu-row-body">' +
                '<div class="menu-row-top">' +
                  '<span class="menu-row-name">' + esc(it.name) + '</span>' +
                  '<span class="menu-row-leader"></span>' +
                  '<span class="' + priceClass + '">' + esc(it.price) + '</span>' +
                '</div>' +
                desc + tag +
              '</div>' +
            '</div>';
        }).join('');
        var note = c.note ? '<p class="menu-cat-note">' + esc(c.note) + '</p>' : '';
        return '' +
          '<section class="menu-category" id="cat-' + esc(c.id) + '">' +
            '<div class="menu-cat-header"><h2 class="menu-cat-title">' + esc(c.title) + '</h2><span class="menu-cat-line"></span></div>' +
            note +
            '<div class="menu-list">' + items + '</div>' +
          '</section>';
      }).join('') + (data.note ? '<p class="menu-foot-note">' + esc(data.note) + '</p>' : '');

      wireMenuTabs(tabbar, cats);
    }).catch(function (err) {
      body.innerHTML = '<p class="menu-foot-note">Couldn\'t load the menu. Please call 914-737-1701.</p>';
      console.error(err);
    });
  }

  function badgeLabel(b) {
    return { vegan: 'Vegan', veg: 'Vegetarian', gf: 'Gluten-Free', special: 'Weekend Special' }[b] || b;
  }

  function wireMenuTabs(tabbar, cats) {
    var buttons = Array.prototype.slice.call(tabbar.querySelectorAll('button'));
    var sections = cats.map(function (c) { return document.getElementById('cat-' + c.id); });

    // Click → smooth scroll to section
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var el = document.getElementById(btn.getAttribute('data-target'));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Scrollspy → highlight the section currently in view
    function onScroll() {
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      var offset = navH + 70;
      var cur = 0;
      sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= offset) cur = i; });
      buttons.forEach(function (b, i) { b.classList.toggle('active', i === cur); });
      var activeBtn = buttons[cur];
      if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderEventsPreview();
    renderEvents();
    renderExhibits();
    renderMenu();
  });
})();
