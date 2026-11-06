KNOWGURA WEBSITE
================

Main website:
- index.html
- assets/videos.js
- videos.json

AUTOMATIC YOUTUBE UPLOADS
- GitHub Actions workflow: .github/workflows/sync-youtube.yml
- The workflow detects the channel ID from the public @KnowguraTV page,
  reads YouTube's public Atom feed, and refreshes videos.json.
- It runs every 15 minutes and can also be started manually in GitHub:
  Repository > Actions > Sync YouTube uploads > Run workflow.
- No YouTube login, API key, or paid subscription is required.
- Only public videos are listed; YouTube feed updates may take a short time.

CLOUDFLARE PAGES DEPLOYMENT
- Connect this repository to Cloudflare Pages.
- Framework preset: None
- Build command: leave blank (or use exit 0)
- Build output directory: /
- Production branch: main
- Enable automatic deployments from commits to main.
