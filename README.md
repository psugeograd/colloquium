# PSU Geosciences Graduate Symposium Website

Website for the **Penn State Department of Geosciences Annual Graduate Symposium**, hosted on GitHub Pages.

🔗 **Live site:** [https://psugeograd.github.io/colloquium/](https://psugeograd.github.io/colloquium/)

## Overview

A static HTML site for the 58th Annual Graduate Symposium (April 16–17, 2026). It provides event information, abstract submission guidelines, schedules, judging rules, awards, and committee contacts.

## Project Structure

```
colloquium/
├── index.html              # Home page
├── abstracts.html          # Abstract booklets (current & past years)
├── submit.html             # Abstract & contest submission instructions
├── rules.html              # Rules and judging guidelines
├── schedule.html           # Event schedule
├── awards.html             # Awards information
├── contact.html            # Committee members and contacts
├── search.html             # Live search across all pages
├── assets/
│   ├── css/theme.css       # Site theme styles
│   └── js/
│       ├── templates.js    # Shared sidebar injection & mobile toggle
│       └── livesearch.js   # Client-side search functionality
├── includes/
│   └── sidebar.html        # Sidebar navigation (loaded by templates.js)
├── downloads/              # PDF files (abstracts, rubrics, schedules)
└── images/                 # Site images
```

## Dependencies (CDN)

| Library | Version | Purpose |
|---------|---------|---------|
| [Bootstrap](https://getbootstrap.com/docs/3.4/) | 3.4.1 | Responsive layout & components |
| [jQuery](https://jquery.com/) | 3.7.1 | DOM manipulation (required by Bootstrap) |
| [Google Fonts](https://fonts.google.com/) | — | Open Sans (body) & Source Serif Pro (headings) |

No build tools, package managers, or local dependencies required.

## Local Development

To preview the site locally, run a simple HTTP server from the project root:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

> **Note:** Opening HTML files directly via `file://` will not work because the sidebar is loaded via `fetch()`.

## Updating Content

- **Pages** — Edit the root-level `.html` files directly.
- **Sidebar navigation** — Edit `includes/sidebar.html`.
- **Styles** — Edit `assets/css/theme.css`.
- **Downloads** — Add PDFs to `downloads/` using the naming convention `type-year.pdf` (e.g., `abstracts-2026.pdf`, `schedule-2026.pdf`, `rubric-2026.pdf`).

## Deployment

The site is deployed automatically via **GitHub Pages** from the `master` branch. Push changes to `master` and the site updates within a few minutes.
