/**
 * Cloudflare Worker proxy for the public Knowgura YouTube Atom feed.
 * Set YOUTUBE_CHANNEL_ID to the channel ID beginning with UC.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors() });
    }
    if (url.pathname !== '/feed.xml') return new Response('Not found', { status: 404 });
    const channelId = env.YOUTUBE_CHANNEL_ID;
    if (!channelId || !/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) {
      return new Response('Set YOUTUBE_CHANNEL_ID to the exact YouTube channel ID in Worker Variables.', {
        status: 503, headers: cors()
      });
    }
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const response = await fetch(feedUrl, { headers: { 'User-Agent': 'KnowguraSite/1.0' } });
    if (!response.ok) {
      return new Response('YouTube feed temporarily unavailable', { status: 502, headers: cors() });
    }
    return new Response(await response.text(), {
      headers: {
        ...cors(),
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    });
  }
};
function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff'
  };
}
