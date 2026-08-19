# Shekhar Sharan Goyal — Research Website

A static, GitHub Pages-ready academic research website inspired by the structure and restraint of modern institutional research portals.

## Deploy to GitHub Pages

1. Back up your current repository.
2. Replace the repository contents with everything in this folder.
3. Commit and push to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.

If the repository is already named `shekharsg.github.io`, the site should appear at your existing GitHub Pages URL after deployment.

## Main files

- `index.html` — research-portal profile landing page
- `about.html` — biography, appointments, education, mentoring, awards and service
- `projects.html` — current research and the three-project PhD research arc
- `publications.html` — filterable publications, datasets and conference outputs
- `visualization.html` — interactive nitrogen-surplus map + data downloads
- `outreach.html` — media, conferences and outreach images
- `contact.html` — contact and profile links
- `style.css` — unified site design
- `script.js` — navigation, filtering and figure lightbox

## Data retained from the previous website

- `india_nsurplus_time.geojson`
- `N_surplus_components.csv`
- `nutrient_budjet_uncertainity_12_values_nca.csv`
- all original files under `images/`
- `Shekhar_cv.pdf`

## Editing

The site is plain HTML/CSS/JavaScript. No build tool is required. Edit text directly in the corresponding `.html` file and push the changes to GitHub.

For local testing, use a local web server because browsers block `fetch()` of the GeoJSON when pages are opened with `file://`.

Example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
