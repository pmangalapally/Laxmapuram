/**
 * Laxmapuram Village Website – Main JavaScript
 * Pure Vanilla JS – no dependencies
 */

(function () {
  'use strict';

  /* ── Hamburger Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu when a nav link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ── Sticky Header Shadow on Scroll ── */
  const siteNav = document.querySelector('.site-nav');

  if (siteNav) {
    const scrollHandler = function () {
      if (window.scrollY > 10) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // run on load
  }

  /* ── Active Nav Link Highlighting ── */
  function setActiveNav() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      // Resolve the href relative to current location
      let linkPath = href;

      // Normalize: strip trailing slash, lowercase
      const normalize = function (p) {
        return p.replace(/\\/g, '/').replace(/\/$/, '').toLowerCase();
      };

      const normCurrent = normalize(currentPath);
      const normLink    = normalize(linkPath);

      // Check if it's the home page
      const isHome =
        normCurrent === '' ||
        normCurrent.endsWith('/index.html') ||
        normCurrent === '/';

      const linkIsHome =
        normLink === '' ||
        normLink.endsWith('/index.html') ||
        normLink === '/' ||
        normLink === '.';

      let active = false;

      if (linkIsHome && isHome) {
        active = true;
      } else if (!linkIsHome && !isHome) {
        // Match the filename portion
        const currentFile = normCurrent.split('/').pop();
        const linkFile    = normLink.split('/').pop();
        active = currentFile === linkFile && currentFile !== '';
      }

      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  setActiveNav();

  /* ── Smooth Scrolling for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navH  = siteNav ? siteNav.offsetHeight : 0;
      const top   = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ── Intersection Observer: Animate-on-scroll ── */
  if ('IntersectionObserver' in window) {
    const observerOpts = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOpts);

    document.querySelectorAll(
      '.landmark-card, .temple-card, .festival-card, .info-card, .person-card, .gallery-item, .tl-item, .quick-card'
    ).forEach(function (el) {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  }

  /* ── Current Year in Footer ── */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

})();
