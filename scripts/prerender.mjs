// Prerender the portfolio to static HTML so the content is visible without JavaScript
// (recruiter tools, link previews, search engines, AI fetchers).
//
// Usage: npm install && npm run prerender
// Run it again after editing data.js or v3-studio.jsx, then commit index.html.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import babel from "@babel/core";

const require = createRequire(import.meta.url);
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// ---- 1. Load data.js and the component in a sandbox that looks like a browser window ----
const sandbox = { React, console };
sandbox.window = sandbox;
vm.createContext(sandbox);

// Clock shows the visitor's live time once JS runs; static copy shows a neutral placeholder.
vm.runInContext(`Date.prototype.toLocaleTimeString = function () { return "--:--"; };`, sandbox);

vm.runInContext(read("data.js"), sandbox, { filename: "data.js" });
const jsx = babel.transformSync(read("v3-studio.jsx"), {
  filename: "v3-studio.jsx",
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  babelrc: false,
  configFile: false,
}).code;
vm.runInContext(jsx, sandbox, { filename: "v3-studio.jsx" });

const D = sandbox.PORTFOLIO;
const appHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(sandbox.StudioPortfolio));

// ---- 2. Case-study details (normally only shown in the click-to-open modal) ----
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const caseStudies = (D.projects || [])
  .map((p) => {
    const parts = [`<article><h3>${esc(p.name)}</h3>`];
    if (p.sub) parts.push(`<p><em>${esc(p.sub)}</em></p>`);
    if (p.summary) parts.push(`<p>${esc(p.summary)}</p>`);
    if (p.problem) parts.push(`<h4>Problem</h4><p>${esc(p.problem)}</p>`);
    if (p.approach?.length) parts.push(`<h4>Approach</h4><ul>${p.approach.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`);
    if (p.results?.length)
      parts.push(`<h4>Results</h4><ul>${p.results.map((r) => `<li>${esc(r.k)}: ${esc(r.v)}${r.note ? ` (${esc(r.note)})` : ""}</li>`).join("")}</ul>`);
    if (p.stack?.length) parts.push(`<p>Stack: ${p.stack.map(esc).join(", ")}</p>`);
    if (p.links?.length)
      parts.push(`<p>${p.links.map((l) => `<a href="${esc(l.href || l.url)}">${esc(l.label || l.href || l.url)}</a>`).join(" · ")}</p>`);
    parts.push(`</article>`);
    return parts.join("");
  })
  .join("\n");

const noscript = `<noscript><section class="st-noscript" aria-label="Project case studies"><h2>Project case studies</h2>\n${caseStudies}\n</section></noscript>`;

// ---- 3. Head metadata for previews and search ----
const siteUrl = `https://${D.site}/`;
const description = D.summary.split(". ").slice(0, 2).join(". ").replace(/\.?$/, ".");
const sameAs = [D.linkedin, D.github].filter(Boolean).map((u) => (u.startsWith("http") ? u : `https://${u}`));
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: D.name,
  jobTitle: D.role,
  url: siteUrl,
  email: `mailto:${D.email}`,
  address: { "@type": "PostalAddress", addressLocality: D.location },
  sameAs,
  description: D.summary,
};
const head = [
  `<meta name="description" content="${esc(description)}" />`,
  `<link rel="canonical" href="${siteUrl}" />`,
  `<meta property="og:type" content="profile" />`,
  `<meta property="og:title" content="${esc(`${D.name}, ${D.role}`)}" />`,
  `<meta property="og:description" content="${esc(description)}" />`,
  `<meta property="og:url" content="${siteUrl}" />`,
  `<meta name="twitter:card" content="summary" />`,
  `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
].join("\n  ");

// ---- 4. Inject into each entry page between markers (idempotent) ----
const inject = (html, start, end, content, anchorRe, place) => {
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  const block = `${start}\n${content}\n${end}`;
  if (re.test(html)) return html.replace(re, () => block);
  return html.replace(anchorRe, (m) => (place === "after" ? `${m}\n  ${block}` : `${block}\n  ${m}`));
};

for (const file of ["index.html", "Portfolio.html"]) {
  if (!fs.existsSync(path.join(ROOT, file))) continue;
  let html = read(file);
  html = inject(html, "<!--prerender:head-->", "<!--/prerender:head-->", `  ${head}\n  `, /<link rel="preconnect"[^>]*\/>/, "before");
  const app = `<!--prerender:app-->${appHtml}<!--/prerender:app-->`;
  const ns = `<!--prerender:noscript-->\n  ${noscript}\n  <!--/prerender:noscript-->`;
  if (html.includes("<!--prerender:app-->")) {
    html = html.replace(/<!--prerender:app-->[\s\S]*?<!--\/prerender:app-->/, () => app);
    html = html.replace(/<!--prerender:noscript-->[\s\S]*?<!--\/prerender:noscript-->/, () => ns);
  } else if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', () => `<div id="root">${app}</div>\n  ${ns}`);
  } else {
    throw new Error(`${file}: no empty #root or prerender markers found`);
  }
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log(`prerendered ${file}: ${appHtml.length} chars of markup`);
}
