import { useEffect, useRef, useState } from 'react';

export default function Navbar({ view, query, onQuery, onView }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const goto = (v) => {
    onQuery('');
    onView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSearch = () => {
    if (!query) setSearchOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--solid' : ''}`}>
      <div className="navbar__left">
        <button className="logo" onClick={() => goto('home')} aria-label="Home">
          NETFLIX
        </button>
        <nav className="navbar__links">
          <button className={view === 'home' && !query ? 'active' : ''} onClick={() => goto('home')}>
            Home
          </button>
          <button className={view === 'mylist' && !query ? 'active' : ''} onClick={() => goto('mylist')}>
            My List
          </button>
        </nav>
      </div>

      <div className={`search ${searchOpen ? 'search--open' : ''}`}>
        <button
          className="search__icon"
          aria-label="Search"
          onClick={() => setSearchOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Titles, people, genres"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onBlur={closeSearch}
        />
        {query && (
          <button className="search__clear" aria-label="Clear" onClick={() => onQuery('')}>
            ×
          </button>
        )}
      </div>
    </header>
  );
}
