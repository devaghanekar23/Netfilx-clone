import { useEffect, useState } from 'react';
import { fetchCategory, categories, IMG, titleOf, yearOf } from '../api';

export default function Banner({ onSelect, list }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchCategory(categories[0])
      .then((items) => {
        const withBackdrop = items.filter((i) => i.backdrop_path && i.overview);
        if (!cancelled && withBackdrop.length) {
          setItem(withBackdrop[Math.floor(Math.random() * withBackdrop.length)]);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!item) return <div className="banner banner--loading" />;

  const overview = item.overview.length > 180 ? item.overview.slice(0, 180).trimEnd() + '…' : item.overview;
  const inList = list.has(item);

  return (
    <section
      className="banner"
      style={{ backgroundImage: `url(${IMG.backdrop(item.backdrop_path)})` }}
    >
      <div className="banner__shade" />
      <div className="banner__content">
        <h1 className="banner__title">{titleOf(item)}</h1>
        <p className="banner__meta">
          {yearOf(item)} · {item.media_type === 'tv' ? 'TV Series' : 'Movie'} · ★ {item.vote_average?.toFixed(1)}
        </p>
        <p className="banner__desc">{overview}</p>
        <div className="banner__buttons">
          <button className="btn btn--play" onClick={() => onSelect(item)}>
            ▶ Play
          </button>
          <button className="btn btn--ghost" onClick={() => list.toggle(item)}>
            {inList ? '✓ In My List' : '+ My List'}
          </button>
        </div>
      </div>
    </section>
  );
}
