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

  var projectData = {
    'B 端设计系统': {
      video: '//player.bilibili.com/player.html?bvid=BV173E16MEhn&autoplay=0&danmaku=0',
      gallery: [
        '素材/作品图片/快手-组件库/2.png',
        '素材/作品图片/快手-组件库/3.png',
        '素材/作品图片/快手-组件库/4.png',
        '素材/作品图片/快手-组件库/5.png?v=2',
        '素材/作品图片/快手-组件库/6.png',
        '素材/作品图片/快手-组件库/7.png',
        '素材/作品图片/快手-组件库/8.png',
        '素材/作品图片/快手-组件库/9.png',
        '素材/作品图片/快手-组件库/10.png',
        '素材/作品图片/快手-组件库/11.png',
        '素材/作品图片/快手-组件库/12.png',
        '素材/作品图片/快手-组件库/13.png',
        '素材/作品图片/快手-组件库/14.png',
        '素材/作品图片/快手-组件库/15.png',
        '素材/作品图片/快手-组件库/16.png',
        '素材/作品图片/快手-组件库/17.png',
        '素材/作品图片/快手-组件库/18.png',
        '素材/作品图片/快手-组件库/19.png',
        { type: 'bilibili', bvid: 'BV1o3E16TE9d' },
        '素材/作品图片/快手-组件库/20.png',
        '素材/作品图片/快手-组件库/21.png',
      ],
      results: []
    },
    '为企业应用设计': {
      gallery: [
        '素材/作品图片/快手-为企业应用设计/2.png',
        '素材/作品图片/快手-为企业应用设计/3.png',
        '素材/作品图片/快手-为企业应用设计/4.png',
        '素材/作品图片/快手-为企业应用设计/5.png',
        '素材/作品图片/快手-为企业应用设计/6.png',
        '素材/作品图片/快手-为企业应用设计/7.png',
        '素材/作品图片/快手-为企业应用设计/8.png',
        '素材/作品图片/快手-为企业应用设计/9.png',
        '素材/作品图片/快手-为企业应用设计/10.png',
        '素材/作品图片/快手-为企业应用设计/11.png',
        '素材/作品图片/快手-为企业应用设计/12.png',
        '素材/作品图片/快手-为企业应用设计/13.png',
        '素材/作品图片/快手-为企业应用设计/14.png',
        '素材/作品图片/快手-为企业应用设计/15.png',
        '素材/作品图片/快手-为企业应用设计/16.png',
        '素材/作品图片/快手-为企业应用设计/17.png',
        '素材/作品图片/快手-为企业应用设计/18.png',
        '素材/作品图片/快手-为企业应用设计/19.png',
        '素材/作品图片/快手-为企业应用设计/20.png',
        '素材/作品图片/快手-为企业应用设计/21.png',
        '素材/作品图片/快手-为企业应用设计/22.png',
        '素材/作品图片/快手-为企业应用设计/23.png',
        '素材/作品图片/快手-为企业应用设计/24.png',
        '素材/作品图片/快手-为企业应用设计/25.png',
        '素材/作品图片/快手-为企业应用设计/26.png',
        '素材/作品图片/快手-为企业应用设计/27.gif',
        '素材/作品图片/快手-为企业应用设计/28.gif',
        '素材/作品图片/快手-为企业应用设计/29.png',
        '素材/作品图片/快手-为企业应用设计/30.png',
      ],
      results: []
    },
    'Enterprise-ui-skill': {
      gallery: [
        '素材/作品图片/快手-skill/2.png',
        '素材/作品图片/快手-skill/3.png',
        '素材/作品图片/快手-skill/4.png',
        '素材/作品图片/快手-skill/5.png',
        '素材/作品图片/快手-skill/6.png',
        '素材/作品图片/快手-skill/7.png',
        '素材/作品图片/快手-skill/8.png',
        '素材/作品图片/快手-skill/9.png',
        { type: 'text', content: '最终交付不是一张图，而是可运行、可修改、可交接的页面资产。' },
        { type: 'bilibili', bvid: 'BV1gDJn6tEVg' },
      ],
      results: []
    },
    '京东锦礼': {
      gallery: [
        '素材/作品图片/京东-锦礼/张天航作品集简历.006.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.007.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.008.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.009.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.010.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.011.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.012.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.013.jpeg',
        '素材/作品图片/京东-锦礼/张天航作品集简历.014.jpeg',
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
        '素材/作品图片/京东-慧采/张天航作品集简历.040.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.041.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.042.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.043.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.044.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.045.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.046.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.047.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.048.jpeg',
        '素材/作品图片/京东-慧采/张天航作品集简历.049.jpeg',
      ],
      results: []
    },
    '押宝 H5': {
      gallery: [
        '素材/作品图片/京东-押宝小游戏/张天航作品集简历.052.jpeg',
        '素材/作品图片/京东-押宝小游戏/张天航作品集简历.053.jpeg',
        '素材/作品图片/京东-押宝小游戏/张天航作品集简历.054.jpeg',
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
        '素材/作品图片/京东-京麦/张天航作品集简历.017.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.018.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.019.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.020.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.021.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.022.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.023.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.024.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.025.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.026.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.027.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.028.jpeg',
        '素材/作品图片/京东-京麦/张天航作品集简历.029.jpeg',
        '素材/作品图片/京东-京麦/总.gif',
      ],
      results: []
    },
    '招聘系统重构': {
      gallery: [
        '素材/作品图片/快手-招聘/2.png',
        '素材/作品图片/快手-招聘/3.png',
        '素材/作品图片/快手-招聘/4.png',
        '素材/作品图片/快手-招聘/5.png',
        '素材/作品图片/快手-招聘/6.png',
        '素材/作品图片/快手-招聘/7.png',
        '素材/作品图片/快手-招聘/8.png',
        '素材/作品图片/快手-招聘/9.png',
        '素材/作品图片/快手-招聘/10.png',
        '素材/作品图片/快手-招聘/11.png',
        '素材/作品图片/快手-招聘/12.png',
        '素材/作品图片/快手-招聘/13.gif',
        '素材/作品图片/快手-招聘/14.png',
        '素材/作品图片/快手-招聘/15.gif',
        '素材/作品图片/快手-招聘/16.png',
        '素材/作品图片/快手-招聘/17.gif',
        '素材/作品图片/快手-招聘/18.png',
        '素材/作品图片/快手-招聘/19.png',
      ],
      results: []
    },
    '万相视觉升级': {
      gallery: [
        '素材/作品图片/快手-万相/2.png',
        '素材/作品图片/快手-万相/3.png',
        '素材/作品图片/快手-万相/4.png',
        '素材/作品图片/快手-万相/5.png',
        '素材/作品图片/快手-万相/6.gif',
        '素材/作品图片/快手-万相/7.gif',
        '素材/作品图片/快手-万相/8.gif',
        '素材/作品图片/快手-万相/9.png',
        '素材/作品图片/快手-万相/10.png',
        '素材/作品图片/快手-万相/11.png',
        '素材/作品图片/快手-万相/12.png',
        '素材/作品图片/快手-万相/13.png',
        '素材/作品图片/快手-万相/14.png',
        '素材/作品图片/快手-万相/15.png',
      ],
      results: []
    },
    '调薪&奖金系统': {
      gallery: [
        '素材/作品图片/快手-大戏/2.png',
        '素材/作品图片/快手-大戏/3.png',
        '素材/作品图片/快手-大戏/4.png',
        '素材/作品图片/快手-大戏/5.png',
        '素材/作品图片/快手-大戏/6.png',
        '素材/作品图片/快手-大戏/7.png',
        '素材/作品图片/快手-大戏/8.png',
        '素材/作品图片/快手-大戏/9.png',
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
    var videoSrc  = document.getElementById('lightboxVideoSrc');
    if (videoWrap && videoEl) {
      var pInfo0 = projectData[data.title] || {};
      if (pInfo0.video) {
        videoEl.src = pInfo0.video;
        videoWrap.style.display = 'block';
      } else {
        videoEl.src = '';
        videoWrap.style.display = 'none';
      }
    }

    if (galleryEl) {
      var pInfo = projectData[data.title] || {};
      var imgs = pInfo.gallery || [];
      galleryEl.innerHTML = imgs.map(function(item) {
        if (typeof item === 'string') {
          return '<div class="lightbox-gallery-item"><img src="' + item + '" alt="" loading="lazy"/></div>';
        }
        if (item && item.type === 'text') {
          return '<div class="lightbox-gallery-item lightbox-gallery-text"><p>' + item.content + '</p></div>';
        }
        if (item && item.type === 'bilibili') {
          return '<div class="lightbox-gallery-item"><iframe src="//player.bilibili.com/player.html?bvid=' + item.bvid + '&autoplay=0&danmaku=0" frameborder="0" allowfullscreen scrolling="no" style="width:100%;aspect-ratio:16/9;"></iframe></div>';
        }
        if (item && item.type === 'video') {
          return '<div class="lightbox-gallery-item"><video controls playsinline preload="metadata"><source src="' + item.src + '"></video></div>';
        }
        return '';
      }).join('');
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
  }

  var panels = document.querySelectorAll('[data-lightbox]');
  panels.forEach(function(panel, idx) {
    panel.style.cursor = 'pointer';
    panel.addEventListener('mousedown', function(e) {
      e.stopPropagation();
      currentIndex = idx;
      openLightbox(allPanels[idx]);
    });
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
