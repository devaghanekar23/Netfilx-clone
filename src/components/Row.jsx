import { useEffect, useRef, useState } from 'react';
import { fetchCategory } from '../api';
import MovieCard from './MovieCard';

export default function Row({ category, onSelect }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchCategory(category)
      .then((data) => !cancelled && setItems(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [category]);

  const scroll = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (error) return null;

  return (
    <section className="row">
      <h2 className="row__title">{category.title}</h2>
      <div className="row__wrap">
        <button className="row__arrow row__arrow--left" onClick={() => scroll(-1)} aria-label="Scroll left">
          ‹
        </button>
        <div className="row__scroller" ref={scroller}>
          {items.length === 0
            ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="card card--skeleton" />)
            : items.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} item={item} onSelect={onSelect} />
              ))}
        </div>
        <button className="row__arrow row__arrow--right" onClick={() => scroll(1)} aria-label="Scroll right">
          ›
        </button>
      </div>
    </section>
  );
}
