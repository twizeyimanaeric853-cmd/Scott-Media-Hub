/* ==========================================================================
   SCOTT MEDIA HUB — Main JS
   Handles: language switching, mobile nav toggle, ticker, and rendering
   video/blog cards from the shared data in js/data.js
   ========================================================================== */

// ---- Language switcher ----------------------------------------------------
// English is the default. French and Kinyarwanda are toggle options.
// Language choice persists across page navigation via sessionStorage,
// but always resets to English for a brand-new visitor/session.
(function setupLanguage() {
  if (typeof TRANSLATIONS === 'undefined') return;

  try {
    const saved = sessionStorage.getItem('smh_lang');
    if (saved && TRANSLATIONS[saved]) currentLang = saved;
  } catch (e) { /* sessionStorage unavailable, default to English */ }

  applyTranslations();
  buildLanguageSwitcher();
})();

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  try { sessionStorage.setItem('smh_lang', lang); } catch (e) {}
  applyTranslations();
  buildLanguageSwitcher();
  // Re-render dynamic content (cards) in case category labels changed
  document.dispatchEvent(new CustomEvent('languageChanged'));
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = translated;
    } else {
      el.textContent = translated;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
}

function buildLanguageSwitcher() {
  const container = document.getElementById('langSwitcher');
  if (!container) return;
  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'rw', label: 'RW' }
  ];
  container.innerHTML = langs.map(l => `
    <button type="button" data-lang="${l.code}"
      style="font-family:var(--font-body); font-weight:700; font-size:0.75rem;
             padding:6px 10px; border-radius:6px; border:1px solid var(--border);
             background:${currentLang === l.code ? 'var(--text)' : 'transparent'};
             color:${currentLang === l.code ? 'var(--bg)' : 'var(--text-muted)'};
             cursor:pointer; transition:all .15s ease;">
      ${l.label}
    </button>
  `).join('');
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
}

// ---- Mobile nav toggle --------------------------------------------------
(function setupNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.textContent = isOpen ? '✕' : '☰';
  });
  // Close the mobile menu whenever a nav link is tapped
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
})();

// ---- Ticker ---------------------------------------------------------------
(function setupTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track || typeof buildTickerHeadlines !== 'function') return;
  const headlines = buildTickerHeadlines();
  // Duplicate the list so the marquee loop is seamless
  const full = [...headlines, ...headlines];
  track.innerHTML = full.map(h => `<span lang="rw">${h}</span>`).join('');
})();

// ---- Card builders ----------------------------------------------------

// Maps category keys to their translation dictionary keys
const CATEGORY_T_KEYS = {
  comedy: 'cat_comedy',
  drama: 'cat_drama',
  music: 'cat_music',
  relationships: 'cat_relationships'
};

function catLabel(categoryKey) {
  return t(CATEGORY_T_KEYS[categoryKey]) || CATEGORY_LABELS[categoryKey].label;
}

function videoCardHTML(video) {
  const ytId = getYouTubeId(video.url);
  const cat = CATEGORY_LABELS[video.category];
  const thumbUrl = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '';
  return `
    <a href="${video.url}" target="_blank" rel="noopener" class="card">
      <div class="card-thumb">
        ${thumbUrl ? `<img src="${thumbUrl}" alt="${video.title}" loading="lazy">` : ''}
        <div class="play-badge-circle"><div class="play-circle"><div style="width:0;height:0;border-left:14px solid var(--bg);border-top:9px solid transparent;border-bottom:9px solid transparent;margin-left:3px;"></div></div></div>
      </div>
      <div class="card-body">
        <span class="tag ${cat.tagClass}">${cat.emoji} ${catLabel(video.category)}</span>
        <h3 lang="rw">${video.title}</h3>
        <p>${video.description}</p>
        <div class="card-meta">${t('watch_youtube')}</div>
      </div>
    </a>
  `;
}

function blogCardHTML(post) {
  const cat = CATEGORY_LABELS[post.category];
  return `
    <a href="blog.html#${post.id}" class="card">
      <div class="card-body" style="padding-top:18px;">
        <span class="tag ${cat.tagClass}">${cat.emoji} ${catLabel(post.category)}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        ${post.placeholder ? '<span class="placeholder-flag">✏ Placeholder — needs real content</span>' : ''}
        <div class="card-meta">${formatDate(post.date)}</div>
      </div>
    </a>
  `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ---- Render: Homepage ---------------------------------------------------
function renderHome() {
  const videoGrid = document.getElementById('homeVideoGrid');
  const blogGrid = document.getElementById('homeBlogGrid');
  if (videoGrid && typeof VIDEOS !== 'undefined') {
    const latest = [...VIDEOS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    videoGrid.innerHTML = latest.map(videoCardHTML).join('');
  }
  if (blogGrid && typeof BLOG_POSTS !== 'undefined') {
    const latest = [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    blogGrid.innerHTML = latest.map(blogCardHTML).join('');
  }
}
renderHome();

// ---- Render: Videos page -------------------------------------------------
let drawVideos = null;
(function renderVideosPage() {
  const grid = document.getElementById('allVideosGrid');
  if (!grid || typeof VIDEOS === 'undefined') return;

  let activeFilter = 'all';
  drawVideos = function() {
    const list = activeFilter === 'all' ? VIDEOS : VIDEOS.filter(v => v.category === activeFilter);
    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    grid.innerHTML = sorted.length
      ? sorted.map(videoCardHTML).join('')
      : `<p style="color:var(--text-muted);">Nothing here yet.</p>`;
  };

  drawVideos();

  const pills = document.querySelectorAll('.cat-pill[data-filter]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      drawVideos();
    });
  });
})();

// ---- Render: Blog page ----------------------------------------------------
let drawBlog = null;
(function renderBlogPage() {
  const grid = document.getElementById('allBlogGrid');
  if (!grid || typeof BLOG_POSTS === 'undefined') return;

  let activeFilter = 'all';
  drawBlog = function() {
    const list = activeFilter === 'all' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === activeFilter);
    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    grid.innerHTML = sorted.length
      ? sorted.map(blogCardHTML).join('')
      : `<p style="color:var(--text-muted);">Nothing here yet.</p>`;
  };

  drawBlog();

  const pills = document.querySelectorAll('.cat-pill[data-filter]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      drawBlog();
    });
  });
})();

// ---- Render: Categories page ----------------------------------------------
function renderCategoriesPage() {
  const container = document.getElementById('categorySections');
  if (!container || typeof VIDEOS === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const jumpTo = params.get('cat');

  const cats = Object.keys(CATEGORY_LABELS);
  container.innerHTML = cats.map(catKey => {
    const cat = CATEGORY_LABELS[catKey];
    const vids = VIDEOS.filter(v => v.category === catKey);
    const posts = BLOG_POSTS.filter(p => p.category === catKey);
    const items = [...vids.map(v => ({ ...v, _type: 'video' })), ...posts.map(p => ({ ...p, _type: 'post' }))]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return `
      <div class="section" id="cat-${catKey}" style="padding-top:0;">
        <div class="section-head">
          <h2>${cat.emoji} ${catLabel(catKey)}</h2>
        </div>
        <div class="grid">
          ${items.length
            ? items.map(item => item._type === 'video' ? videoCardHTML(item) : blogCardHTML(item)).join('')
            : `<p style="color:var(--text-muted);">Nothing here yet — check back soon.</p>`}
        </div>
      </div>
    `;
  }).join('<div style="border-top:1px solid var(--border); max-width:var(--max-width); margin:0 auto;"></div>');

  if (jumpTo && document.getElementById(`cat-${jumpTo}`)) {
    setTimeout(() => {
      document.getElementById(`cat-${jumpTo}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}
renderCategoriesPage();

// ---- Render: Social links bar ---------------------------------------------
const SOCIAL_ICONS = {
  whatsapp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.39 1.3-1.92 1.36-.49.06-1.1.08-1.78-.11-.41-.12-.93-.29-1.6-.57-2.82-1.22-4.66-4.06-4.8-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.17.01.41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.13-.28.27-.12.54.16.27.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.27.36-.23.6-.14.24.09 1.55.73 1.81.86.26.13.44.19.5.3.07.11.07.6-.17 1.28z"/></svg>',
  facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>',
  instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.55.2.95.45 1.37.86.41.42.66.82.86 1.37.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.2.55-.45.95-.86 1.37-.42.41-.82.66-1.37.86-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a3.7 3.7 0 0 1-1.37-.86 3.7 3.7 0 0 1-.86-1.37c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.2-.55.45-.95.86-1.37.42-.41.82-.66 1.37-.86.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.73.07-.97.04-1.5.21-1.85.35-.46.18-.79.39-1.14.74-.35.35-.56.68-.74 1.14-.14.35-.31.88-.35 1.85C3.13 8.5 3.12 8.85 3.12 12s.01 3.5.07 4.73c.04.97.21 1.5.35 1.85.18.46.39.79.74 1.14.35.35.68.56 1.14.74.35.14.88.31 1.85.35 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.97-.04 1.5-.21 1.85-.35.46-.18.79-.39 1.14-.74.35-.35.56-.68.74-1.14.14-.35.31-.88.35-1.85.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.97-.21-1.5-.35-1.85a3.06 3.06 0 0 0-.74-1.14 3.06 3.06 0 0 0-1.14-.74c-.35-.14-.88-.31-1.85-.35C15.5 4.01 15.15 4 12 4zm0 3.38a4.62 4.62 0 1 1 0 9.24 4.62 4.62 0 0 1 0-9.24zm0 1.8a2.82 2.82 0 1 0 0 5.64 2.82 2.82 0 0 0 0-5.64zm5.88-1.99a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z"/></svg>',
  tiktok: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82c-1-.87-1.6-2.14-1.6-3.55h-3.13v13.34c0 1.6-1.3 2.9-2.9 2.9a2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .58.04.85.13V9.6a6.05 6.05 0 0 0-.85-.06A6.04 6.04 0 0 0 3 15.58a6.04 6.04 0 0 0 6.04 6.04 6.04 6.04 0 0 0 6.04-6.04V9.01a8.55 8.55 0 0 0 4.96 1.58V7.46a5.18 5.18 0 0 1-3.44-1.64z"/></svg>',
  telegram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 4.27c.27-1.18-.95-2.13-2.03-1.69L2.45 9.62c-1.27.51-1.26 2.31.02 2.8l4.4 1.69 1.7 5.61c.27.9 1.4 1.18 2.05.5l2.43-2.51 4.34 3.27c.97.73 2.37.2 2.62-.99l3.93-15.72zM8.5 14.1l9.1-6.13c.27-.18.55.16.32.38l-7.5 7.04-.3 3.1-1.62-4.39z"/></svg>',
  youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12c0 1.95.16 3.9.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.49 20.5 12 20.5 12 20.5s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14c.34-1.9.5-3.86.5-5.81 0-1.95-.16-3.9-.5-5.81zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/></svg>'
};

function renderSocialBar(targetId, opts = {}) {
  const el = document.getElementById(targetId);
  if (!el || typeof SOCIAL_LINKS === 'undefined') return;
  const size = opts.size || 38;
  el.innerHTML = Object.keys(SOCIAL_LINKS).map(key => {
    const platform = SOCIAL_LINKS[key];
    if (!platform.url) return ''; // skip pending platforms (e.g. Telegram)
    return `
      <a href="${platform.url}" target="_blank" rel="noopener" aria-label="${platform.label}"
         style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;
                border-radius:50%;background:var(--bg-card);border:1px solid var(--border);
                color:var(--text-muted);transition:all .15s ease;"
         onmouseover="this.style.color='var(--accent-coral)';this.style.borderColor='var(--accent-coral)';"
         onmouseout="this.style.color='var(--text-muted)';this.style.borderColor='var(--border)';">
        ${SOCIAL_ICONS[key]}
      </a>`;
  }).join('');
}

// Auto-render any social bar placeholders found on the page
(function autoRenderSocialBars() {
  document.querySelectorAll('[data-social-bar]').forEach(el => {
    const size = el.dataset.socialBar ? parseInt(el.dataset.socialBar, 10) : 38;
    renderSocialBar(el.id, { size });
  });
})();

// ---- Re-render dynamic content when language changes ----------------------
document.addEventListener('languageChanged', () => {
  renderHome();
  renderCategoriesPage();
  if (typeof drawVideos === 'function') drawVideos();
  if (typeof drawBlog === 'function') drawBlog();
});

// ---- Render: Single blog post page (blog.html#id deep link expand) -------
(function expandLinkedPost() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  window.addEventListener('load', () => {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
