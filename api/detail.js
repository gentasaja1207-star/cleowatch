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

function streamUrl(id, type, season = 1, episode = 1) {
  if (type === 'movie') return `https://vidsrc.sbs/embed/movie/${id}`;
  return `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`;
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
    const { id, type } = req.query || {};
    const ep = type === 'tv' ? 'tv' : 'movie';

    const [details, credits, similar] = await Promise.all([
      tmdb(`${ep}/${id}`),
      tmdb(`${ep}/${id}/credits`),
      tmdb(`${ep}/${id}/similar`),
    ]);

    const base = fmt(details, type);
    base.genres  = (details.genres || []).map(g => g.name);
    base.tagline = details.tagline || '';
    base.status  = details.status || '';
    base.runtime = details.runtime || details.episode_run_time?.[0] || 0;
    base.cast    = (credits.cast || []).slice(0, 10).map(c => ({
      name: c.name, character: c.character,
      photo: c.profile_path ? `${W500}${c.profile_path}` : null,
    }));
    base.similar = (similar.results || []).slice(0, 12).map(i => fmt(i, type));

    if (type === 'tv') {
      base.seasons_count  = details.number_of_seasons || 0;
      base.episodes_count = details.number_of_episodes || 0;
      base.creators       = (details.created_by || []).map(c => c.name);
      const nums          = Array.from({ length: base.seasons_count }, (_, i) => i + 1);
      const seasonData    = await Promise.all(
        nums.map(s => tmdb(`tv/${id}/season/${s}`).catch(() => null))
      );
      base.seasons = seasonData.filter(Boolean).map(s => ({
        season_number: s.season_number,
        name:   s.name,
        poster: s.poster_path ? `${W500}${s.poster_path}` : null,
        episodes: (s.episodes || []).map(ep2 => ({
          id:             ep2.id,
          episode_number: ep2.episode_number,
          name:           ep2.name,
          overview:       ep2.overview || '',
          air_date:       ep2.air_date || '',
          rating:         ep2.vote_average ? +ep2.vote_average.toFixed(1) : 0,
          still:          ep2.still_path ? `${W500}${ep2.still_path}` : null,
          stream:         streamUrl(id, 'tv', s.season_number, ep2.episode_number),
        })),
      }));
    } else {
      base.directors = (credits.crew || []).filter(c => c.job === 'Director').map(c => c.name);
      base.stream    = streamUrl(id, 'movie');
    }

    res.status(200).json(base);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
