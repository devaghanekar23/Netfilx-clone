import MovieCard from './MovieCard';

export default function Grid({ title, items, onSelect, empty }) {
  return (
    <section className="grid-page">
      <h2 className="grid-page__title">{title}</h2>
      {items.length === 0 ? (
        <p className="grid-page__empty">{empty}</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <MovieCard key={`${item.media_type}-${item.id}`} item={item} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
