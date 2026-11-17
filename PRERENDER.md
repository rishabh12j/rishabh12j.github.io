# Static prerender: what changed and how to maintain it

## The problem

`index.html` used to ship an empty `<div id="root"></div>`. React and in-browser Babel built every word of the page in the visitor's browser, so anything that reads HTML without running JavaScript saw only the title:

- recruiter tools and ATS parsers that fetch a portfolio link
- LinkedIn, Slack and WhatsApp link previews
- search engine first passes
- AI assistants fetching the URL

## Before and after

| | Before | After |
| --- | --- | --- |
| Text in raw HTML | Title only | Full page, about 2,200 words |
| Project case studies | Only inside click-to-open modals | Also in a `<noscript>` block |
| Meta description | None | First sentence of `summary` (154 chars) |
| Link previews (Open Graph) | None | Title, description, URL |
| Structured data | None | schema.org `Person` (JSON-LD) |
| Canonical URL | None | `https://rishabh12j.github.io/` |
| Look and behaviour with JS on | Unchanged | Unchanged |

## File-by-file differences

### `index.html` and `Portfolio.html` (modified, identical to each other)

Three generated blocks, each wrapped in comment markers so the build can replace them safely on every run:

1. `<!--prerender:head-->`: meta description, canonical link, Open Graph tags, Twitter card and JSON-LD, inserted after `<title>`.
2. `<!--prerender:app-->` inside `#root`: the static HTML of `StudioPortfolio`, produced by the same component and data the browser uses. When JavaScript runs, React's `createRoot` replaces it with the live version, so the clocks tick, the sidebar tracks scroll position and the modals open as before.
3. `<!--prerender:noscript-->` after `#root`: every project's problem, approach, results, stack and links. Browsers with JavaScript never show it; text extractors read it.

The clocks in the static copy show `--:--` so a frozen build-time time is never displayed.

Nothing else in these files changed: same scripts, same SRI hashes, same stylesheet links.

### `scripts/prerender.mjs` (new)

The build step. It:

1. Loads `data.js` and `v3-studio.jsx` in a Node sandbox that imitates `window`.
2. Compiles the JSX with Babel and renders `StudioPortfolio` with `react-dom/server`.
3. Builds the case-study and metadata blocks from `window.PORTFOLIO`.
4. Replaces the marker blocks in `index.html` and `Portfolio.html`.

It is idempotent: running it twice gives byte-identical output.

### `package.json` and `package-lock.json` (new)

Pin the build-only dependencies: `react@18.3.1` and `react-dom@18.3.1` (the same versions the page loads from unpkg), plus `@babel/core` and `@babel/preset-react`. None of this is loaded by the live site. `node_modules/` is already in `.gitignore`.

## How to maintain it

Run the build after any edit to `data.js` or `v3-studio.jsx`, then commit the regenerated HTML:

```sh
npm install          # first time only
npm run prerender
git add index.html Portfolio.html
git commit -m "Update portfolio"
```

If you skip this, the live JavaScript version shows your new content but the static copy (what recruiters' tools see) stays on the old version.

## Things to watch

- **Re-exporting from Claude Design** overwrites `index.html` with the empty-root version. Run `npm run prerender` afterwards; the script detects the empty `<div id="root"></div>` and rebuilds the markers.
- **New browser-only code in components** (for example `document` or `localStorage` read during render rather than inside `useEffect`) will make the build fail with an error. Move it into `useEffect`, which does not run during prerender.
- **Theme toggle**: the prerendered page uses the default `data-theme="dark"`, matching what the live page starts with.

## Not changed (possible follow-up)

The live page still loads React development builds and in-browser Babel (about 3 MB) and compiles the JSX on every visit. Compiling the JSX in this same build step and switching to React's production builds would cut load time substantially.
