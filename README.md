# Dispute Levels React Website

Production Vite/React migration of the supplied Dispute Levels Credit & Financial Solutions website.

## Run locally

    npm install
    npm run dev

Open http://127.0.0.1:4173/.

## Verify and build

    npm run lint
    npm run content:audit
    npm run build
    npm run preview

The production output is written to dist/.

## SPA deployment rewrites

The application uses React Router with BrowserRouter. Configure the production host to serve index.html for routes that do not match a physical file.

- Netlify: create a rewrite from /* to /index.html with status 200.
- Vercel: add a rewrite from /(.*) to /index.html.
- Apache: use an .htaccess fallback to index.html.
- Nginx: use try_files $uri $uri/ /index.html;.
- Cloudflare Pages: add an SPA fallback to /index.html.

Do not rewrite requests for files in /assets, /sitemap.xml, or /robots.txt.

## Preserved source

The untouched supplied HTML pages, XML sitemap, and Python migration helper are archived in legacy-source/. This folder is source reference only and is not part of the Vite production build.

## Known source omissions

The legacy navigation references three pages that were not supplied: refund.html, consumer-rights.html, and accessibility.html. Their labels remain visible in the footer, but no legal copy or routes were invented.
