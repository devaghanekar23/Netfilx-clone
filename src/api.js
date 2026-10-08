const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

export const hasApiKey = Boolean(API_KEY);

export const IMG = {
  poster: (path) => (path ? `https://image.tmdb.org/t/p/w342${path}` : null),
  backdrop: (path) => (path ? `https://image.tmdb.org/t/p/original${path}` : null),
  backdropSmall: (path) => (path ? `https://image.tmdb.org/t/p/w780${path}` : null),
};

async function get(path, params = {}) {
  const qs = new URLSearchParams({ api_key: API_KEY, language: 'en-US', ...params });
  const res = await fetch(`${BASE}${path}?${qs}`);
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  return res.json();
}

// Each row on the home page
export const categories = [
  { title: 'Trending Now', path: '/trending/all/week', type: null },
  { title: 'Top Rated Movies', path: '/movie/top_rated', type: 'movie' },
  { title: 'Popular TV Shows', path: '/tv/popular', type: 'tv' },
  { title: 'Action Movies', path: '/discover/movie', params: { with_genres: 28 }, type: 'movie' },
  { title: 'Comedy Movies', path: '/discover/movie', params: { with_genres: 35 }, type: 'movie' },
  { title: 'Horror Movies', path: '/discover/movie', params: { with_genres: 27 }, type: 'movie' },
  { title: 'Romance Movies', path: '/discover/movie', params: { with_genres: 10749 }, type: 'movie' },
  { title: 'Documentaries', path: '/discover/movie', params: { with_genres: 99 }, type: 'movie' },
];

// Make sure every item knows if it is a movie or tv show
const tag = (items, type) =>
  items
    .filter((i) => i.poster_path || i.backdrop_path)
    .map((i) => ({ ...i, media_type: i.media_type || type || 'movie' }));

export async function fetchCategory(cat) {
  const data = await get(cat.path, cat.params);
  return tag(data.results, cat.type).filter((i) => i.media_type !== 'person');
}

export async function searchAll(query) {
  const data = await get('/search/multi', { query, include_adult: 'false' });
  return tag(data.results).filter((i) => i.media_type === 'movie' || i.media_type === 'tv');
}

export async function fetchDetails(type, id) {
  const [details, videos] = await Promise.all([get(`/${type}/${id}`), get(`/${type}/${id}/videos`)]);
  const yt = videos.results.filter((v) => v.site === 'YouTube');
  const trailer = yt.find((v) => v.type === 'Trailer') || yt.find((v) => v.type === 'Teaser') || yt[0];
  return { details, trailerKey: trailer ? trailer.key : null };
}

export const titleOf = (item) => item.title || item.name || item.original_name || 'Untitled';
export const yearOf = (item) => (item.release_date || item.first_air_date || '').slice(0, 4);
