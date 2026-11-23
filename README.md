# growgroup-dashboard

Static GitHub Pages dashboards for SOL Church growth groups. Both pages read the same published Reports and Leaders sheets and share `config.js`, `ministry.js`, `export.js`, `dashboard.js`, and `styles.css`.

- SOL Adult: [index.html](index.html) — https://valiksynogach.github.io/growgroup-dashboard/
- SOL HSM: [hsm.html](hsm.html) — https://valiksynogach.github.io/growgroup-dashboard/hsm.html

A row is SOL HSM only when its own `ministry` cell is `HSM` or `SOL HSM` (any case; spaces, hyphens, and underscores are ignored). `ADULT`, `SOL ADULT`, a blank cell, a missing column, and any other non-HSM value — including older `YOUTH` cells — stay on the SOL Adult page. A report is not reclassified when that leader's current cell changes.

The adult page is Ukrainian. The HSM page is English. On an HSM leader card, `friend_group` is the friend-group answer; a blank cell falls back to `members`. The adult page shows `members` only.

Download data on either page exports only that ministry. CSV is the reports in the chosen dates. The Markdown file is a paste-ready summary of the current leaders (members and friend group) plus those reports.

GitHub Pages publishes the `main` branch from `/`. Merging to `main` updates the live site. No Pages setting change is required for `hsm.html`.
