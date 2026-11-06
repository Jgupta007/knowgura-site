KNOWGURA WEBSITE
================

Static site:
- index.html
- assets/videos.js

Automatic YouTube channel feed proxy:
- worker.js
- wrangler.toml

CLOUDFLARE PAGES
- Connect this repository to Cloudflare Pages.
- Framework preset: None
- Build command: leave blank (or use exit 0)
- Build output directory: /
- Production branch: main

AUTOMATIC YOUTUBE UPLOADS
1. Find the exact channel ID in YouTube Studio > Settings > Channel > Advanced settings.
   It starts with UC and is 24 characters long.
2. Deploy worker.js as a Cloudflare Worker named knowgura-youtube-feed.
   wrangler.toml is included for deployment with Wrangler.
3. Set Worker variable YOUTUBE_CHANNEL_ID to the channel ID.
4. The Worker feed endpoint will be https://<worker-subdomain>.workers.dev/feed.xml
5. Add that exact URL to window.KNOWGURA_FEED_URL in index.html.
6. New public uploads are read from YouTube's public Atom channel feed.
   Feed updates can take a short time; they are not instantaneous.

Until the Worker is configured, the homepage uses a fallback set of the two
existing Knowgura documentaries. No YouTube login credentials are needed.
