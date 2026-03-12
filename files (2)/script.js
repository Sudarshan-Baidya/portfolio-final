/* ============================================================
   SUDARSHAN GOVINDA BAIDYA — CINEMATIC PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ── Utility: linear interpolation ───────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

/* ══════════════════════════════════════════════════════════════
   1. CURSOR — smooth spring-physics lag
══════════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200;   // mouse target
  let rx = -200, ry = -200;   // ring position (lagged)

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot follows instantly (no CSS transition — pure JS for max smoothness)
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with spring lerp
  (function loop() {
    rx = lerp(rx, mx, 0.11);
    ry = lerp(ry, my, 0.11);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Expand on hover
  const hoverEls = 'a, button, .skill-card, .project-card, .hobby-chip, .tag-chip, .skill-pill, .side-dot, .contact-card, .filter-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
  });

  // Hide off screen
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ══════════════════════════════════════════════════════════════
   2. STARS — twinkling particle field
══════════════════════════════════════════════════════════════ */
(function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars(220);
  }

  function buildStars(n) {
    stars = Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.0 + 0.15,
      a:  Math.random() * 0.55 + 0.1,
      dy: Math.random() * 0.025 + 0.005,
      tw: Math.random() * 0.014 + 0.003,
      to: Math.random() * Math.PI * 2,
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.35;
    for (const s of stars) {
      const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.to));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,224,255,${alpha})`;
      ctx.fill();
      s.y += s.dy;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();


/* ══════════════════════════════════════════════════════════════
   3. STICKY HEADER
══════════════════════════════════════════════════════════════ */
(function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ══════════════════════════════════════════════════════════════
   4. HERO PARALLAX — smooth cursor-reactive tilt
══════════════════════════════════════════════════════════════ */
(function initHeroParallax() {
  const content = document.getElementById('hero-content');
  if (!content) return;

  let tx = 0, ty = 0;   // targets
  let cx = 0, cy = 0;   // current (lerped)

  document.addEventListener('mousemove', e => {
    const W = window.innerWidth, H = window.innerHeight;
    tx = (e.clientX / W - 0.5) * 18;
    ty = (e.clientY / H - 0.5) * 12;
  });

  (function loop() {
    cx = lerp(cx, tx, 0.055);
    cy = lerp(cy, ty, 0.055);
    content.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
})();


/* ══════════════════════════════════════════════════════════════
   5. SCROLL ANIMATIONS — staggered, smooth reveals
══════════════════════════════════════════════════════════════ */
(function initScrollAnims() {
  const els = document.querySelectorAll('.aos');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      if (entry.isIntersecting) {
        // Scroll down — animate in
        setTimeout(() => el.classList.add('in'), delay);
      } else {
        // Scroll up — reset so it animates again next time
        el.classList.remove('in');
      }
    }
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════════════════════════
   6. ACTIVE NAV + SIDE DOTS
══════════════════════════════════════════════════════════════ */
(function initActiveLinks() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sideDots = document.querySelectorAll('.side-dot');
  const sections = document.querySelectorAll('section[id]');

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      sideDots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === id));
    }
  }, { threshold: 0.38 });

  sections.forEach(s => io.observe(s));
})();


/* ══════════════════════════════════════════════════════════════
   7. PROJECT SLIDER
══════════════════════════════════════════════════════════════ */
(function initSlider() {
  const track  = document.getElementById('projects-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const curEl  = document.getElementById('current-slide');
  const totEl  = document.getElementById('total-slides');
  if (!track || !prevBtn || !nextBtn) return;

  let idx = 0;

  function visibleCards() {
    return Array.from(track.querySelectorAll('.project-card:not(.filtered-out)'));
  }

  function goTo(n) {
    const cards = visibleCards();
    if (!cards.length) return;
    idx = Math.max(0, Math.min(n, cards.length - 1));
    // Smooth scroll within the track
    const card = cards[idx];
    const trackLeft  = track.getBoundingClientRect().left;
    const cardLeft   = card.getBoundingClientRect().left;
    track.scrollBy({ left: cardLeft - trackLeft, behavior: 'smooth' });
    if (curEl) curEl.textContent = String(idx + 1).padStart(2, '0');
    if (totEl) totEl.textContent = String(cards.length).padStart(2, '0');
  }

  prevBtn.addEventListener('click', () => goTo(idx - 1));
  nextBtn.addEventListener('click', () => goTo(idx + 1));

  // Touch / drag support
  let startX = 0, dragging = false;
  track.addEventListener('pointerdown',  e => { startX = e.clientX; dragging = true; });
  track.addEventListener('pointerup',    e => {
    if (!dragging) return;
    dragging = false;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) goTo(diff < 0 ? idx + 1 : idx - 1);
  });
  track.addEventListener('pointerleave', () => { dragging = false; });

  // Init label
  const cards = visibleCards();
  if (totEl) totEl.textContent = String(cards.length).padStart(2, '0');

  /* Filter buttons */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      track.querySelectorAll('.project-card').forEach(card => {
        const cats = card.dataset.category || '';
        const show = f === 'all' || cats.split(' ').includes(f);
        card.classList.toggle('filtered-out', !show);
      });
      idx = 0;
      track.scrollTo({ left: 0, behavior: 'smooth' });
      const vis = visibleCards();
      if (curEl) curEl.textContent = '01';
      if (totEl) totEl.textContent = String(vis.length).padStart(2, '0');
    });
  });
})();


/* ══════════════════════════════════════════════════════════════
   8. PROJECT MODAL + EMBED SYSTEM

   How to add a project link:
   ─────────────────────────
   • Click "View Project" on any card.
   • The modal opens showing an input field.
   • Paste your embed URL:
       YouTube  → https://www.youtube.com/embed/VIDEO_ID
       Vimeo    → https://player.vimeo.com/video/VIDEO_ID
       Drive    → https://drive.google.com/file/d/FILE_ID/preview
       Any page → any URL that supports iframe embedding
   • Click "Load" → the video/page plays right inside the modal.
   • The URL is saved per-card (localStorage) so it persists.
══════════════════════════════════════════════════════════════ */

function openProject(card) {
  const url = card.dataset.embed;
  if (!url) return;

  if (url.includes('youtube.com/embed')) {
    const videoId = url.split('/embed/')[1]?.split('?')[0];
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  } else {
    // Instagram reels and anything else — open directly
    window.open(url, '_blank');
  }
}


/* ══════════════════════════════════════════════════════════════
   9. CONTACT FORM
══════════════════════════════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('form-note');
  const btn  = e.target.querySelector('.btn-submit');
  if (!note || !btn) return;

  btn.style.opacity = '0.55';
  btn.style.pointerEvents = 'none';
  note.textContent = 'Sending…';

  setTimeout(() => {
    note.textContent = '✓ Sent — I\'ll be in touch soon.';
    btn.style.opacity = '1';
    btn.style.pointerEvents = '';
    e.target.reset();
    setTimeout(() => { note.textContent = ''; }, 5000);
  }, 1500);
}


/* ══════════════════════════════════════════════════════════════
   10. SMOOTH ANCHOR SCROLLING (fallback)
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


async function fetchYtTitles() {
  const cards = document.querySelectorAll('.project-card[data-embed]');
  for (const card of cards) {
    const videoId = card.dataset.embed?.split('/embed/')[1]?.split('?')[0];
    if (!videoId) continue;
    try {
      const res  = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await res.json();
      // Set real title
      const titleEl = card.querySelector('.project-title');
      if (titleEl) titleEl.textContent = data.title;
      card.dataset.title = data.title;
      // Set real thumbnail
      const img = card.querySelector('.project-thumb img');
      if (img) img.src = data.thumbnail_url;
    } catch(e) {
      const titleEl = card.querySelector('.project-title');
      if (titleEl) titleEl.textContent = 'View Project';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchYtTitles(); // ← add this line
  loadYouTubeFeed(); // ← if this already exists, keep it
});

// Filter buttons + scroll to first card
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const track  = document.getElementById('projects-track');
    const cards  = track?.querySelectorAll('.project-card');
    if (!cards) return;

    // Show/hide cards
    cards.forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.split(' ').includes(filter)) {
        card.classList.remove('filtered-out');
      } else {
        card.classList.add('filtered-out');
      }
    });

    // Scroll back to first visible card
    const firstVisible = track.querySelector('.project-card:not(.filtered-out)');
    if (firstVisible) {
      firstVisible.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

  });
});