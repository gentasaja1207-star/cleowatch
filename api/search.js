const TMDB_KEY = process.env.TMDB_KEY || '9e7096a7575623aa30c66e9cc987e411';
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const q    = req.query.q || '';
    const page = req.query.page || 1;
    const data = await tmdb('search/multi', { query: q, page });
    res.status(200).json({
      results:     data.results.filter(i => i.media_type !== 'person').map(i => fmt(i)),
      total_pages: data.total_pages,
      page:        data.page,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
