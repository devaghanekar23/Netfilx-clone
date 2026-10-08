import { useEffect, useState } from 'react';
import { fetchDetails, IMG, titleOf, yearOf } from '../api';

export default function MovieModal({ item, onClose, list }) {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setPlaying(false);
    fetchDetails(item.media_type, item.id)
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setData({ details: null, trailerKey: null }));
    return () => {
      cancelled = true;
    };
  }, [item]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const details = data?.details;
  const trailerKey = data?.trailerKey;
  const inList = list.has(item);
  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details?.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
    : '';
  const genres = details?.genres?.map((g) => g.name).join(', ');

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal__box" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal__media">
          {playing && trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="Trailer"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={IMG.backdropSmall(item.backdrop_path) || IMG.poster(item.poster_path)}
                alt={titleOf(item)}
              />
              <div className="modal__shade" />
              <div className="modal__actions">
                <h2>{titleOf(item)}</h2>
                <div className="banner__buttons">
                  <button
                    className="btn btn--play"
                    disabled={!trailerKey}
                    onClick={() => setPlaying(true)}
                  >
                    {data ? (trailerKey ? '▶ Play Trailer' : 'No trailer') : 'Loading…'}
                  </button>
                  <button className="btn btn--ghost" onClick={() => list.toggle(item)}>
                    {inList ? '✓ In My List' : '+ My List'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal__body">
          <div className="modal__info">
            <p className="modal__meta">
              <span className="green">{Math.round((item.vote_average || 0) * 10)}% Match</span>
              <span>{yearOf(item)}</span>
              {runtime && <span>{runtime}</span>}
              <span className="badge">HD</span>
            </p>
            {details?.tagline && <p className="modal__tagline">“{details.tagline}”</p>}
            <p>{item.overview || 'No description available.'}</p>
          </div>
          <div className="modal__side">
            {genres && (
              <p>
                <span className="muted">Genres:</span> {genres}
              </p>
            )}
            <p>
              <span className="muted">Rating:</span> ★ {item.vote_average?.toFixed(1)} ({item.vote_count} votes)
            </p>
            <p>
              <span className="muted">Type:</span> {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
            </p>
            {details?.original_language && (
              <p>
                <span className="muted">Language:</span> {details.original_language.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
