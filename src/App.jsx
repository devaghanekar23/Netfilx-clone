import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Row from './components/Row';
import Grid from './components/Grid';
import SearchResults from './components/SearchResults';
import MovieModal from './components/MovieModal';
import Footer from './components/Footer';
import useMyList from './hooks/useMyList';
import { categories, hasApiKey } from './api';

export default function App() {
  const [view, setView] = useState('home');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const list = useMyList();
  const closeModal = useCallback(() => setSelected(null), []);

  if (!hasApiKey) {
    return (
      <div className="page-message page-message--center">
        <h1>TMDB API key missing</h1>
        <p>
          Create a <code>.env</code> file in the project root and add:
        </p>
        <pre>VITE_TMDB_API_KEY=your_api_key</pre>
        <p>Then restart the dev server (or rebuild).</p>
      </div>
    );
  }

  const searching = query.trim().length > 0;

  return (
    <>
      <Navbar view={view} query={query} onQuery={setQuery} onView={setView} />
      <main>
        {searching ? (
          <SearchResults query={query.trim()} onSelect={setSelected} />
        ) : view === 'mylist' ? (
          <Grid
            title="My List"
            items={list.list}
            onSelect={setSelected}
            empty="Your list is empty. Add movies and shows using “+ My List”."
          />
        ) : (
          <>
            <Banner onSelect={setSelected} list={list} />
            <div className="rows">
              {categories.map((c) => (
                <Row key={c.title} category={c} onSelect={setSelected} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
      {selected && <MovieModal item={selected} onClose={closeModal} list={list} />}
    </>
  );
}
