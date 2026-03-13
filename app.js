// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
});

// ===== MOBILE DRAWER =====
function toggleDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (drawer && overlay) {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

// ===== AUTH MODAL =====
function openModal(tab) {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('open');
    switchTab(tab || 'login');
  }
}

function closeModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('open');
}

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const title = document.getElementById('modalTitle');

  if (!loginForm) return;

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    if (tabLogin) tabLogin.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (title) title.textContent = 'Entrar na GameVault';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.add('active');
    if (title) title.textContent = 'Criar sua conta grátis';
  }
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.addEventListener('click', e => {
      if (e.target === authModal) closeModal();
    });
  }

  // Close drawer on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      const drawer = document.getElementById('mobileDrawer');
      const overlay = document.getElementById('drawerOverlay');
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }
  });

  // Init filter chips (home page)
  const homeChips = document.getElementById('homeFilterChips');
  if (homeChips) {
    homeChips.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        homeChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;
        grid.querySelectorAll('.listing-card').forEach(card => {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Animate stats counters
  animateCounters();

  // Intersection observer for fade-in
  observeElements();
});

// ===== AUTH HANDLERS =====
function handleLogin() {
  showToast('Login realizado com sucesso! Bem-vindo de volta.', 'success');
  closeModal();
}

function handleRegister() {
  showToast('Conta criada com sucesso! Bem-vindo ao GameVault!', 'success');
  closeModal();
}

// ===== WISHLIST =====
function toggleWishlist(btn) {
  const icon = btn.querySelector('i');
  if (!icon) return;
  if (icon.classList.contains('fa-regular')) {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
    btn.classList.add('active');
    showToast('Adicionado aos favoritos!', 'success');
  } else {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
    btn.classList.remove('active');
    showToast('Removido dos favoritos.', 'info');
  }
}

// ===== TOAST =====
function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '&#10003;',
    error: '&#10007;',
    info: '&#9432;',
    warning: '&#9888;'
  };

  const colors = {
    success: '#34d399',
    error: '#f87171',
    info: '#a78bfa',
    warning: '#fbbf24'
  };

  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.innerHTML = '<span class="toast-icon" style="color:' + (colors[type] || colors.info) + ';">' + (icons[type] || icons.info) + '</span><span class="toast-text">' + message + '</span>';
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const duration = 1800;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          if (target >= 1000) {
            el.textContent = (start / 1000).toFixed(1).replace('.0', '') + 'K' + (suffix.replace('K+', '+'));
          } else {
            el.textContent = Math.floor(start) + suffix;
          }
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

// ===== INTERSECTION OBSERVER (fade-in) =====
function observeElements() {
  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step-card, .trust-card, .testimonial-card, .listing-card, .game-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== LISTINGS PAGE =====
let currentGameFilter = 'all';
let currentCatFilter = 'all';

function filterByGame(el, game) {
  document.querySelectorAll('.sidebar-game').forEach(g => g.classList.remove('active'));
  el.classList.add('active');
  currentGameFilter = game;
  applyFilters();
}

function filterByCat(el, cat) {
  document.querySelectorAll('#categoryFilter .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  currentCatFilter = cat;
  applyFilters();
}

function applyFilters() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const search = (document.getElementById('searchInput') || {}).value || '';
  const minPrice = parseFloat((document.getElementById('priceMin') || {}).value) || 0;
  const maxPrice = parseFloat((document.getElementById('priceMax') || {}).value) || Infinity;

  let visibleCount = 0;
  grid.querySelectorAll('.listing-card').forEach(card => {
    const game = card.dataset.game || '';
    const type = card.dataset.type || '';
    const price = parseFloat(card.dataset.price) || 0;
    const title = card.querySelector('.listing-title');
    const titleText = title ? title.textContent.toLowerCase() : '';

    const gameMatch = currentGameFilter === 'all' || game === currentGameFilter;
    const catMatch = currentCatFilter === 'all' || type === currentCatFilter;
    const priceMatch = price >= minPrice && price <= maxPrice;
    const searchMatch = !search || titleText.includes(search.toLowerCase());

    if (gameMatch && catMatch && priceMatch && searchMatch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.innerHTML = '<strong>' + visibleCount + '</strong> anúncios encontrados';
}

function filterListings() {
  applyFilters();
}

function sortListings(value) {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.listing-card'));
  cards.sort((a, b) => {
    const priceA = parseFloat(a.dataset.price) || 0;
    const priceB = parseFloat(b.dataset.price) || 0;
    if (value === 'price-asc') return priceA - priceB;
    if (value === 'price-desc') return priceB - priceA;
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

function setView(view, btn) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;
  if (view === 'list') {
    grid.style.gridTemplateColumns = '1fr';
  } else {
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
  }
}

function clearFilters() {
  currentGameFilter = 'all';
  currentCatFilter = 'all';
  document.querySelectorAll('.sidebar-game').forEach((g, i) => {
    if (i === 0) g.classList.add('active');
    else g.classList.remove('active');
  });
  document.querySelectorAll('#categoryFilter .filter-chip').forEach((c, i) => {
    if (i === 0) c.classList.add('active');
    else c.classList.remove('active');
  });
  const minPriceEl = document.getElementById('priceMin');
  const maxPriceEl = document.getElementById('priceMax');
  if (minPriceEl) minPriceEl.value = '';
  if (maxPriceEl) maxPriceEl.value = '';
  applyFilters();
  showToast('Filtros limpos!', 'info');
}

// ===== PAGINATION =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.page-btn:not(.arrow)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-btn:not(.arrow)').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});

// ===== URL PARAM FILTERS =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const game = params.get('game');

  if (cat) {
    const catBtn = document.querySelector('[data-cat="' + cat + '"]');
    if (catBtn) filterByCat(catBtn, cat);
  }

  if (game) {
    const gameBtn = document.querySelector('[data-game="' + game + '"]');
    if (gameBtn) filterByGame(gameBtn, game);
  }
});
