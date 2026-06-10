# BeanRunner Cafe — Website

Production website for **BeanRunner Cafe** (201 S. Division St., Peekskill, NY). A
static, no-build, multi-page site with a git-based CMS so staff can edit content
without touching code.

The publishable site lives entirely in **`/site`**. The original design prototypes
remain in the repo root for reference.

## Pages

| File | URL | Notes |
|------|-----|-------|
| `site/index.html` | `/` | Home |
| `site/menu.html` | `/menu.html` | **CMS-driven** — renders from `content/menu.json` |
| `site/about.html` | `/about.html` | Story, timeline, founders |
| `site/events.html` | `/events.html` | **CMS-driven** — renders from `content/events.json` |
| `site/gallery.html` | `/gallery.html` | **CMS-driven** — renders from `content/exhibits.json` |
| `site/contact.html` | `/contact.html` | Phone/email + Google Map |
| `site/404.html` | — | Not-found page |

## How it works

It's plain HTML/CSS/JS — no framework, no build step.

- **Shared design system:** `site/css/styles.css` (color tokens, typography, nav,
  footer, and every page's section styles). Never hard-code colors — use the CSS
  variables at the top of the file.
- **Shared behaviour:** `site/js/main.js` (mobile nav, smooth scroll).
- **Dynamic content:** `site/js/collections.js` fetches the JSON files in
  `site/content/` and renders the Menu, Events, and Gallery pages in the browser.
  Editing those JSON files (by hand or via the CMS) updates the site — no rebuild.

## Local preview

Any static file server works. From the repo root:

```bash
# Python
cd site && python3 -m http.server 4321

# or Node
npx serve site -l 4321
```

Then open <http://localhost:4321>. (Opening the HTML files directly via `file://`
will break the dynamic pages — they need to `fetch()` the JSON over HTTP.)

## Content editing (CMS)

Staff edit events, the menu, and art exhibits through **Decap CMS** at `/admin/`.
It commits changes straight to the git repo, which redeploys the site.

One-time setup on Netlify:

1. Deploy the repo to Netlify (see below).
2. In the Netlify dashboard: **Site settings → Identity → Enable Identity**.
3. Under **Identity → Registration**, set to *Invite only*, then invite staff emails.
4. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway**.
5. Staff visit `https://<your-site>/admin/`, accept the email invite, and log in.

Prefer GitHub logins instead of Netlify Identity? Swap the `backend` block in
`site/admin/config.yml` for the `github` backend (commented example included in
that file) and register an OAuth app.

## Deployment (Netlify)

`netlify.toml` is already configured with **publish directory = `site`** and no
build command.

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Netlify reads `netlify.toml` automatically — just deploy.
4. Add the custom domain (`beanrunnercafe.com`) under **Domain settings**.

Any static host works too (Cloudflare Pages, GitHub Pages) — just serve the
`site/` directory as the web root. The CMS, however, expects the Netlify
Identity + Git Gateway setup described above.

## Things to finish before launch

- **Social links** in the footer point to `#` — add the real Facebook / Instagram
  / YouTube URLs (in each page's footer, or centralize later).
- **Highlight menu photos** in `site/assets/images/menu/` were pulled from the old
  Wix site; replace with higher-res originals if available. `chicken-waffle.jpg`
  and `greek-salmon.jpg` are large (~0.8–0.9 MB) and worth re-compressing.
- **Canonical/OG URLs** assume `https://www.beanrunnercafe.com` — update if the
  final domain differs.
- **Event dates** in `content/events.json` are sample data — replace with the
  real upcoming schedule.
