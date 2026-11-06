KNOWGURA WEBSITE
================

Main website:
- index.html
- assets/videos.js
- videos.json

AUTOMATIC YOUTUBE UPLOADS
The website is prepared to read a generated videos.json catalogue and display
the latest videos automatically. The scheduled GitHub Actions sync will be
enabled after the exact channel ID is verified. The public @KnowguraTV page
currently resolves to an empty feed ID, so the site must not sync from that
unverified value.

To provide the ID:
YouTube Studio > Settings > Channel > Advanced settings > Channel ID.
It is a public identifier beginning with UC; do not send passwords or tokens.

CLOUDFLARE PAGES DEPLOYMENT
- Connect this repository to Cloudflare Pages.
- Framework preset: None
- Build command: leave blank (or use exit 0)
- Build output directory: /
- Production branch: main
