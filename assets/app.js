const body = document.body;
const lockScroll = (on) => body.style.overflow = on ? 'hidden' : '';

const langWrap = document.querySelector('.lang-dropdown');
if (langWrap) {
  const pill = langWrap.querySelector('.lang-pill');
  pill.addEventListener('click', () => {
    const open = langWrap.classList.toggle('open');
    pill.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!langWrap.contains(e.target)) {
      langWrap.classList.remove('open');
      pill.setAttribute('aria-expanded', 'false');
    }
  });
}

const drawer = document.querySelector('.drawer');
const burger = document.querySelector('.burger');
const drawerClose = document.querySelector('.drawer-close');
let lastFocus = null;
const focusables = () => drawer?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
const toggleDrawer = (open) => {
  if (!drawer) return;
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  burger?.setAttribute('aria-expanded', String(open));
  lockScroll(open);
  if (open) {
    lastFocus = document.activeElement;
    focusables()?.[0]?.focus();
  } else {
    lastFocus?.focus();
  }
};
burger?.addEventListener('click', () => toggleDrawer(true));
drawerClose?.addEventListener('click', () => toggleDrawer(false));
drawer?.addEventListener('click', (e) => { if (e.target === drawer) toggleDrawer(false); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toggleDrawer(false);
    closeModal();
  }
  if (e.key === 'Tab' && drawer?.classList.contains('open')) {
    const f = [...focusables()];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

const faqButtons = document.querySelectorAll('.faq-item button');
faqButtons.forEach((btn) => btn.addEventListener('click', () => {
  const parent = btn.closest('.faq-item');
  const willOpen = !parent.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'false');
  });
  if (willOpen) {
    parent.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}));

const modal = document.querySelector('.modal');
const modalOpen = document.querySelector('[data-open-modal="privacy"]');
const modalClose = () => document.querySelectorAll('[data-close-modal], .modal-x');
const openModal = () => { if (!modal) return; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); lockScroll(true); modal.querySelector('.modal-x')?.focus(); };
const closeModal = () => { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); lockScroll(false); modalOpen?.focus(); };
modalOpen?.addEventListener('click', openModal);
modalClose().forEach(el => el.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const amountButtons = document.querySelectorAll('.seg');
const months = document.getElementById('months');
const monthsValue = document.getElementById('monthsValue');
let selectedAmount = 10000;
const locale = body.dataset.locale || 'en-US';
const currency = body.dataset.currency || 'USD';
const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
const updateCalc = () => {
  const m = Number(months?.value || 12);
  monthsValue.textContent = `${m} months`;
  const factor = m / 12;
  const low = selectedAmount * (1 + 0.045 * factor);
  const base = selectedAmount * (1 + 0.085 * factor);
  const high = selectedAmount * (1 + 0.13 * factor);
  document.querySelector('[data-proj="low"]').textContent = fmt.format(low);
  document.querySelector('[data-proj="base"]').textContent = fmt.format(base);
  document.querySelector('[data-proj="high"]').textContent = fmt.format(high);
};
amountButtons.forEach((btn) => btn.addEventListener('click', () => {
  amountButtons.forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  selectedAmount = Number(btn.dataset.amount);
  updateCalc();
}));
months?.addEventListener('input', updateCalc);
updateCalc();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate([{opacity:0, transform:'translateY(16px)'},{opacity:1, transform:'translateY(0)'}], {duration:500, fill:'forwards'});
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.2});
document.querySelectorAll('.section').forEach((s) => observer.observe(s));
