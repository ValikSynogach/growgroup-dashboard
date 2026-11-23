# growgroup-dashboard

Static GitHub Pages dashboards for SOL Church growth groups. Both pages read the same published Reports and Leaders sheets and share `config.js`, `ministry.js`, `dashboard.js`, and `styles.css`.

- SOL Youth: [index.html](index.html) — https://valiksynogach.github.io/growgroup-dashboard/
- SOL HSM: [hsm.html](hsm.html) — https://valiksynogach.github.io/growgroup-dashboard/hsm.html

A row is SOL HSM only when its own `ministry` cell is `HSM` or `SOL HSM` (any case; spaces, hyphens, and underscores are ignored). Blank, `YOUTH`, `SOL YOUTH`, a missing column, and any other value stay on the youth page. A report is not reclassified when that leader's current cell changes.

The youth page is Ukrainian. The HSM page is English. On an HSM leader card, `friend_group` is the friend-group answer; a blank cell falls back to `members`. The youth page shows `members` only.

GitHub Pages publishes the `main` branch from `/`. Merging to `main` updates the live site. No Pages setting change is required for `hsm.html`.
