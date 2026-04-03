# PSU Geosciences Graduate Symposium Website

Website for the **Penn State Department of Geosciences Annual Graduate Symposium**, hosted on GitHub Pages.

🔗 **Live site:** [https://psugeograd.github.io/colloquium/](https://psugeograd.github.io/colloquium/)

## Overview

A static HTML site for the 58th Annual Graduate Symposium (April 16–17, 2026). It provides event information, abstract submission guidelines, schedules, judging rules, awards, and committee contacts.

## Project Structure

```
colloquium/
├── CNAME                   # Custom domain config for GitHub Pages
├── index.html              # Home page
├── abstracts.html          # Abstract booklets (current & past years)
├── submit.html             # Abstract & contest submission instructions
├── rules.html              # Rules and judging guidelines
├── schedule.html           # Event schedule (speaker popups)
├── awards.html             # Awards information
├── contact.html            # Committee members and contacts
├── search.html             # Live search across all pages
├── assets/
│   ├── css/theme.css       # Site theme styles
│   ├── data/
│   │   └── abstracts-20XX.csv  # Abstract used by schedule popup
│   └── js/
│       ├── templates.js    # Shared sidebar injection & mobile toggle
│       ├── livesearch.js   # Client-side search functionality
│       └── schedule-popup.js  # CSV loader + popup rendering for schedule
├── includes/
│   └── sidebar.html        # Sidebar navigation (loaded by templates.js)
├── downloads/              # PDF files (abstracts, rubrics, schedules)
└── images/                 # Site images
```

## Dependencies (CDN)

| Library                                         | Version | Purpose                                        |
| ----------------------------------------------- | ------- | ---------------------------------------------- |
| [Bootstrap](https://getbootstrap.com/docs/3.4/) | 3.4.1   | Responsive layout & components                 |
| [jQuery](https://jquery.com/)                   | 3.7.1   | DOM manipulation (required by Bootstrap)       |
| [Google Fonts](https://fonts.google.com/)       | —       | Open Sans (body) & Source Serif Pro (headings) |

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
- **Downloads** — Add PDFs to `downloads/` using the naming convention `type-year.pdf` (e.g., `abstracts-20XX.pdf`, `schedule-20XX.pdf`, `rubric-20XX.pdf`).

### Adding abstract CSV data

The speaker popup content on `schedule.html` is loaded from `assets/data/abstracts-20XX.csv` by `assets/js/schedule-popup.js`.

1. Open `assets/data/abstracts-20XX.csv`.
2. Keep the header row exactly as:

    `name,title,authors,institutions,abstract`

3. Add one presentation per row.
4. A popup is attached to schedule cells whose presenter text matches `name`.
    - Matching ignores case, extra spaces, accents, and trailing `(virtual)`.
    - If multiple CSV rows have the same normalized `name`, the last row in the CSV is used.
5. If a field contains commas or line breaks, wrap that field in double quotes.
6. Escape literal double quotes inside a quoted field by doubling them (`""`).
7. Save as UTF-8 (recommended) with standard CSV formatting.
8. `\n` (backslash + n) is also interpreted as a line break in popup text.

Example row structure:

```csv
name,title,authors,institutions,abstract
Jane Doe,"Example Title with, comma","Jane Doe^{1}","^{1}Department Name\nUniversity Name","First paragraph.\nSecond paragraph with CO_{2} and ^{13}C."
```

### Text formatting supported in CSV fields

Before display in the popup, text is HTML-escaped and then these markers are applied:

- `^{...}` -> superscript (`<sup>`)
- `_{...}` -> subscript (`<sub>`)
- `*{...}` -> italic (`<i>`)

Line breaks are rendered in the popup, so multiline `institutions` and `abstract` fields are supported.

### If you add a new year

- Add a new file such as `assets/data/abstracts-20XX.csv`.
- Update `CSV_PATH` in `assets/js/schedule-popup.js` to point to that file.
- Keep the same headers and formatting rules above.

## Deployment

The site is deployed automatically via **GitHub Pages** from the `master` branch. Push changes to `master` and the site updates within a few minutes.
