import { IMG, titleOf } from '../api';

export default function MovieCard({ item, onSelect }) {
  const src = IMG.poster(item.poster_path) || IMG.backdropSmall(item.backdrop_path);
  return (
    <button className="card" onClick={() => onSelect(item)} title={titleOf(item)}>
      {src ? (
        <img src={src} alt={titleOf(item)} loading="lazy" />
      ) : (
        <div className="card__fallback">{titleOf(item)}</div>
      )}
    </button>
  );
}
