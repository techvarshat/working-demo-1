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
    <div 
      className="w-[230px] bg-[#141414] text-white p-3 border-l border-[#2a2a2a] fixed top-0 right-0 h-screen overflow-y-auto z-50 pb-24"
      style={{ boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
    >
      <h2 className="text-base font-bold mb-3 pb-2 border-b border-[#2a2a2a] tracking-wide">
        Recommended Books
      </h2>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/70"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="space-y-3">
          {books.map((book, index) => (
            <div
              key={`${book.title}-${index}`}
              className="bg-[#1a1a1a] rounded-lg p-2.5 hover:bg-[#222] transition-all duration-300 border border-[#2a2a2a] hover:border-[#3a3a3a]"
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-32 object-cover rounded-md mb-2 bg-[#252525]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-32 bg-[#252525] rounded-md mb-2 flex items-center justify-center text-[#666] text-[10px] text-center p-2">
                  No Cover
                </div>
              )}
              
              <h3 className="text-xs font-semibold text-white mb-1 leading-tight line-clamp-2">
                {book.title}
              </h3>
              
              <p className="text-[10px] text-[#aaa] mb-2 line-clamp-1">
                {Array.isArray(book.authors) 
                  ? book.authors.join(', ') 
                  : book.authors}
              </p>

              <div className="flex items-center justify-between">
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  View →
                </a>
                <span className="text-[9px] text-[#555] uppercase tracking-wider">
                  {book.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-10 text-center">
          <p className="text-xs text-[#666]">No books found</p>
        </div>
      )}
    </div>
  );
};

export default BookSidebar;
