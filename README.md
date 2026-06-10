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

Content (events, menu, art exhibits) is edited through **Sveltia CMS** at
`/admin/`. It commits changes straight to this GitHub repo, which redeploys the
site. Editors sign in with their **GitHub account** (they must have write access
to the repo).

One-time OAuth setup (so the "Sign in with GitHub" button works):

1. **Create a GitHub OAuth app** — GitHub → *Settings → Developer settings →
   OAuth Apps → New OAuth App*:
   - Application name: `BeanRunner CMS`
   - Homepage URL: your Netlify site URL (e.g. `https://bean-runner-v1.netlify.app`)
   - Authorization callback URL: **`https://api.netlify.com/auth/done`**
   - Register, then copy the **Client ID** and generate a **Client Secret**.
2. **Register it in Netlify** — *Site configuration → Access control → OAuth →
   Authentication providers → Install provider → GitHub*, paste the Client ID and
   Secret.
3. Go to `https://<your-site>/admin/`, click **Sign in with GitHub**, authorize,
   and you're in.

To add another editor, add them as a collaborator on the GitHub repo. Netlify
Identity / Git Gateway are no longer used and can be disabled.

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
