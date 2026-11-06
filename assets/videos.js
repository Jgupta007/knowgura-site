/* Knowgura video catalogue loader.
 * Reads the public YouTube Atom feed through the Cloudflare Worker endpoint
 * configured as window.KNOWGURA_FEED_URL. Includes a fallback catalogue.
 */
(() => {
  const fallback = [
    { id: 'c0FlK_MiQCE', title: 'The Binance Heist', description: 'A Knowgura documentary', published: '', category: 'Cybercrime · Investigation' },
    { id: 'EoSKI39989w', title: 'The Bangladesh Bank Heist', description: 'A Knowgura documentary', published: '', category: 'Cybercrime · True story' }
  ];
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const card = v => `<article class="card" data-search="${esc((v.title+' '+v.description+' '+v.category).toLowerCase())}">
    <div class="thumb" data-video="${esc(v.id)}"><img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="${esc(v.title)} thumbnail"><span class="play">▶</span></div>
    <div class="tag">${esc(v.category || 'Knowgura Original')}</div><h3>${esc(v.title)}</h3><p>${esc(v.published || 'A Knowgura documentary')}</p></article>`;
  function getVideoId(entry) {
    const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent?.trim();
    if (id) return id;
    const link = entry.getElementsByTagName('link')[0]?.getAttribute('href') || '';
    try { return new URL(link).searchParams.get('v'); } catch { return null; }
  }
  async function load() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    let videos = fallback;
    const endpoint = window.KNOWGURA_FEED_URL;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Feed returned ${res.status}`);
        const xml = new DOMParser().parseFromString(await res.text(), 'application/xml');
        if (xml.querySelector('parsererror')) throw new Error('Invalid feed XML');
        const fromFeed = [...xml.getElementsByTagName('entry')].map(e => {
          const id = getVideoId(e);
          if (!id) return null;
          return {
            id,
            title: e.getElementsByTagName('title')[0]?.textContent?.trim() || 'Untitled documentary',
            description: e.getElementsByTagName('media:description')[0]?.textContent?.trim() || 'A Knowgura documentary',
            published: (e.getElementsByTagName('published')[0]?.textContent || '').slice(0,10),
            category: 'Latest upload · Knowgura'
          };
        }).filter(Boolean);
        if (fromFeed.length) videos = fromFeed;
      } catch (err) {
        console.warn('Knowgura feed unavailable; showing saved films.', err);
      }
    }
    grid.innerHTML = videos.map(card).join('');
    grid.querySelectorAll('.thumb[data-video]').forEach(el =>
      el.addEventListener('click', () => window.openKnowguraVideo(el.dataset.video))
    );
    const search = document.getElementById('search');
    const filter = () => {
      const q = (search?.value || '').toLowerCase();
      grid.querySelectorAll('.card').forEach(c => {
        c.style.display = (c.dataset.search || '').includes(q) ? '' : 'none';
      });
    };
    search?.addEventListener('input', filter);
    filter();
  }
  document.addEventListener('DOMContentLoaded', load);
})();
