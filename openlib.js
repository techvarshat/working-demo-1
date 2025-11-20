// Improved Open Library Integration – DARK MODE & Optimized
(function () {
  const resultsEl = document.getElementById("openlib-results");
  const emptyEl = document.getElementById("openlib-empty");
  let cachedQuery = "";

  function escapeHtml(str = "") {
    return str.replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function coverUrl(cover_i) {
    return cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
      : "https://via.placeholder.com/55x80/333/aaa?text=No+Cover";
  }

  function renderBooks(docs) {
    resultsEl.innerHTML = "";

    if (!docs || docs.length === 0) {
      emptyEl.classList.remove("hidden");
      return;
    }

    emptyEl.classList.add("hidden");

    docs.forEach(doc => {
      const title = escapeHtml(doc.title || "Untitled");
      const author = escapeHtml(doc.author_name?.[0] || "Unknown Author");
      const cover = coverUrl(doc.cover_i);
      const olid = doc.edition_key?.[0] || null;
      const link = olid
        ? `https://openlibrary.org/books/${olid}`
        : `https://openlibrary.org/search?q=${encodeURIComponent(title)}`;

      const div = document.createElement("div");
      div.className = "openlib-item";

      div.innerHTML = `
        <img class="openlib-cover" src="${cover}" />
        <div class="openlib-meta">
          <h3>${title}</h3>
          <p>${author}</p>
          <a href="${link}" target="_blank">Read Online</a>
        </div>
      `;

      resultsEl.appendChild(div);
    });
  }

  async function fetchBooks(query) {
    if (!query || query === "") {
      resultsEl.innerHTML = "";
      emptyEl.classList.remove("hidden");
      return;
    }

    if (query === cachedQuery) return;
    cachedQuery = query;

    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`;
      const res = await fetch(url);
      const data = await res.json();

      renderBooks(data.docs || []);
    } catch (err) {
      resultsEl.innerHTML = "";
      emptyEl.textContent = "Error loading book results.";
      emptyEl.classList.remove("hidden");
    }
  }

  // This is the function you must call from your main search handler
  window.updateOpenLibraryResults = function (query) {
    fetchBooks(query);
  };
})();
