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

// ===== SCROLL FADE-IN ANIMATION =====
function initFadeIns() {
  const els = document.querySelectorAll('.fade-in');
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
  }, { threshold: 0.1 });

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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initFadeIns();
  initLightbox();
  initActiveNav();
});