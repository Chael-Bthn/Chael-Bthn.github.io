// ===== DARK MODE TOGGLE =====
const toggle = document.getElementById('darkToggle');
const body = document.body;

// Load saved preference
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  if (toggle) toggle.checked = true;
}

if (toggle) {
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updateProfilePhoto(true);
      updateLogo(true);
    } else {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updateProfilePhoto(false);
      updateLogo(false);
    }
  });
}

// ===== LOGO SWAP =====
const navLogo = document.getElementById('navLogo');

function updateLogo(isDark) {
  if (!navLogo) return;
  navLogo.src = isDark
    ? 'assets/images/LOGO_DARK.png'
    : 'assets/images/LOGO_LIGHT.png';
}

// Init correct logo on load
updateLogo(body.classList.contains('dark'));

// ===== PROFILE PHOTO HOVER & DARK MODE =====
const profileImg = document.getElementById('profilePhoto');

function updateProfilePhoto(isDark) {
  if (!profileImg) return;
  if (isDark) {
    profileImg.src = 'assets/images/profile_dark.png';
  } else {
    profileImg.src = 'assets/images/profile.png';
  }
}

if (profileImg) {
  profileImg.addEventListener('mouseenter', () => {
    const isDark = body.classList.contains('dark');
    profileImg.src = isDark
      ? 'assets/images/profile_dark_hover.png'
      : 'assets/images/profile_hover.png';
  });

  profileImg.addEventListener('mouseleave', () => {
    const isDark = body.classList.contains('dark');
    updateProfilePhoto(isDark);
  });

  // Init correct photo on load
  updateProfilePhoto(body.classList.contains('dark'));
}

// ===== SCROLL ANIMATIONS (FADE-IN & REVEAL-UP) =====
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in, .reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60 * delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => observer.observe(el));
}

// ===== LIGHTBOX =====
function initLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  if (!overlay) return;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const src = el.dataset.lightbox;
      lightboxImg.src = src;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 200);
  }

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ===== ACTIVE NAV LINK =====
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActive(id) {
    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active-nav');
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));

  // Fallback: highlight last section when scrolled to bottom of page
  window.addEventListener('scroll', () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60;
    if (nearBottom) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) setActive(lastSection.id);
    }
  }, { passive: true });
}

// ===== DYNAMIC SPOTLIGHT EFFECT =====
function initSpotlight() {
  const cards = document.querySelectorAll('.card-custom, .project-card, .cert-card, .bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  function updateProgress() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const scrollPercent = (window.scrollY / totalScroll) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

// ===== BACKGROUND BLOBS PARALLAX =====
function initParallaxBlobs() {
  const blob1 = document.getElementById('blob1');
  const blob2 = document.getElementById('blob2');
  const blob3 = document.getElementById('blob3');

  let ticking = false;

  function updateBlobPositions() {
    const scrollY = window.scrollY;

    // Apply scroll ratios (moving at different speeds relative to scroll)
    if (blob1) blob1.style.setProperty('--parallax-y', `${scrollY * 0.18}px`);
    if (blob2) blob2.style.setProperty('--parallax-y', `${scrollY * -0.12}px`);
    if (blob3) blob3.style.setProperty('--parallax-y', `${scrollY * 0.08}px`);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateBlobPositions);
      ticking = true;
    }
  }, { passive: true });
}

// ===== MAGNETIC HOVER ATTRACTION =====
function initMagneticElements() {
  // Only apply magnetic interactions on screens that support hover (non-touch)
  if (window.matchMedia('(hover: hover)').matches) {
    const elements = document.querySelectorAll('.magnetic');

    elements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        // Attract toward mouse (pulling 30% of distance)
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
}

// ===== HERO ENTRANCE STAGGERED SEQUENCE =====
function initHeroEntrance() {
  const heroWrapper = document.querySelector('.hero-wrapper');
  const profileCard = document.getElementById('profile3dCard');
  const heroTitle = document.querySelector('.hero-main-title');
  const heroTyped = document.querySelector('.hero-typed-container');
  const summary = document.querySelector('.hero-summary');
  const badges = document.querySelectorAll('.hero-badges .badge-pill');
  const ctaButtons = document.querySelectorAll('.hero-cta-buttons .magnetic');

  const itemsToAnimate = [
    { el: profileCard, transformFrom: 'scale(0.85) rotateX(10deg) rotateY(-10deg)', transformTo: 'scale(1) rotateX(0) rotateY(0)', delay: 100 },
    { el: heroTitle, transformFrom: 'translateY(24px)', transformTo: 'translateY(0)', delay: 200 },
    { el: heroTyped, transformFrom: 'translateY(16px)', transformTo: 'translateY(0)', delay: 320 },
    { el: summary, transformFrom: 'translateY(16px)', transformTo: 'translateY(0)', delay: 380 }
  ];

  itemsToAnimate.forEach(item => {
    if (item.el) {
      item.el.style.opacity = '0';
      item.el.style.transform = item.transformFrom;
      item.el.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  });

  ctaButtons.forEach((btn) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(12px)';
    btn.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  badges.forEach((badge) => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(12px)';
    badge.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  setTimeout(() => {
    if (heroWrapper) heroWrapper.style.opacity = '1';

    itemsToAnimate.forEach(item => {
      if (item.el) {
        setTimeout(() => {
          item.el.style.opacity = '1';
          item.el.style.transform = item.transformTo;
        }, item.delay);
      }
    });

    ctaButtons.forEach((btn, idx) => {
      setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      }, 620 + idx * 80);
    });

    badges.forEach((badge, idx) => {
      setTimeout(() => {
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
      }, 450 + idx * 80);
    });
  }, 50);

  setTimeout(() => {
    itemsToAnimate.forEach(item => {
      if (item.el) {
        item.el.style.transform = '';
        item.el.style.opacity = '';
        item.el.style.transition = '';
      }
    });
    ctaButtons.forEach(btn => {
      btn.style.transform = '';
      btn.style.opacity = '';
      btn.style.transition = '';
    });
    badges.forEach(badge => {
      badge.style.transform = '';
      badge.style.opacity = '';
      badge.style.transition = '';
    });
  }, 1400);
}

// ===== DOTTED GRID BG SPOTLIGHT TRACKING =====
function initBgSpotlight() {
  window.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--bg-spotlight-x', `${e.clientX}px`);
    document.body.style.setProperty('--bg-spotlight-y', `${e.clientY}px`);
  }, { passive: true });
}

// ===== 3D TILT & GLARE EFFECT =====
function initTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const tiltElements = document.querySelectorAll('.project-card, .cert-card, .bento-card');

  tiltElements.forEach(el => {
    el.classList.add('tilt-card');

    let glareOverlay = null;
    if (!el.classList.contains('bento-card')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'glare-wrapper';
      glareOverlay = document.createElement('div');
      glareOverlay.className = 'glare-overlay';
      wrapper.appendChild(glareOverlay);
      el.appendChild(wrapper);
    }

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;

      const tiltX = -y * 8;
      const tiltY = x * 8;

      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`;

      if (glareOverlay) {
        const glareX = e.clientX - rect.left;
        const glareY = e.clientY - rect.top;
        glareOverlay.style.setProperty('--glare-x', `${glareX}px`);
        glareOverlay.style.setProperty('--glare-y', `${glareY}px`);
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      if (glareOverlay) {
        glareOverlay.style.opacity = '0';
      }
    });
  });
}

// ===== TEXT SCRAMBLE / DECODER EFFECT =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}â€”=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function triggerTextScramble() {
  const roleEl = document.querySelector('.hero-role');
  if (roleEl) {
    const originalText = roleEl.innerText;
    const scramble = new TextScramble(roleEl);
    setTimeout(() => {
      scramble.setText(originalText);
    }, 450);
  }

  const nameEl = document.querySelector('.hero-name');
  if (nameEl) {
    const originalText = nameEl.innerText;
    const scramble = new TextScramble(nameEl);
    setTimeout(() => {
      scramble.setText(originalText);
    }, 200);
  }
}


// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
  const el = document.getElementById('typedElement');
  if (!el) return;

  const words = [
    'Student Developer',
    'Systems Builder',
    'Database Designer',
    'Full-Stack Aspirant'
  ];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIdx];

    if (isDeleting) {
      el.innerText = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40;
    } else {
      el.innerText = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIdx === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1200);
}

// ===== MULTI-THEME PRESETS SYSTEM =====
function initThemeManager() {
  const trigger = document.getElementById('themeTrigger');
  const dropdown = document.getElementById('themeDropdown');
  const options = document.querySelectorAll('.theme-option');

  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });

  const savedPreset = localStorage.getItem('themePreset') || 'slate';
  applyPreset(savedPreset);

  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = option.dataset.theme;
      applyPreset(theme);
      dropdown.classList.remove('active');
    });
  });

  function applyPreset(theme) {
    document.body.classList.remove('theme-neon', 'theme-emerald', 'theme-sunset', 'theme-slate');

    if (theme !== 'slate') {
      document.body.classList.add(`theme-${theme}`);
    }

    localStorage.setItem('themePreset', theme);

    options.forEach(opt => {
      opt.classList.remove('active-option');
      if (opt.dataset.theme === theme) {
        opt.classList.add('active-option');
      }
    });
  }
}

// ===== PROFILE FRAME 3D TILT =====
function initProfile3dTilt() {
  const card = document.getElementById('profile3dCard');
  if (!card || !window.matchMedia('(hover: hover)').matches) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const tiltX = -y * 22;
    const tiltY = x * 22;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}
// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initHeroEntrance();
  triggerTextScramble();
  initScrollAnimations();
  initLightbox();
  initActiveNav();
  initSpotlight();
  initScrollProgress();
  initParallaxBlobs();
  initMagneticElements();
  initBgSpotlight();
  initTilt();
  initTypewriter();
  initThemeManager();
  initProfile3dTilt();
});

