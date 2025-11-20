// Google Books Sidebar Integration
(function() {
  const SIDEBAR_ID = 'recommended-books-sidebar';
  const DEFAULT_QUERY = 'python';

  function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'recommended-book';

    // Cover image or fallback
    let cover;
    if (book.cover) {
      cover = document.createElement('img');
      cover.src = book.cover;
      cover.alt = book.title;
    } else {
      cover = document.createElement('div');
      cover.className = 'recommended-book-cover-fallback';
      cover.textContent = 'No cover';
    }
    card.appendChild(cover);

    // Title
    const title = document.createElement('div');
    title.className = 'recommended-book-title';
    title.textContent = book.title || 'Untitled';
    card.appendChild(title);

    // Author
    const author = document.createElement('div');
    author.className = 'recommended-book-author';
    author.textContent = book.author || 'Unknown author';
    card.appendChild(author);

    // Info link
    if (book.infoLink) {
      const link = document.createElement('a');
      link.href = book.infoLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'More info';
      link.style.display = 'block';
      link.style.marginTop = '6px';
      link.style.color = '#7ecfff';
      link.style.fontSize = '12px';
      card.appendChild(link);
    }

    return card;
  }

  function renderBooks(books) {
    const sidebar = document.getElementById(SIDEBAR_ID);
    if (!sidebar) return;
    sidebar.innerHTML = '<h2 style="font-size:18px;font-weight:bold;margin-bottom:12px;">Recommended Books</h2>';
    if (!books.length) {
      const empty = document.createElement('div');
      empty.textContent = 'No results found.';
      empty.style.color = '#ccc';
      empty.style.fontSize = '14px';
      sidebar.appendChild(empty);
      return;
    }
    books.forEach(book => {
      sidebar.appendChild(createBookCard(book));
    });
  }

  function fetchGoogleBooks(query) {
    const sidebar = document.getElementById(SIDEBAR_ID);
    if (!sidebar) return;
    sidebar.innerHTML = '<h2 style="font-size:18px;font-weight:bold;margin-bottom:12px;">Recommended Books</h2><div style="color:#aaa;font-size:14px;">Loading...</div>';
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
          renderBooks([]);
          return;
        }
        const books = data.items.map(item => {
          const info = item.volumeInfo || {};
          return {
            title: info.title || 'Untitled',
            author: (info.authors && info.authors.join(', ')) || 'Unknown author',
            cover: info.imageLinks && info.imageLinks.thumbnail ? info.imageLinks.thumbnail : null,
            infoLink: info.infoLink || null
          };
        });
        renderBooks(books);
      })
      .catch(() => {
        renderBooks([]);
      });
  }

  // Expose for manual search if needed
  window.fetchGoogleBooks = fetchGoogleBooks;

  // On DOM ready, load default
  document.addEventListener('DOMContentLoaded', function() {
    fetchGoogleBooks(DEFAULT_QUERY);
  });
})();
