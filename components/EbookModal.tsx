import React, { useEffect, useRef } from 'react';
import './modal.css';

export interface Ebook {
  title: string;
  authors: string[];
  pdf?: string;
  epub?: string;
  text?: string;
}

interface EbookModalProps {
  ebooks: Ebook[];
  open: boolean;
  onClose: () => void;
}

const EbookModal: React.FC<EbookModalProps> = ({ ebooks, open, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">❌</button>
        <h2 className="modal-title">Recommended Free Books</h2>
        <div className="modal-list">
          {ebooks.length === 0 ? (
            <div className="modal-empty">No books found for this topic.</div>
          ) : (
            ebooks.map((book, idx) => (
              <div className="ebook-item" key={idx}>
                <div className="ebook-cover">
                  {/* Placeholder image */}
                  <img src="https://placehold.co/80x120?text=Book" alt="Book cover" />
                </div>
                <div className="ebook-info">
                  <h3>{book.title}</h3>
                  <p className="ebook-author">{book.authors.length > 0 ? `Author: ${book.authors.join(', ')}` : 'Author: Unknown'}</p>
                  <div className="ebook-links">
                    {book.pdf && <a href={book.pdf} target="_blank" rel="noopener noreferrer">Download PDF</a>}
                    {book.epub && <a href={book.epub} target="_blank" rel="noopener noreferrer">Download EPUB</a>}
                    {book.text && <a href={book.text} target="_blank" rel="noopener noreferrer">Read Text</a>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EbookModal;
