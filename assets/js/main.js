/* VANTA Works site script.
   Edit CONFIG when the business number, email and service areas are confirmed. */
(function () {
  'use strict';

  var CONFIG = {
    // International format, digits only, no "+" (e.g. "263771234567").
    // While empty, WhatsApp links open WhatsApp's own "choose a contact" screen with the message filled in.
    whatsapp: '',
    phoneDisplay: '+263 7X XXX XXXX',
    email: 'hello@vantaworks.co.zw',
    areas: 'Bulawayo and Harare',
    areasShort: 'Bulawayo · Harare'
  };

  function waUrl(text) {
    var base = CONFIG.whatsapp ? 'https://wa.me/' + CONFIG.whatsapp : 'https://wa.me/';
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  }

  function mailUrl(subject, body) {
    return 'mailto:' + CONFIG.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  // Contact details and links
  each('[data-wa]', function (a) {
    a.href = waUrl(a.getAttribute('data-wa-text') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });
  each('[data-phone]', function (el) { el.textContent = CONFIG.phoneDisplay; });
  each('[data-email]', function (el) { el.textContent = CONFIG.email; });
  each('[data-areas]', function (el) { el.textContent = CONFIG.areas; });
  each('[data-areas-short]', function (el) { el.textContent = CONFIG.areasShort; });
  each('[data-tel]', function (a) {
    if (CONFIG.whatsapp) {
      a.href = 'tel:+' + CONFIG.whatsapp;
    } else {
      // No real number yet: send people to the form instead of a dead tel: link.
      a.href = '#assessment';
    }
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Assessment form: composes a message and hands it to WhatsApp or email.
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var errorEl = document.getElementById('form-error');
  var resultEl = document.getElementById('form-result');
  var previewEl = document.getElementById('form-preview');
  var emailBtn = document.getElementById('send-email');
  var copyBtn = document.getElementById('copy-message');

  var required = [
    { id: 'f-name', label: 'your name' },
    { id: 'f-phone', label: 'a phone or WhatsApp number' },
    { id: 'f-city', label: 'your city' }
  ];

  function value(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function validate() {
    var missing = [];
    required.forEach(function (f) {
      var el = document.getElementById(f.id);
      var empty = !el.value.trim();
      el.setAttribute('aria-invalid', String(empty));
      if (empty) missing.push(f.label);
    });
    if (missing.length) {
      errorEl.textContent = 'Please add ' + joinList(missing) + ' so we can reach you.';
      errorEl.hidden = false;
      document.getElementById(required.filter(function (f) { return !value(f.id); })[0].id).focus();
      return false;
    }
    errorEl.hidden = true;
    return true;
  }

  function joinList(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  function compose() {
    var services = Array.prototype.map.call(
      form.querySelectorAll('input[name="services"]:checked'),
      function (el) { return el.value; }
    );
    var lines = ["Hi VANTA Works, I'd like to request a Property Assessment.", ''];
    lines.push('Name: ' + value('f-name'));
    if (value('f-business')) lines.push('Business: ' + value('f-business'));
    lines.push('Phone: ' + value('f-phone'));
    if (value('f-email')) lines.push('Email: ' + value('f-email'));
    lines.push('City: ' + value('f-city'));
    if (value('f-type')) lines.push('Property: ' + value('f-type'));
    if (services.length) lines.push('Services: ' + services.join(', '));
    if (value('f-notes')) lines.push('', value('f-notes'));
    return lines.join('\n');
  }

  function showResult(message) {
    previewEl.textContent = message;
    resultEl.hidden = false;
  }

  // Keep invalid markers in step with what the visitor types.
  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) {
      e.target.setAttribute('aria-invalid', 'false');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var message = compose();
    showResult(message);
    window.open(waUrl(message), '_blank', 'noopener');
  });

  emailBtn.addEventListener('click', function () {
    if (!validate()) return;
    var message = compose();
    showResult(message);
    var subject = 'Property Assessment request' + (value('f-business') ? ' · ' + value('f-business') : '');
    window.location.href = mailUrl(subject, message);
  });

  copyBtn.addEventListener('click', function () {
    var text = previewEl.textContent;
    var done = function () {
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = 'Copy message'; }, 2000);
    };
    var fallback = function () {
      var range = document.createRange();
      range.selectNodeContents(previewEl);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyBtn.textContent = 'Selected, press copy';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  });
})();
