import axios from 'axios';

export interface Book {
  title: string;
  authors: string[];
  coverImage: string;
  infoLink: string;
  source: 'Google Books' | 'OpenLibrary' | 'Gutendex';
}

async function fetchGoogleBooks(query: string): Promise<Book[]> {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query,
        maxResults: 10
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      return [];
    }

    return response.data.items.map((item: any) => ({
      title: item.volumeInfo.title || 'Untitled',
      authors: item.volumeInfo.authors || ['Unknown Author'],
      coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
      infoLink: item.volumeInfo.infoLink || '#',
      source: 'Google Books' as const
    }));
  } catch (error) {
    console.error('Google Books API error:', error);
    return [];
  }
}

async function fetchOpenLibrary(query: string): Promise<Book[]> {
  try {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query,
        limit: 20
      }
    });

    if (!response.data.docs || response.data.docs.length === 0) {
      return [];
    }

    return response.data.docs
      .filter((doc: any) => doc.cover_i || doc.title)
      .slice(0, 10)
      .map((doc: any) => ({
        title: doc.title || 'Untitled',
        authors: doc.author_name || ['Unknown Author'],
        coverImage: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : '',
        infoLink: doc.key ? `https://openlibrary.org${doc.key}` : '#',
        source: 'OpenLibrary' as const
      }));
  } catch (error) {
    console.error('OpenLibrary API error:', error);
    return [];
  }
}

async function fetchGutendex(query: string): Promise<Book[]> {
  try {
    const response = await axios.get('https://gutendex.com/books', {
      params: {
        search: query
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      return [];
    }

    return response.data.results.slice(0, 10).map((book: any) => {
      const authors = book.authors?.map((a: any) => a.name) || ['Unknown Author'];
      
      const formats = book.formats || {};
      const infoLink = formats['application/pdf'] 
        || formats['application/epub+zip'] 
        || formats['text/plain; charset=utf-8']
        || formats['text/html']
        || '#';

      return {
        title: book.title || 'Untitled',
        authors,
        coverImage: '',
        infoLink,
        source: 'Gutendex' as const
      };
    });
  } catch (error) {
    console.error('Gutendex API error:', error);
    return [];
  }
}

export async function fetchRecommendedBooks(query: string): Promise<Book[]> {
  try {
    const googleBooks = await fetchGoogleBooks(query);
    if (googleBooks.length > 0) {
      return googleBooks;
    }

    const openLibraryBooks = await fetchOpenLibrary(query);
    if (openLibraryBooks.length > 0) {
      return openLibraryBooks;
    }

    const gutendexBooks = await fetchGutendex(query);
    return gutendexBooks;
  } catch (error) {
    console.error('Error fetching recommended books:', error);
    return [];
  }
}
