import React, { useEffect, useState } from 'react';
import { fetchRecommendedBooks, Book } from '../services/bookService';

interface BookSidebarProps {
  query: string;
}

const BookSidebar: React.FC<BookSidebarProps> = ({ query }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      if (!query) {
        setBooks([]);
        return;
      }

      setLoading(true);
      try {
        const fetchedBooks = await fetchRecommendedBooks(query);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [query]);

  return (
    <div className="w-[280px] bg-[#1a1a1a] text-white p-4 border-l border-[#333] fixed top-0 right-0 h-screen overflow-y-auto z-50">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#333]">
        Recommended Books
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="space-y-4">
          {books.map((book, index) => (
            <div
              key={`${book.title}-${index}`}
              className="pb-4 mb-4 border-b border-[#333] last:border-b-0"
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full rounded-md mb-2 bg-[#333]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-[180px] bg-[#333] rounded-md mb-2 flex items-center justify-center text-[#888] text-xs text-center p-4">
                  No Cover Available
                </div>
              )}
              
              <h3 className="text-sm font-bold text-white mb-1 leading-tight">
                {book.title}
              </h3>
              
              <p className="text-xs text-[#ccc] mb-2">
                {Array.isArray(book.authors) 
                  ? book.authors.join(', ') 
                  : book.authors}
              </p>

              <div className="flex items-center justify-between">
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  More Info →
                </a>
                <span className="text-[10px] text-[#666] uppercase">
                  {book.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-center">
          <p className="text-sm text-[#888]">No book results found.</p>
        </div>
      )}
    </div>
  );
};

export default BookSidebar;
