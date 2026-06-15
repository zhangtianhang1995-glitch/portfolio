/* ============================================
   NANN PORTFOLIO - Main JavaScript
   ============================================ */

// ─── Loading Screen ───────────────────────────────────────────

const loadingScreen = document.getElementById('loading-screen');
const loaderBar = document.getElementById('loaderBar');

window.addEventListener('DOMContentLoaded', () => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 700);
      }, 150);
    }
    loaderBar.style.width = progress + '%';
  }, 100);
});

window.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.querySelector('.global-bg-video');
  if (!bgVideo || window.matchMedia('(max-width: 768px)').matches) return;

  window.setTimeout(() => {
    bgVideo.querySelectorAll('source[data-src]').forEach(source => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    bgVideo.load();
    bgVideo.play().catch(() => {});
  }, 1200);
});

// ─── Custom Cursor ────────────────────────────────────────────

const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let cx = -100, cy = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
});

(function animRing() {
  rx += (cx - rx) * 0.14;
  ry += (cy - ry) * 0.14;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .project-item, .creation-item, .about-card, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.borderColor = 'rgba(59,130,246,0.55)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '34px';
    cursorRing.style.height = '34px';
    cursorRing.style.borderColor = 'rgba(255,255,255,0.3)';
  });
});

// ─── Global Mouse Glow ───────────────────────────────────────

const globalGlow = document.getElementById('globalGlow');
let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
let glowX = gx, glowY = gy;

document.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; });

(function animGlow() {
  glowX += (gx - glowX) * 0.07;
  glowY += (gy - glowY) * 0.07;
  if (globalGlow) {
    globalGlow.style.left = glowX + 'px';
    globalGlow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(animGlow);
})();

// ─── Navigation ───────────────────────────────────────────────

const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const menuBtn  = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 60);

  // Update active nav link based on scroll position
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}, { passive: true });

menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const spans = menuBtn.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = menuBtn.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── Smooth anchor scroll ─────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Hero bg parallax removed — background is fixed position

// ─── About cards drag scroll ──────────────────────────────────

const cardsEl = document.getElementById('aboutCards');
if (cardsEl) {
  let isDown = false, startX = 0, sl = 0;

  cardsEl.addEventListener('mousedown', e => {
    isDown = true;
    cardsEl.classList.add('dragging');
    startX = e.pageX - cardsEl.offsetLeft;
    sl = cardsEl.scrollLeft;
  });

  ['mouseleave', 'mouseup'].forEach(ev =>
    cardsEl.addEventListener(ev, () => { isDown = false; cardsEl.classList.remove('dragging'); })
  );

  cardsEl.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - cardsEl.offsetLeft;
    cardsEl.scrollLeft = sl - (x - startX) * 1.4;
  });

  let tStartX = 0, tSl = 0;
  cardsEl.addEventListener('touchstart', e => { tStartX = e.touches[0].pageX; tSl = cardsEl.scrollLeft; }, { passive: true });
  cardsEl.addEventListener('touchmove', e => { cardsEl.scrollLeft = tSl + (tStartX - e.touches[0].pageX); }, { passive: true });
}

// ─── Project hover (JS-controlled, reliable) ─────────────────────────────────
document.querySelectorAll('.project-item').forEach(item => {
  const expand = item.querySelector('.project-expand');
  if (!expand) return;

  let leaveTimer = null;

  function showExpand() {
    clearTimeout(leaveTimer);
    item.classList.add('js-hover');
  }

  function hideExpand() {
    leaveTimer = setTimeout(() => {
      item.classList.remove('js-hover');
    }, 80); // small delay so moving from header to image doesn't collapse
  }

  item.addEventListener('mouseenter', showExpand);
  item.addEventListener('mouseleave', hideExpand);

  // When mouse enters the expand panel itself, keep open
  expand.addEventListener('mouseenter', showExpand);
  expand.addEventListener('mouseleave', hideExpand);
});

// ─── Scroll-triggered reveal ──────────────────────────────────

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

// Add reveal classes and observe
[
  ['.section-header', 0],
  ['.about-card', true],
  ['.about-bio', 0],
  ['.project-item', true],
  ['.creation-item', true],
  ['.contact-top-row', 0],
  ['.contact-headline', 0],
].forEach(([sel, stagger]) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (stagger) el.classList.add(`reveal-d${Math.min(i + 1, 4)}`);
    observer.observe(el);
  });
});

// ─── About card cursor glow (removed — white cards don't need glow) ───

// ─── CONNECT headline gradient animation ─────────────────────

const headlineConnect = document.querySelector('.headline-connect');
if (headlineConnect) {
  let angle = 0;
  setInterval(() => {
    angle = (angle + 0.4) % 360;
    headlineConnect.style.backgroundImage = `
      linear-gradient(${angle}deg,
        rgb(96,165,250) 0%,
        rgb(192,132,252) 45%,
        rgb(103,232,249) 100%
      )
    `;
  }, 32);
}

// ─── Creation items hover color overlay ───────────────────────

document.querySelectorAll('.creation-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.boxShadow = '';
  });
});

// ─── Creations lightbox (reuses same lightbox) ────────────────

document.querySelectorAll('[data-creation]').forEach(function(item) {
  item.addEventListener('mousedown', function(e) {
    e.stopPropagation();
    document.dispatchEvent(new CustomEvent('openLightbox', {
      detail: {
        img:   item.dataset.img   || '',
        title: item.dataset.title || '',
        tag:   item.dataset.tag   || '',
        desc:  item.dataset.desc  || '',
      }
    }));
  });
});

// ─── Project Lightbox ─────────────────────────────────────────
function initLightbox() {
  var lightbox  = document.getElementById('projectLightbox');
  var backdrop  = document.getElementById('lightboxBackdrop');
  var closeBtn  = document.getElementById('lightboxClose');
  var heroImg   = document.getElementById('lightboxImg');
  var imgBg     = document.getElementById('lightboxImgBg');
  var titleEl   = document.getElementById('lightboxTitle');
  var tagEl     = document.getElementById('lightboxTag');
  var descEl    = document.getElementById('lightboxDesc');
  var galleryEl = document.getElementById('lightboxGallery');
  var resultsEl = document.getElementById('lightboxResults');
  var prevBtn   = document.getElementById('lightboxPrev');
  var nextBtn   = document.getElementById('lightboxNext');
  var dotsEl    = document.getElementById('lightboxDots');

  if (!lightbox) { return; }

  // Collect all openable panels in order
  var allPanels = [];
  document.querySelectorAll('[data-lightbox]').forEach(function(p) {
    allPanels.push({ img: p.dataset.img||'', title: p.dataset.title||'', tag: p.dataset.tag||'', desc: p.dataset.desc||'' });
  });
  var currentIndex = 0;
  var galleryObserver = null;
  var lastOpenAt = 0;
  var lastOpenIndex = -1;

  function closeGalleryObserver() {
    if (galleryObserver) {
      galleryObserver.disconnect();
      galleryObserver = null;
    }
  }

  function hideSkeleton(media) {
    var s = media && media.previousElementSibling;
    if (s && s.classList.contains('skeleton-placeholder')) {
      s.classList.add('hidden');
    }
  }

  function loadDeferredGalleryMedia(root) {
    if (!root) return;

    var loadMedia = function(media) {
      if (!media || media.dataset.galleryLoaded) return;
      media.dataset.galleryLoaded = 'true';

      if (media.tagName === 'IFRAME') {
        media.src = media.dataset.gallerySrc;
        return;
      }

      if (media.tagName === 'VIDEO') {
        var source = media.querySelector('source[data-gallery-src]');
        if (source) {
          source.src = source.dataset.gallerySrc;
          source.removeAttribute('data-gallery-src');
          media.load();
        }
        return;
      }

      media.src = media.dataset.gallerySrc;
    };

    root.querySelectorAll('[data-gallery-src]').forEach(function(media) {
      if (media.dataset.galleryPriority === 'eager') {
        loadMedia(media);
        return;
      }

      if ('IntersectionObserver' in window) {
        if (!galleryObserver) {
          galleryObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                loadMedia(entry.target);
                galleryObserver.unobserve(entry.target);
              }
            });
          }, { root: galleryEl, rootMargin: '600px 0px' });
        }
        galleryObserver.observe(media);
      } else {
        loadMedia(media);
      }
    });
  }

  var projectData = {
    'B 端设计系统': {
      video: 'https://player.bilibili.com/player.html?bvid=BV173E16MEhn&autoplay=0&danmaku=0',
      gallery: [
        '素材/作品图片/快手-组件库/2.webp',
        '素材/作品图片/快手-组件库/3.webp',
        '素材/作品图片/快手-组件库/4.webp',
        '素材/作品图片/快手-组件库/5.webp?v=2',
        '素材/作品图片/快手-组件库/6.webp',
        '素材/作品图片/快手-组件库/7.webp',
        '素材/作品图片/快手-组件库/8.webp',
        '素材/作品图片/快手-组件库/9.webp',
        '素材/作品图片/快手-组件库/10.webp',
        '素材/作品图片/快手-组件库/11.webp',
        '素材/作品图片/快手-组件库/12.webp',
        '素材/作品图片/快手-组件库/13.webp',
        '素材/作品图片/快手-组件库/14.webp',
        '素材/作品图片/快手-组件库/15.webp',
        '素材/作品图片/快手-组件库/16.webp',
        '素材/作品图片/快手-组件库/17.webp',
        '素材/作品图片/快手-组件库/18.webp',
        '素材/作品图片/快手-组件库/19.webp',
        { type: 'bilibili', bvid: 'BV1o3E16TE9d' },
        '素材/作品图片/快手-组件库/20.gif',
        '素材/作品图片/快手-组件库/21.webp',
      ],
      results: []
    },
    '为企业应用设计': {
      gallery: [
        '素材/作品图片/快手-为企业应用设计/2.webp',
        '素材/作品图片/快手-为企业应用设计/3.webp',
        '素材/作品图片/快手-为企业应用设计/4.webp',
        '素材/作品图片/快手-为企业应用设计/5.webp',
        '素材/作品图片/快手-为企业应用设计/6.webp',
        '素材/作品图片/快手-为企业应用设计/7.webp',
        '素材/作品图片/快手-为企业应用设计/8.webp',
        '素材/作品图片/快手-为企业应用设计/9.webp',
        '素材/作品图片/快手-为企业应用设计/10.webp',
        '素材/作品图片/快手-为企业应用设计/11.webp',
        '素材/作品图片/快手-为企业应用设计/12.webp',
        '素材/作品图片/快手-为企业应用设计/13.webp',
        '素材/作品图片/快手-为企业应用设计/14.webp',
        '素材/作品图片/快手-为企业应用设计/15.webp',
        '素材/作品图片/快手-为企业应用设计/16.webp',
        '素材/作品图片/快手-为企业应用设计/17.webp',
        '素材/作品图片/快手-为企业应用设计/18.webp',
        '素材/作品图片/快手-为企业应用设计/19.webp',
        '素材/作品图片/快手-为企业应用设计/20.webp',
        '素材/作品图片/快手-为企业应用设计/21.webp',
        '素材/作品图片/快手-为企业应用设计/22.webp',
        '素材/作品图片/快手-为企业应用设计/23.webp',
        '素材/作品图片/快手-为企业应用设计/24.webp',
        '素材/作品图片/快手-为企业应用设计/25.webp',
        '素材/作品图片/快手-为企业应用设计/26.webp',
        '素材/作品图片/快手-为企业应用设计/27.gif',
        '素材/作品图片/快手-为企业应用设计/28.gif',
        '素材/作品图片/快手-为企业应用设计/29.webp',
        '素材/作品图片/快手-为企业应用设计/30.webp',
      ],
      results: []
    },
    'Enterprise-ui-skill': {
      gallery: [
        '素材/作品图片/快手-skill/2.webp',
        '素材/作品图片/快手-skill/3.webp',
        '素材/作品图片/快手-skill/4.webp',
        '素材/作品图片/快手-skill/5.webp',
        '素材/作品图片/快手-skill/6.webp',
        '素材/作品图片/快手-skill/7.webp',
        '素材/作品图片/快手-skill/8.webp',
        { type: 'text', content: '最终交付不是一张图，而是可运行、可修改、可交接的页面资产。' },
        { type: 'bilibili', bvid: 'BV1gDJn6tEVg' },
        '素材/作品图片/快手-skill/9.webp',
      ],
      results: []
    },
    '京东锦礼': {
      gallery: [
        '素材/作品图片/京东-锦礼/张天航作品集简历.006.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.007.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.008.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.009.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.010.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.011.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.012.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.013.webp',
        '素材/作品图片/京东-锦礼/张天航作品集简历.014.webp',
        '素材/作品图片/京东-锦礼/福礼.gif',
      ],
      results: [
        { num: '50+', label: '渲染作品' },
        { num: '3',   label: '获奖项目' },
        { num: '2 yr', label: '探索历程' },
      ]
    },
    '京东慧采': {
      gallery: [
        '素材/作品图片/京东-慧采/张天航作品集简历.040.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.041.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.042.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.043.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.044.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.045.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.046.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.047.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.048.webp',
        '素材/作品图片/京东-慧采/张天航作品集简历.049.webp',
      ],
      results: []
    },
    '押宝 H5': {
      gallery: [
        '素材/作品图片/京东-押宝小游戏/张天航作品集简历.052.webp',
        '素材/作品图片/京东-押宝小游戏/张天航作品集简历.053.webp',
        '素材/作品图片/京东-押宝小游戏/张天航作品集简历.054.webp',
      ],
      results: []
    },
    '京东春节礼包': {
      gallery: [
        '素材/作品图片/京东-春节礼包/2.webp',
        '素材/作品图片/京东-春节礼包/3.webp',
        '素材/作品图片/京东-春节礼包/4.webp',
        '素材/作品图片/京东-春节礼包/5.webp',
        '素材/作品图片/京东-春节礼包/6.webp',
        '素材/作品图片/京东-春节礼包/7.webp',
        '素材/作品图片/京东-春节礼包/8.webp',
      ],
      results: []
    },
    '京麦': {
      gallery: [
        '素材/作品图片/京东-京麦/张天航作品集简历.017.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.018.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.019.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.020.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.021.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.022.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.023.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.024.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.025.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.026.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.027.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.028.webp',
        '素材/作品图片/京东-京麦/张天航作品集简历.029.webp',
        '素材/作品图片/京东-京麦/总.gif',
      ],
      results: []
    },
    '招聘系统重构': {
      gallery: [
        '素材/作品图片/快手-招聘/2.webp',
        '素材/作品图片/快手-招聘/3.webp',
        '素材/作品图片/快手-招聘/4.webp',
        '素材/作品图片/快手-招聘/5.webp',
        '素材/作品图片/快手-招聘/6.webp',
        '素材/作品图片/快手-招聘/7.webp',
        '素材/作品图片/快手-招聘/8.webp',
        '素材/作品图片/快手-招聘/9.webp',
        '素材/作品图片/快手-招聘/10.webp',
        '素材/作品图片/快手-招聘/11.webp',
        '素材/作品图片/快手-招聘/12.webp',
        '素材/作品图片/快手-招聘/13.gif',
        '素材/作品图片/快手-招聘/14.webp',
        '素材/作品图片/快手-招聘/15.gif',
        '素材/作品图片/快手-招聘/16.webp',
        '素材/作品图片/快手-招聘/17.gif',
        '素材/作品图片/快手-招聘/18.webp',
        '素材/作品图片/快手-招聘/19.webp',
      ],
      results: []
    },
    '员工转正': {
      gallery: [
        '素材/作品图片/快手-转正/2.webp',
        '素材/作品图片/快手-转正/3.webp',
        '素材/作品图片/快手-转正/4.webp',
        '素材/作品图片/快手-转正/5.webp',
        '素材/作品图片/快手-转正/6.webp',
        '素材/作品图片/快手-转正/7.webp',
        '素材/作品图片/快手-转正/8.webp',
      ],
      results: []
    },
    '万相视觉升级': {
      gallery: [
        '素材/作品图片/快手-万相/2.webp',
        '素材/作品图片/快手-万相/3.webp',
        '素材/作品图片/快手-万相/4.webp',
        '素材/作品图片/快手-万相/5.webp',
        '素材/作品图片/快手-万相/6.gif',
        '素材/作品图片/快手-万相/7.gif',
        '素材/作品图片/快手-万相/8.gif',
        '素材/作品图片/快手-万相/9.webp',
        '素材/作品图片/快手-万相/10.webp',
        '素材/作品图片/快手-万相/11.webp',
        '素材/作品图片/快手-万相/12.webp',
        '素材/作品图片/快手-万相/13.webp',
        '素材/作品图片/快手-万相/14.webp',
        '素材/作品图片/快手-万相/15.webp',
      ],
      results: []
    },
    '调薪&奖金系统': {
      gallery: [
        '素材/作品图片/快手-大戏/2.webp',
        '素材/作品图片/快手-大戏/3.webp',
        '素材/作品图片/快手-大戏/4.webp',
        '素材/作品图片/快手-大戏/5.webp',
        '素材/作品图片/快手-大戏/6.webp',
        '素材/作品图片/快手-大戏/7.webp',
        '素材/作品图片/快手-大戏/8.webp',
        '素材/作品图片/快手-大戏/9.webp',
      ],
      results: []
    },
  };

  function openLightbox(data) {
    console.log('[Lightbox] opening:', data.title);
    if (titleEl) titleEl.textContent = data.title || '';
    if (tagEl)   tagEl.textContent   = data.tag   || '';
    if (descEl)  descEl.textContent  = data.desc  || '';

    if (heroImg) {
      if (!data.img) {
        heroImg.style.display = 'none';
      } else {
        heroImg.src = data.img;
        heroImg.style.display = 'block';
      }
    }
    if (imgBg) {
      imgBg.className = data.img ? 'lightbox-img-bg' : 'lightbox-img-bg aigc';
    }

    // Video
    var videoWrap = document.getElementById('lightboxVideoWrap');
    var videoEl   = document.getElementById('lightboxVideo');
    if (videoWrap && videoEl) {
      var pInfo0 = projectData[data.title] || {};
      if (pInfo0.video) {
        videoEl.src = '';
        videoEl.dataset.src = pInfo0.video;
        videoEl.loading = 'lazy';
        videoWrap.style.display = 'block';
        window.setTimeout(function() {
          if (lightbox.classList.contains('open') && videoEl.dataset.src === pInfo0.video) {
            videoEl.src = videoEl.dataset.src;
          }
        }, 700);
      } else {
        videoEl.src = '';
        videoEl.removeAttribute('data-src');
        videoWrap.style.display = 'none';
      }
    }

    if (galleryEl) {
      closeGalleryObserver();
      var pInfo = projectData[data.title] || {};
      var imgs = pInfo.gallery || [];
      galleryEl.innerHTML = imgs.map(function(item, index) {
        var priority = index < 2 ? 'eager' : 'lazy';
        if (typeof item === 'string') {
          return '<div class="lightbox-gallery-item"><div class="skeleton-placeholder"></div><img data-gallery-src="' + item + '" data-gallery-priority="' + priority + '" alt="" loading="' + priority + '" decoding="async"/></div>';
        }
        if (item && item.type === 'text') {
          return '<div class="lightbox-gallery-item lightbox-gallery-text"><p>' + item.content + '</p></div>';
        }
        if (item && item.type === 'bilibili') {
          return '<div class="lightbox-gallery-item lightbox-video-placeholder" data-bvid="' + item.bvid + '"><button type="button" class="lightbox-video-load">播放视频</button></div>';
        }
        if (item && item.type === 'video') {
          return '<div class="lightbox-gallery-item"><div class="skeleton-placeholder"></div><video controls playsinline preload="none" data-gallery-src="' + item.src + '" data-gallery-priority="' + priority + '"><source data-gallery-src="' + item.src + '"></video></div>';
        }
        return '';
      }).join('');

      galleryEl.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('load', function() { hideSkeleton(img); });
      });
      galleryEl.querySelectorAll('video').forEach(function(video) {
        video.addEventListener('loadedmetadata', function() { hideSkeleton(video); });
        video.addEventListener('play', function() {
          var source = video.querySelector('source[data-gallery-src]');
          if (source) {
            source.src = source.dataset.gallerySrc;
            source.removeAttribute('data-gallery-src');
            video.load();
            video.play().catch(function() {});
          }
        }, { once: true });
      });
      galleryEl.querySelectorAll('.lightbox-video-placeholder').forEach(function(item) {
        item.addEventListener('click', function() {
          var bvid = item.dataset.bvid;
          if (!bvid) return;
          item.innerHTML = '<iframe src="https://player.bilibili.com/player.html?bvid=' + bvid + '&autoplay=0&danmaku=0" frameborder="0" allowfullscreen scrolling="no" loading="lazy" style="width:100%;aspect-ratio:16/9;"></iframe>';
        });
      });
      loadDeferredGalleryMedia(galleryEl);
    }

    if (resultsEl) {
      var pInfo2 = projectData[data.title] || {};
      var res = pInfo2.results || [];
      resultsEl.innerHTML = res.map(function(r) {
        return '<div class="lightbox-result-card"><span class="lightbox-result-num">' + r.num + '</span><span class="lightbox-result-label">' + r.label + '</span></div>';
      }).join('');
    }

    // Nav dots & buttons
    if (dotsEl) {
      dotsEl.innerHTML = allPanels.map(function(_, i) {
        return '<span class="nav-dot' + (i === currentIndex ? ' active' : '') + '" data-idx="' + i + '"></span>';
      }).join('');
      dotsEl.querySelectorAll('.nav-dot').forEach(function(dot) {
        dot.addEventListener('click', function() {
          var idx = parseInt(dot.dataset.idx);
          currentIndex = idx;
          openLightbox(allPanels[idx]);
        });
      });
    }
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === allPanels.length - 1;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    var panel = lightbox.querySelector('.lightbox-panel');
    if (panel) panel.scrollTop = 0;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // stop iframe video by clearing src
    var videoEl = document.getElementById('lightboxVideo');
    if (videoEl) videoEl.src = '';
    closeGalleryObserver();
  }

  var panels = document.querySelectorAll('[data-lightbox]');
  panels.forEach(function(panel, idx) {
    var openPanel = function(e) {
      var now = Date.now();
      if (lightbox.classList.contains('open') && lastOpenIndex === idx && now - lastOpenAt < 250) {
        if (e) e.stopPropagation();
        return;
      }
      if (e) e.stopPropagation();
      lastOpenAt = now;
      lastOpenIndex = idx;
      currentIndex = idx;
      openLightbox(allPanels[idx]);
    };

    panel.style.cursor = 'pointer';
    panel.addEventListener('mousedown', openPanel);
    panel.addEventListener('click', openPanel);
  });

  if (prevBtn) prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) { currentIndex--; openLightbox(allPanels[currentIndex]); }
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    if (currentIndex < allPanels.length - 1) { currentIndex++; openLightbox(allPanels[currentIndex]); }
  });

  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight' && lightbox.classList.contains('open')) {
      if (currentIndex < allPanels.length - 1) { currentIndex++; openLightbox(allPanels[currentIndex]); }
    }
    if (e.key === 'ArrowLeft' && lightbox.classList.contains('open')) {
      if (currentIndex > 0) { currentIndex--; openLightbox(allPanels[currentIndex]); }
    }
  });

  // Listen for creations lightbox event
  document.addEventListener('openLightbox', function(e) {
    openLightbox(e.detail);
  });
}

// Init on DOMContentLoaded (or immediately if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}

// ─── Page load fade ───────────────────────────────────────────

window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

// ─── Creation Tabs filter ─────────────────────────────────────
(function() {
  function initTabs() {
    const tabs = document.querySelectorAll('.creation-tab');
    const items = document.querySelectorAll('.creation-item[data-creation]');
    if (!tabs.length) return;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        // update active state
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var filter = tab.getAttribute('data-filter');
        items.forEach(function(item) {
          var group = item.getAttribute('data-group') || 'all';
          if (filter === 'all' || group === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabs);
  } else {
    initTabs();
  }
})();

// ===== CONTACT MODAL =====
document.addEventListener('DOMContentLoaded', function() {
  var btn   = document.getElementById('contactModalBtn');
  var modal = document.getElementById('contactModal');
  var close = document.getElementById('contactModalClose');
  if (!btn || !modal) return;
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.add('active');
  });
  close.addEventListener('click', function() {
    modal.classList.remove('active');
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') modal.classList.remove('active');
  });
});
