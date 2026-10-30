/**
 * Python Practical Hub - Core Client Logic
 * Offline-First & Vanilla JavaScript
 */

(() => {
  'use strict';

  // Configuration: The ZIP archive path inside downloads/
  // When your ZIP is provided, this filename matches your exact archive.
  const CONFIG = {
    zipPath: 'downloads/python_practicals.zip',
    defaultZipName: 'python_practicals.zip',
    storageKey: 'pyhub_zip_name'
  };

  // Local index — extracted from your uploaded archive (python_practicals.zip)
  const PRACTICALS = [
    { id: 1, title: 'A* Search Algorithm', category: 'Search' },
    { id: 2, title: 'Alpha-Beta Pruning', category: 'Game AI' },
    { id: 3, title: 'Associative Memory', category: 'Neural Networks' },
    { id: 4, title: 'DFID – Depth-First Iterative Deepening', category: 'Search' },
    { id: 5, title: 'Fuzzy Logic', category: 'Fuzzy Systems' },
    { id: 6, title: 'Genetic Algorithm & Simulated Annealing', category: 'Optimization' },
    { id: 7, title: 'K-Means Clustering (Unsupervised)', category: 'Machine Learning' },
    { id: 8, title: 'Single-Layer Perceptron', category: 'Neural Networks' }
  ];

  // DOM Elements
  const searchInput = document.getElementById('searchInput');
  const searchBox = document.getElementById('searchBox');
  const clearBtn = document.getElementById('clearBtn');
  const suggestionsList = document.getElementById('suggestionsList');
  const googleSearchBtn = document.getElementById('googleSearchBtn');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const toast = document.getElementById('toast');
  const networkBadge = document.getElementById('networkStatusBadge');
  const networkText = document.getElementById('networkStatusText');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const footerDownloadLink = document.getElementById('footerDownloadLink');

  // ---------- Service Worker Registration ----------
  function initServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      window.addEventListener('load', () => {
        // Use relative path for GitHub Pages compatibility
        navigator.serviceWorker.register('./service-worker.js', { scope: './' })
          .then(registration => {
            console.log('[ServiceWorker] Registered with scope:', registration.scope);
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    showToast('Practical Hub updated offline cache.');
                  }
                };
              }
            };
          })
          .catch(err => {
            console.warn('[ServiceWorker] Registration failed or disabled:', err);
          });
      });
    } else {
      console.log('[ServiceWorker] Offline mode via native local file system (file://) or unsupported browser.');
    }
  }

  // ---------- Network Status Detection ----------
  function updateNetworkStatus() {
    if (navigator.onLine) {
      networkBadge.classList.remove('offline');
      networkText.textContent = 'Online / Cached';
    } else {
      networkBadge.classList.add('offline');
      networkText.textContent = 'Offline Mode';
      showToast('You are offline. Cached assets & downloads remain functional.');
    }
  }

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);

  // ---------- Toast Notification ----------
  let toastTimer = null;
  function showToast(message, duration = 3500) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ---------- ZIP Download Functionality ----------
  function triggerZipDownload() {
    // If a custom filename was configured, use it
    const storedZip = localStorage.getItem(CONFIG.storageKey);
    const activeZipPath = storedZip ? `downloads/${storedZip}` : CONFIG.zipPath;
    const downloadFilename = storedZip || CONFIG.defaultZipName;

    showToast('Starting download of Python practicals archive...');

    const link = document.createElement('a');
    link.href = activeZipPath;
    link.download = downloadFilename;
    link.setAttribute('rel', 'noopener');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  tryAgainBtn.addEventListener('click', triggerZipDownload);
  if (footerDownloadLink) {
    footerDownloadLink.addEventListener('click', (e) => {
      e.preventDefault();
      triggerZipDownload();
    });
  }

  // ---------- Search Bar & Local Suggestions ----------
  function filterPracticals(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRACTICALS.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      `practical ${p.id}`.includes(q)
    );
  }

  function renderSuggestions(matches) {
    suggestionsList.innerHTML = '';
    if (matches.length === 0) {
      searchBox.classList.remove('has-suggestions');
      suggestionsList.classList.remove('active');
      return;
    }

    matches.slice(0, 6).forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.setAttribute('role', 'option');
      div.setAttribute('tabindex', '0');
      div.innerHTML = `
        <span class="suggestion-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </span>
        <span class="suggestion-text">${item.title}</span>
        <span class="suggestion-tag">${item.category}</span>
      `;

      div.addEventListener('click', () => {
        searchInput.value = item.title;
        hideSuggestions();
        openModal(item.title, `
          <p><strong>Category:</strong> ${item.category}</p>
          <p style="margin-top: 10px;">This practical program is included in the full archive.</p>
          <div style="margin-top: 18px;">
            <button class="btn btn-action" onclick="document.getElementById('tryAgainBtn').click();">Download Full ZIP</button>
          </div>
        `);
      });

      suggestionsList.appendChild(div);
    });

    searchBox.classList.add('has-suggestions');
    suggestionsList.classList.add('active');
  }

  function hideSuggestions() {
    searchBox.classList.remove('has-suggestions');
    suggestionsList.classList.remove('active');
  }

  searchInput.addEventListener('input', () => {
    const value = searchInput.value;
    clearBtn.classList.toggle('visible', value.length > 0);
    const matches = filterPracticals(value);
    renderSuggestions(matches);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('visible');
    hideSuggestions();
    searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target) && !suggestionsList.contains(e.target)) {
      hideSuggestions();
    }
  });

  function performSearch() {
    const query = searchInput.value.trim();
    hideSuggestions();
    if (!query) {
      showToast('Please type a search query or practical topic.');
      searchInput.focus();
      return;
    }

    const matches = filterPracticals(query);
    if (matches.length > 0) {
      const listHtml = matches.map(m => `
        <tr>
          <td><strong>#${m.id}</strong></td>
          <td>${m.title}</td>
          <td><span class="suggestion-tag">${m.category}</span></td>
        </tr>
      `).join('');

      openModal(`Search Results for "${query}"`, `
        <p>Found <strong>${matches.length}</strong> matching practical(s) in local offline index:</p>
        <table class="practicals-table">
          <thead>
            <tr><th>No.</th><th>Title</th><th>Topic</th></tr>
          </thead>
          <tbody>${listHtml}</tbody>
        </table>
        <div style="margin-top: 20px; text-align: right;">
          <button class="btn btn-action" id="modalDownloadBtn">Download All 15 Practicals</button>
        </div>
      `);

      const modalDl = document.getElementById('modalDownloadBtn');
      if (modalDl) modalDl.addEventListener('click', triggerZipDownload);
    } else {
      openModal(`Search Results for "${query}"`, `
        <p>No exact matching practical found in the 15-program syllabus for "<em>${escapeHtml(query)}</em>".</p>
        <p style="margin-top: 10px;">You can still download the complete practicals archive containing all programs.</p>
        <div style="margin-top: 18px;">
          <button class="btn btn-action" onclick="document.getElementById('tryAgainBtn').click();">Download ZIP</button>
        </div>
      `);
    }
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  googleSearchBtn.addEventListener('click', performSearch);

  // ---------- Modal Logic ----------
  function openModal(title, htmlContent) {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal Triggers
  document.querySelectorAll('.modal-trigger, #aboutLink, #practicalsLink').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-target') || (trigger.id === 'aboutLink' ? 'about' : 'practicals');
      
      if (target === 'about') {
        openModal('About Python Practical Hub', `
          <p><strong>Python Practical Hub</strong> is a lightweight, responsive, offline-first portal engineered with a clean, Google-inspired search experience.</p>
          <br>
          <p>It provides instant access and offline-cached downloads for 15 essential Python practical experiments with zero backend, zero tracking, and zero external CDNs.</p>
        `);
      } else if (target === 'how') {
        openModal('How it Works', `
          <p><strong>Offline-First Architecture:</strong></p>
          <ul style="padding-left: 20px; margin-top: 8px;">
            <li>All assets (HTML, CSS, JS, logo, and ZIP) are cached in the browser via Service Worker.</li>
            <li>Clicking <strong>"Try Again"</strong> immediately downloads the original Python ZIP archive.</li>
            <li>The search bar operates entirely in the browser using client-side indexing without external network calls.</li>
          </ul>
        `);
      } else if (target === 'offline') {
        openModal('Offline Cache Information', `
          <p>This web application utilizes standard Web Cache APIs and a custom Service Worker.</p>
          <br>
          <p><strong>Status:</strong> ${navigator.onLine ? 'Online (Ready to cache)' : 'Operating fully Offline'}</p>
          <p style="margin-top: 8px;">Once loaded, this entire hub can be used with internet turned off or opened directly from your filesystem.</p>
        `);
      } else if (target === 'practicals') {
        const rows = PRACTICALS.map(p => `
          <tr>
            <td><strong>#${p.id}</strong></td>
            <td>${p.title}</td>
            <td><span class="suggestion-tag">${p.category}</span></td>
          </tr>
        `).join('');

        openModal('8 AI / Python Practical Programs', `
          <p>Complete curriculum of practical programs included in the archive:</p>
          <table class="practicals-table">
            <thead>
              <tr><th>#</th><th>Topic</th><th>Category</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div style="margin-top: 18px; text-align: right;">
            <button class="btn btn-action" onclick="document.getElementById('tryAgainBtn').click();">Download Full ZIP</button>
          </div>
        `);
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initialize
  initServiceWorker();
  updateNetworkStatus();

})();
