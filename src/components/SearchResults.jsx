import { useEffect, useState } from 'react';
import { searchAll } from '../api';
import Grid from './Grid';

export default function SearchResults({ query, onSelect }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const t = setTimeout(() => {
      searchAll(query)
        .then((data) => !cancelled && setItems(data))
        .catch(() => !cancelled && setError('Something went wrong. Please try again.'))
        .finally(() => !cancelled && setLoading(false));
    }, 450); // debounce typing
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  if (loading) return <div className="page-message">Searching…</div>;
  if (error) return <div className="page-message">{error}</div>;

  return (
    <Grid
      title={`Results for “${query}”`}
      items={items}
      onSelect={onSelect}
      empty="No titles found. Try a different search."
    />
  );
}
