/* ============================================================
   SHAKIFY MOTION — behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const scrubBar = document.querySelector('.scrub-bar');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 30);

    if (scrubBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      scrubBar.style.width = pct + '%';
    }

    const toTop = document.querySelector('.to-top');
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    }));
  }

  /* ---------- active nav link ---------- */
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- scroll-to-top ---------- */
  const toTopBtn = document.querySelector('.to-top');
  if (toTopBtn) toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
      const group = el.closest('[data-reveal-group]');
      if (group) {
        const siblings = Array.from(group.querySelectorAll('[data-reveal]'));
        el.style.setProperty('--i', siblings.indexOf(el));
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- hero player parallax on mouse move ---------- */
  const player = document.querySelector('.player');
  const heroSection = document.querySelector('.hero');
  if (player && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      player.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      player.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
    player.style.transition = 'transform .4s ease';
    player.style.transformStyle = 'preserve-3d';
  }

  /* ---------- animated waveform bars (random heights) ---------- */
  document.querySelectorAll('.waveform, .mini-wave').forEach(wf => {
    const bars = 18;
    for (let i = 0; i < bars; i++) {
      const bar = document.createElement('span');
      const h = 20 + Math.random() * 80;
      bar.style.height = h + '%';
      bar.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
      wf.appendChild(bar);
    }
  });

  /* ---------- testimonials slider ---------- */
  const slides = document.querySelectorAll('.testi-slide');
  const dotsWrap = document.querySelector('.testi-dots');
  if (slides.length && dotsWrap) {
    let current = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => go(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');

    function go(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    let auto = setInterval(() => go((current + 1) % slides.length), 5500);
    dotsWrap.addEventListener('click', () => { clearInterval(auto); auto = setInterval(() => go((current + 1) % slides.length), 5500); });
  }

  /* ---------- portfolio filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portItems = document.querySelectorAll('.port-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        portItems.forEach(item => {
          const show = f === 'all' || item.dataset.category === f;
          item.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ---------- contact form (front-end only) ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
      form.reset();
      setTimeout(() => success && success.classList.remove('show'), 5000);
    });
  }

  /* ---------- custom cursor dot (desktop) ---------- */
  const cursor = document.querySelector('.cursor-dot');
  if (cursor && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,.card,.port-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.4)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

});