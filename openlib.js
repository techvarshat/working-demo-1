// Open Library Integration – Full Debug Mode, DOMContentLoaded Safe
(function () {
  function log(...args) { console.log("[OpenLib]", ...args); }

  function initOpenLib() {
    const resultsEl = document.getElementById("openlib-results");
    const emptyEl = document.getElementById("openlib-empty");
    log("Results element:", resultsEl);
    log("Empty element:", emptyEl);
    if (!resultsEl || !emptyEl) {
      log("Sidebar elements not found in DOM. Retrying...");
      return false;
    }
    log("Sidebar elements found. Initializing Open Library integration.");

    let cachedQuery = "";

    function escapeHtml(str = "") {
      return str.replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[c]));
    }

    function coverUrl(cover_i) {
      return cover_i
        ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
        : "https://via.placeholder.com/55x80/333/aaa?text=No+Cover";
    }

    function renderBooks(docs) {
      log("Docs received:", docs ? docs.length : 0);
      resultsEl.innerHTML = "";
      if (!docs || docs.length === 0) {
        emptyEl.classList.remove("hidden");
        log("No book results found.");
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
      log(`Rendered ${docs.length} book(s).`);
    }

    async function fetchBooks(query) {
      console.log("Fetching OpenLibrary books for:", query);
      if (!query || query === "") {
        resultsEl.innerHTML = "";
        emptyEl.classList.remove("hidden");
        log("Empty query, cleared results.");
        return;
      }
      if (query === cachedQuery) {
        log("Query unchanged, skipping fetch.");
        return;
      }
      cachedQuery = query;
      try {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`;
        log("Fetching:", url);
        const res = await fetch(url);
        const data = await res.json();
        console.log("OpenLibrary raw response:", data);
        renderBooks(data.docs || []);
      } catch (err) {
        resultsEl.innerHTML = "";
        emptyEl.textContent = "Error loading book results.";
        emptyEl.classList.remove("hidden");
        log("API fetch error:", err);
      }
    }

    window.updateOpenLibraryResults = function (query) {
      console.log("OpenLib search triggered with query:", query);
      fetchBooks(query);
    };

    return true;
  }

  // Wait for DOM and React to render sidebar
  function waitForSidebarAndInit(retries = 20) {
    if (initOpenLib()) return;
    if (retries > 0) setTimeout(() => waitForSidebarAndInit(retries - 1), 200);
    else console.error("[OpenLib] Sidebar elements not found after waiting.");
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    waitForSidebarAndInit();
  } else {
    document.addEventListener("DOMContentLoaded", waitForSidebarAndInit);
  }
})();
