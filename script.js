(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primaryNav');

  const setMenuState = (open) => {
    if (!menuToggle || !nav) return;
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      setMenuState(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuState(false);
        menuToggle.focus();
      }
    });
  }

  const progress = document.getElementById('scrollProgress');

  const updateScrollUI = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;

    if (progress) progress.style.width = `${pct}%`;
    if (header) header.classList.toggle('scrolled', doc.scrollTop > 12);
  };

  document.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -42px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const navLinks = nav
    ? Array.from(nav.querySelectorAll('a[href^="#"]')).filter((link) => link.getAttribute('href') !== '#top')
    : [];

  const sections = navLinks
    .map((link) => {
      const selector = link.getAttribute('href');
      const section = selector ? document.querySelector(selector) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      const activeId = visible[0].target.id;

      sections.forEach(({ link, section }) => {
        const isActive = section.id === activeId;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {
      rootMargin: '-28% 0px -58% 0px',
      threshold: [0, 0.15, 0.35, 0.6]
    });

    sections.forEach(({ section }) => activeObserver.observe(section));
  }

  const capabilityTabs = Array.from(document.querySelectorAll('.capability-tab'));
  const capabilityPanels = Array.from(document.querySelectorAll('.capability-panel'));

  const activateCapability = (index, moveFocus = false) => {
    capabilityTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
      if (active && moveFocus) tab.focus();
    });

    capabilityPanels.forEach((panel, panelIndex) => {
      const active = panelIndex === index;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  };

  capabilityTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateCapability(index));

    tab.addEventListener('keydown', (event) => {
      const horizontal = window.matchMedia('(min-width: 881px)').matches;
      const previousKeys = horizontal ? ['ArrowUp', 'ArrowLeft'] : ['ArrowUp', 'ArrowLeft'];
      const nextKeys = horizontal ? ['ArrowDown', 'ArrowRight'] : ['ArrowDown', 'ArrowRight'];

      if (previousKeys.includes(event.key)) {
        event.preventDefault();
        const nextIndex = (index - 1 + capabilityTabs.length) % capabilityTabs.length;
        activateCapability(nextIndex, true);
      }

      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        const nextIndex = (index + 1) % capabilityTabs.length;
        activateCapability(nextIndex, true);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        activateCapability(0, true);
      }

      if (event.key === 'End') {
        event.preventDefault();
        activateCapability(capabilityTabs.length - 1, true);
      }
    });
  });

  if (capabilityTabs.length) activateCapability(0);

  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((key) => {
    const field = document.getElementById(key);
    if (field) field.value = params.get(key) || '';
  });

  const landingPath = document.getElementById('landing_path');
  if (landingPath) {
    landingPath.value = `${window.location.pathname}${window.location.search}`;
  }

  const referrerField = document.getElementById('referrer');
  if (referrerField) {
    referrerField.value = document.referrer || '';
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('href');
      if (target === '#consultation' && window.dataLayer) {
        window.dataLayer.push({
          event: 'consultation_cta_click',
          source: link.closest('.sticky-consult')
            ? 'sticky_prompt'
            : link.closest('.site-header')
              ? 'header'
              : 'page'
        });
      }
    });
  });


  const sticky = document.getElementById('stickyConsult');
  const stickyClose = document.getElementById('stickyClose');
  const dismissed = sessionStorage.getItem('hc_consult_dismissed') === '1';

  const consultation = document.getElementById('consultation');
  let consultationVisible = false;

  if (consultation && 'IntersectionObserver' in window) {
    const consultObserver = new IntersectionObserver((entries) => {
      consultationVisible = entries.some((entry) => entry.isIntersecting);
      if (sticky && consultationVisible) sticky.classList.remove('visible');
    }, { threshold: 0.15 });

    consultObserver.observe(consultation);
  }

  if (sticky && !dismissed) {
    window.setTimeout(() => {
      if (!consultationVisible) sticky.classList.add('visible');
    }, 6500);
  }

  if (stickyClose && sticky) {
    stickyClose.addEventListener('click', () => {
      sticky.classList.remove('visible');
      sessionStorage.setItem('hc_consult_dismissed', '1');
    });
  }

  const form = document.querySelector('form[name="consultation"]');
  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', () => {
      const formData = new FormData(form);
      const leadContext = {
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        organization: String(formData.get('organization') || ''),
        phone: String(formData.get('phone') || ''),
        focus: String(formData.get('focus') || ''),
        utm_source: String(formData.get('utm_source') || ''),
        utm_medium: String(formData.get('utm_medium') || ''),
        utm_campaign: String(formData.get('utm_campaign') || ''),
        utm_content: String(formData.get('utm_content') || '')
      };

      sessionStorage.setItem('hc_consultation_lead', JSON.stringify(leadContext));

      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'consultation_form_submit',
          focus: leadContext.focus,
          organization: leadContext.organization
        });
      }

      if (submitButton) {
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.innerHTML = 'Saving Request…';
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) setMenuState(false);
  });
})();