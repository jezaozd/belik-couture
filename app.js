(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- с галёрки — вблизи: прокрутка приближает платье ---------- */
  var zoom = $('#zoom'), pic = $('#zpic'), steps = $$('.z-steps li'), last = -1, ticking = false;
  function smooth(a, b, v) { var t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
  function onScroll() {
    ticking = false;
    var r = zoom.getBoundingClientRect(), span = zoom.offsetHeight - window.innerHeight;
    var p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
    var s = .34 + smooth(0, .85, p) * 2.1;
    pic.style.setProperty('--s', s.toFixed(3));
    pic.style.setProperty('--n', smooth(.62, .9, p).toFixed(3));
    zoom.style.setProperty('--o', (1 - smooth(.12, .38, p)).toFixed(3));
    var k = p < .3 ? 0 : p < .66 ? 1 : 2;
    if (k !== last) { steps.forEach(function (li, i) { li.classList.toggle('on', i === k); }); last = k; }
  }
  function req() { if (!ticking) { ticking = true; (window.requestAnimationFrame || setTimeout)(onScroll, 16); } }
  if (zoom && pic) {
    if (calm) { pic.style.setProperty('--s', '1'); }
    else { window.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req); onScroll(); }
  }

  /* ---------- карточки выходов Couture 2026 (подписи — переводы подписей @belik.official) ---------- */
  var L = [
    ['DQEM9fwjEqw_0', 'Драпированный бархатный корсет с ручной вышивкой и шёлковая юбка'],
    ['DQCG9TbjNDH_0', 'Бархатное платье с асимметричным корсетом и ручной вышивкой'],
    ['DQJozrUjKqk_0', 'Кружевное платье с корсетом и позолоченными деталями'],
    ['DQTqT2-jJNC_0', 'Шёлковое платье-корсет с ручной вышивкой'],
    ['DQY1V80jFZo_0', 'Платье из шёлкового крепа с выстеганным вручную корсетом и драпированными рукавами'],
    ['DP3f6f4jB6G_0', 'Драпированное шёлковое мини-платье с выстеганным вручную корсетом; сумка из латуни с эмалью и золочением'],
    ['DP6iYJTjCRk_0', 'Платье из хлопковой сетки с ручной вышивкой и кружевной мозаикой'],
    ['DQWSSD5jLap_0', 'Белое драпированное платье-корсет'],
    ['DQbfJDQDLZ__1', 'Сумка «Tears of Suyumbiké»: латунь с позолотой, прессованное стекло']
  ];
  var box = $('#cards'), model = $('#model');
  L.forEach(function (l, i) {
    var no = (i + 1 < 10 ? '0' : '') + (i + 1);
    var a = document.createElement('article');
    a.className = 'card';
    a.innerHTML = '<img src="img/' + l[0] + '.webp" width="900" height="1200" loading="lazy" decoding="async" alt="' + l[1].replace(/"/g, '') + '">' +
      '<div class="c-row"><span>Выход</span><b>' + no + '</b></div><p>' + l[1] + '</p>' +
      '<button class="pick" type="button">Хочу так</button>';
    $('.pick', a).addEventListener('click', function () {
      $$('.card.picked', box).forEach(function (c) { c.classList.remove('picked'); });
      a.classList.add('picked');
      model.value = 'Выход ' + no + ' — ' + l[1];
      document.getElementById('card').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
    });
    box.appendChild(a);
  });

  /* ---------- карточка примерки в WhatsApp ---------- */
  var form = $('#form'), ferr = $('#ferr');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name;
    if (name.value.trim().length < 2) {
      name.setAttribute('aria-invalid', 'true');
      ferr.textContent = 'Напишите, как к вам обращаться, — карточку заводят на имя клиентки.';
      name.focus(); return;
    }
    name.setAttribute('aria-invalid', 'false'); ferr.textContent = '';
    var occ = (form.querySelector('input[name="occ"]:checked') || {}).value;
    var text = 'Здравствуйте! Хочу записаться на примерку BELIK.\nКлиентка: ' + name.value.trim() + '\nПовод: ' + occ +
      (model.value.trim() ? '\nМодель: ' + model.value.trim() : '') + (form.elements.when.value.trim() ? '\nКогда нужно: ' + form.elements.when.value.trim() : '');
    window.open('https://wa.me/79253571145?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
