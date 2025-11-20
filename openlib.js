// openlib.js
(function () {
  const RESULTS_LIMIT = 8;
  const RESULTS_EL = document.getElementById('openlib-results');
  const LOAD_MORE_BTN = document.getElementById('openlib-load-more');
  let lastQuery = '';
  let currentOffset = 0;
  let currentDocs = [];

  // Simple debounce util
  function debounce(fn, wait = 300) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Build cover URL or placeholder
  function coverUrl(cover_i) {
    return cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
      : 'https://via.placeholder.com/50x75?text=No+Cover';
  }

  // Render a slice of currentDocs
  function renderSlice(start = 0, limit = RESULTS_LIMIT) {
    if (!RESULTS_EL) return;
    RESULTS_EL.innerHTML = '';
    const slice = currentDocs.slice(start, start + limit);
    slice.forEach(doc => {
      const title = doc.title || 'Untitled';
      const author = doc.author_name ? doc.author_name[0] : 'Unknown';
      const cover = coverUrl(doc.cover_i);
      const olid = (doc.edition_key && doc.edition_key[0]) ? doc.edition_key[0] : null;
      const readLink = olid ? `https://openlibrary.org/books/${olid}` : `https://openlibrary.org/search?q=${encodeURIComponent(title)}`;

      const item = document.createElement('div');
      item.className = 'openlib-item';
      item.setAttribute('role', 'listitem');
      item.innerHTML = `
        <img class="openlib-cover" src="${cover}" alt="Cover of ${escapeHtml(title)}">
        <div class="openlib-meta">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(author)}</p>
          <a href="${readLink}" target="_blank" rel="noopener">Read Online</a>
        </div>
      `;
      RESULTS_EL.appendChild(item);
    });

    // Show load more if more items exist
    if (currentDocs.length > RESULTS_LIMIT) {
      LOAD_MORE_BTN.classList.remove('hidden');
    } else {
      LOAD_MORE_BTN.classList.add('hidden');
    }
  }

  // Escape HTML helper
  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"]|'/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  async function fetchOpenLibrary(query) {
    if (!query || query.trim().length === 0) {
      currentDocs = [];
      renderSlice(0);
      return;
    }

    // Avoid duplicate fetches for same query
    if (query === lastQuery && sessionStorage.getItem(`ol:${query}`)) {
      try {
        currentDocs = JSON.parse(sessionStorage.getItem(`ol:${query}`));
        renderSlice(0);
        return;
      } catch (e) {
        // fallback to fetch if cache parse fails
      }
    }

    try {
      RESULTS_EL.innerHTML = '<div style="text-align:center;padding:1em 0"><span class="openlib-spinner"></span></div>';
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=40`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Open Library fetch failed');
      const data = await res.json();
      currentDocs = Array.isArray(data.docs) ? data.docs : [];
      sessionStorage.setItem(`ol:${query}`, JSON.stringify(currentDocs));
      lastQuery = query;
      currentOffset = 0;
      renderSlice(0);
    } catch (err) {
      console.error('Open Library error', err);
      RESULTS_EL.innerHTML = '<p style="font-size:12px;color:#666">Book results temporarily unavailable.</p>';
      LOAD_MORE_BTN.classList.add('hidden');
    }
  }

  // Debounced API wrapper for use with search input
  const fetchOpenLibraryDebounced = debounce(fetchOpenLibrary, 250);

  // Public: call this from your main search function
  window.updateOpenLibraryResults = function(query) {
    fetchOpenLibraryDebounced(query);
  };

  // Optional: wire load more
  if (LOAD_MORE_BTN) {
    LOAD_MORE_BTN.addEventListener('click', function() {
      currentOffset += RESULTS_LIMIT;
      renderSlice(currentOffset);
    });
  }
})();
