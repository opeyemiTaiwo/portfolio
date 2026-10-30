// Navigation: collapsible menu on small screens and current-section highlight.
(function () {
  var nav = document.getElementById('site-nav');
  if (!nav) return;
  var toggle = nav.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var label = nav.querySelector('.nav-toggle-label');
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
  var small = window.matchMedia('(max-width: 1000px)');

  nav.classList.add('is-enhanced');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
    if (small.matches) {
      menu.toggleAttribute('inert', !open);
    } else {
      menu.removeAttribute('inert');
    }
  }

  setOpen(false);
  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
  links.forEach(function (a) { a.addEventListener('click', function () { if (small.matches) setOpen(false); }); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });
  var onChange = function () { setOpen(false); };
  if (small.addEventListener) small.addEventListener('change', onChange); else small.addListener(onChange);

  // Highlight the section currently in view.
  if (!('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) byId[el.id] = a;
  });
  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
    var current = null;
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!current && visible[id]) current = id;
    });
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(byId).forEach(function (id) { observer.observe(document.getElementById(id)); });
})();
