(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primaryNav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    progress.style.width = `${pct}%`;
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((key) => {
    const field = document.getElementById(key);
    if (field) field.value = params.get(key) || '';
  });
  const landingPath = document.getElementById('landing_path');
  if (landingPath) landingPath.value = `${window.location.pathname}${window.location.search}`;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('href');
      if (target === '#consultation' && window.dataLayer) {
        window.dataLayer.push({ event: 'consultation_cta_click', source: link.closest('.sticky-consult') ? 'sticky' : 'page' });
      }
    });
  });

  const sticky = document.getElementById('stickyConsult');
  const stickyClose = document.getElementById('stickyClose');
  const dismissed = sessionStorage.getItem('hc_consult_dismissed') === '1';
  if (sticky && !dismissed) {
    window.setTimeout(() => sticky.classList.add('visible'), 5000);
  }
  if (stickyClose && sticky) {
    stickyClose.addEventListener('click', () => {
      sticky.classList.remove('visible');
      sessionStorage.setItem('hc_consult_dismissed', '1');
    });
  }

  const form = document.querySelector('form[name="consultation"]');
  if (form) {
    form.addEventListener('submit', () => {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'consultation_form_submit' });
      }
    });
  }
})();
