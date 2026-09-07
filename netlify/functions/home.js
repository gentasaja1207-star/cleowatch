const TMDB_KEY = '9e7096a7575623aa30c66e9cc987e411';
const BASE     = 'https://api.themoviedb.org/3';
const W500     = 'https://image.tmdb.org/t/p/w500';
const ORI      = 'https://image.tmdb.org/t/p/original';

async function tmdb(path, params = {}) {
  const q = new URLSearchParams({ api_key: TMDB_KEY, ...params });
  const r = await fetch(`${BASE}/${path}?${q}`);
  if (!r.ok) throw new Error(`TMDB ${r.status}`);
  return r.json();
}

function fmt(item, type) {
  const t = type || item.media_type || (item.title ? 'movie' : 'tv');
  return {
    id:       item.id,
    title:    item.title || item.name || 'Untitled',
    type:     t,
    year:     (item.release_date || item.first_air_date || '').split('-')[0] || '',
    rating:   item.vote_average ? +item.vote_average.toFixed(1) : 0,
    overview: item.overview || '',
    poster:   item.poster_path   ? `${W500}${item.poster_path}`   : null,
    backdrop: item.backdrop_path ? `${ORI}${item.backdrop_path}`  : null,
    genres:   item.genre_ids || [],
  };
}

exports.handler = async () => {
  try {
    const [trendM, trendT, topM, topT, upcoming] = await Promise.all([
      tmdb('trending/movie/week'),
      tmdb('trending/tv/week'),
      tmdb('movie/top_rated'),
      tmdb('tv/top_rated'),
      tmdb('movie/upcoming'),
    ]);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        trending_movies: trendM.results.slice(0, 20).map(i => fmt(i, 'movie')),
        trending_series: trendT.results.slice(0, 20).map(i => fmt(i, 'tv')),
        top_movies:      topM.results.slice(0, 20).map(i => fmt(i, 'movie')),
        top_series:      topT.results.slice(0, 20).map(i => fmt(i, 'tv')),
        upcoming:        upcoming.results.slice(0, 20).map(i => fmt(i, 'movie')),
      }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
