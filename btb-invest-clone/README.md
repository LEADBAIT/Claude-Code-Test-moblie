# BTB Israel "Invest" page: offline copy

A local snapshot of https://www.btbisrael.co.il/en/invest-en/ taken 2026-11-19, kept for reference.

- `index.html`: the page's HTML, with tracking scripts (Google Tag Manager, PixelYourSite, LinkedIn/TikTok pixels, Cloudflare challenge) removed
- `assets/`: the site's CSS, JS, fonts, images and videos, with paths rewritten to relative URLs

View it with a local server (opening the file directly breaks some scripts):

    cd btb-invest-clone && python3 -m http.server 8000   # then open http://localhost:8000

Navigation links still go to the live site. The forms do not work offline.
All content and branding belong to BTB Israel. This copy is for private reference only. Do not publish it.
