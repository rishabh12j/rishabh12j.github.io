/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ============== TerminalPortfolio (v1) ==============
// IDE-flavored layout. Sidebar file-tree, command-palette feel, dense info.

function TerminalPortfolio() {
  const D = window.PORTFOLIO;
  const [active, setActive] = useState("readme");
  const [openProject, setOpenProject] = useState(null);
  const [time, setTime] = useState(() => fmtClock());

  useEffect(() => {
    const id = setInterval(() => setTime(fmtClock()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { id: "readme", label: "README.md", kind: "md" },
    { id: "experience", label: "experience.log", kind: "log" },
    { id: "projects", label: "projects/", kind: "dir" },
    { id: "skills", label: "skills.toml", kind: "toml" },
    { id: "education", label: "education.yml", kind: "yml" },
    { id: "contact", label: "contact.sh", kind: "sh" },
  ];

  return (
    <div className="terminal-shell mono">
      <TopChrome time={time} D={D} />
      <div className="t-body">
        <Sidebar active={active} setActive={setActive} tabs={tabs} D={D} />
        <main className="t-main scroll">
          <TabBar tabs={tabs} active={active} setActive={setActive} />
          <div className="t-content">
            {active === "readme" && <ReadmePane D={D} />}
            {active === "experience" && <ExperiencePane D={D} />}
            {active === "projects" && <ProjectsPane D={D} onOpen={setOpenProject} />}
            {active === "skills" && <SkillsPane D={D} />}
            {active === "education" && <EducationPane D={D} />}
            {active === "contact" && <ContactPane D={D} />}
          </div>
        </main>
      </div>
      <StatusBar D={D} active={active} />
      {openProject && <ProjectDrawer p={openProject} onClose={() => setOpenProject(null)} />}
    </div>
  );
}

function fmtClock() {
  const d = new Date();
  return d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// -------- Top chrome --------
function TopChrome({ time, D }) {
  return (
    <div className="t-chrome">
      <div className="t-chrome-l">
        <span className="dot dot-red" />
        <span className="dot dot-amber" />
        <span className="dot dot-green" />
        <span className="t-chrome-title">~/{slug(D.name)} — zsh — 142×38</span>
      </div>
      <div className="t-chrome-r">
        <span className="tag">main</span>
        <span className="tag accent">● live</span>
        <span style={{ color: "var(--fg-2)", fontSize: 11 }}>{time} IST · Dublin</span>
      </div>
    </div>
  );
}

function slug(s) { return s.toLowerCase().replace(/\s+/g, "-"); }

// -------- Sidebar --------
function Sidebar({ active, setActive, tabs, D }) {
  return (
    <aside className="t-sidebar">
      <div className="t-side-section">
        <div className="t-side-head">EXPLORER</div>
        <div className="t-tree">
          <div className="t-tree-row t-tree-folder">
            <Caret open /> <span className="t-folder">~ portfolio</span>
          </div>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`t-tree-row t-tree-file ${active === t.id ? "is-active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              <FileGlyph kind={t.kind} />
              <span>{t.label}</span>
            </button>
          ))}
          <div className="t-tree-row t-tree-folder" style={{ marginTop: 8 }}>
            <Caret /> <span className="t-folder">.config/</span>
          </div>
          <div className="t-tree-row t-tree-folder">
            <Caret /> <span className="t-folder">archive/</span>
          </div>
        </div>
      </div>

      <div className="t-side-section">
        <div className="t-side-head">NOW PLAYING</div>
        <div className="t-now">
          {D.now.map((n, i) => (
            <div key={i} className="t-now-row">
              <span style={{ color: "var(--accent)" }}>›</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="t-side-section">
        <div className="t-side-head">CONNECT</div>
        <div className="t-connect">
          <a className="uline" href={`mailto:${D.email}`}>{D.email}</a>
          <a className="uline" href={`https://${D.linkedin}`} target="_blank" rel="noreferrer">{D.linkedin}</a>
          <span style={{ color: "var(--fg-2)" }}>{D.phone}</span>
        </div>
      </div>
    </aside>
  );
}

function Caret({ open }) {
  return (
    <span style={{ color: "var(--fg-3)", fontSize: 10, width: 12, display: "inline-block" }}>
      {open ? "▾" : "▸"}
    </span>
  );
}

function FileGlyph({ kind }) {
  const map = { md: "M", log: "L", dir: "▸", toml: "T", yml: "Y", sh: "$" };
  const colorMap = { md: "var(--info)", log: "var(--warn)", dir: "var(--accent)", toml: "var(--fg-1)", yml: "var(--fg-1)", sh: "var(--accent)" };
  return (
    <span className="t-fglyph" style={{ color: colorMap[kind] }}>
      {map[kind] || "·"}
    </span>
  );
}

// -------- Tabs row --------
function TabBar({ tabs, active, setActive }) {
  const t = tabs.find((t) => t.id === active);
  return (
    <div className="t-tabbar">
      <div className="t-tab is-active">
        <FileGlyph kind={t.kind} />
        <span>{t.label}</span>
        <span className="t-tab-x">×</span>
      </div>
      <div className="t-breadcrumb">
        <span>~</span>
        <span style={{ color: "var(--fg-3)" }}>/</span>
        <span>portfolio</span>
        <span style={{ color: "var(--fg-3)" }}>/</span>
        <span style={{ color: "var(--fg)" }}>{t.label}</span>
      </div>
    </div>
  );
}

// -------- README pane (hero) --------
function ReadmePane({ D }) {
  return (
    <div className="pane">
      <div className="t-hero">
        <div className="t-hero-prompt">
          <span style={{ color: "var(--accent)" }}>rishabh@dublin</span>
          <span style={{ color: "var(--fg-3)" }}>:</span>
          <span style={{ color: "var(--info)" }}>~</span>
          <span style={{ color: "var(--fg-3)" }}>$ </span>
          <span>cat README.md</span>
        </div>

        <div className="t-md">
          <div className="t-md-h1"># {D.name}</div>
          <div className="t-md-meta">
            <span className="tag accent">role: {D.role}</span>
            <span className="tag">based: {D.location}</span>
            <span className="tag">status: open to roles</span>
          </div>

          <p className="t-lede">
            {D.tagline} Currently bridging enterprise integration and applied ML — shipping things to production,
            not just notebooks.
          </p>

          <div className="t-md-h2">## now</div>
          <ul className="t-bullets">
            {D.now.map((n, i) => <li key={i}>{n}</li>)}
          </ul>

          <div className="t-md-h2">## impact</div>
          <div className="t-stats">
            {D.stats.map((s) => (
              <div key={s.k} className="t-stat">
                <div className="t-stat-v">{s.v}</div>
                <div className="t-stat-k">{s.k.replace(/_/g, " ")}</div>
                <div className="t-stat-n">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="t-md-h2">## quickstart</div>
          <CodeBlock lines={[
            { n: 1, t: "# clone the human" },
            { n: 2, t: `git clone https://${D.linkedin}` },
            { n: 3, t: "cd portfolio && open projects/" },
            { n: 4, t: "" },
            { n: 5, t: "# or just say hi" },
            { n: 6, t: `mail -s "let's talk" ${D.email}` },
          ]}/>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ lines, lang = "bash" }) {
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span style={{ color: "var(--fg-3)" }}>~/portfolio</span>
        <span style={{ color: "var(--fg-2)" }}>{lang}</span>
      </div>
      <div className="codeblock-body">
        {lines.map((l, i) => (
          <div key={i} className="codeblock-line">
            <span className="codeblock-n">{String(l.n).padStart(2, "0")}</span>
            <span className="codeblock-t" dangerouslySetInnerHTML={{ __html: highlight(l.t) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function highlight(s) {
  if (!s) return "&nbsp;";
  return s
    .replace(/(#.*)$/g, '<span style="color: var(--fg-3)">$1</span>')
    .replace(/^(\w+)/, '<span style="color: var(--accent)">$1</span>')
    .replace(/("[^"]*")/g, '<span style="color: var(--warn)">$1</span>');
}

// -------- Experience pane --------
function ExperiencePane({ D }) {
  return (
    <div className="pane">
      <div className="pane-h"># experience.log <span className="pane-h-sub">— ordered descending, stderr piped to /dev/null</span></div>

      <div className="t-timeline">
        {D.experience.map((e, i) => (
          <div key={e.id} className="t-tl-row">
            <div className="t-tl-rail">
              <div className="t-tl-dot" />
              {i < D.experience.length - 1 && <div className="t-tl-line" />}
            </div>
            <div className="t-tl-card">
              <div className="t-tl-head">
                <div>
                  <div className="t-tl-role">{e.role}</div>
                  <div className="t-tl-company">@ {e.company}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="t-tl-period">{e.period}</div>
                  <div className="t-tl-loc">{e.location}</div>
                </div>
              </div>
              <ul className="t-tl-bullets">
                {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
              <div className="t-tl-tags">
                {e.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------- Projects pane --------
function ProjectsPane({ D, onOpen }) {
  const featured = D.projects.filter((p) => p.featured);
  const rest = D.projects.filter((p) => !p.featured);

  return (
    <div className="pane">
      <div className="pane-h"># projects/ <span className="pane-h-sub">— ls -la, sorted by ./featured</span></div>

      <div className="t-featured">
        {featured.map((p) => <FeaturedCard key={p.id} p={p} onOpen={() => onOpen(p)} />)}
      </div>

      <div className="t-md-h2" style={{ marginTop: 28 }}>## also shipped</div>
      <div className="t-proj-list">
        {rest.map((p) => (
          <button key={p.id} className="t-proj-row" onClick={() => onOpen(p)}>
            <div className="t-proj-row-l">
              <span className="t-proj-row-n mono">{p.name}</span>
              <span className="t-proj-row-sub">{p.sub}</span>
            </div>
            <div className="t-proj-row-tags">
              {p.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
            <div className="t-proj-row-y mono">{p.year}</div>
            <div className="t-proj-row-arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ p, onOpen }) {
  return (
    <div className="t-feat">
      <div className="t-feat-l">
        {p.id === "depthlens" ? <DepthLensDemo /> : <MedBotDemo />}
      </div>
      <div className="t-feat-r">
        <div className="t-feat-meta">
          <span className="tag accent">{p.kind}</span>
          <span className="tag">{p.year}</span>
        </div>
        <div className="t-feat-name">{p.name}</div>
        <div className="t-feat-sub">{p.sub}</div>
        <p className="t-feat-summary">{p.summary}</p>
        <div className="t-feat-tags">
          {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        <button className="t-btn" onClick={onOpen}>
          <span>read case study</span>
          <span className="kbd">⏎</span>
        </button>
      </div>
    </div>
  );
}

// Live-ish DepthLens demo placeholder
function DepthLensDemo() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const detections = [
    { id: 1, label: "person", conf: 0.94, x: 22, y: 30, w: 28, h: 56, depth: 1.4 },
    { id: 2, label: "chair", conf: 0.81, x: 58, y: 52, w: 22, h: 30, depth: 2.1 },
    { id: 3, label: "doorway", conf: 0.76, x: 76, y: 14, w: 20, h: 70, depth: 3.6 },
  ];
  return (
    <div className="dl-demo">
      <div className="dl-frame dotgrid">
        {/* depth gradient sky */}
        <div className="dl-depth" />
        {detections.map((d, i) => (
          <div key={d.id} className="dl-box" style={{
            left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%`,
            animationDelay: `${i * 0.4}s`,
          }}>
            <div className="dl-box-tag mono">
              {d.label} · {d.conf.toFixed(2)} · {d.depth}m
            </div>
          </div>
        ))}
        <div className="dl-overlay-tl mono">depth_anything_v2 · yolov8n · vlm-1.3b</div>
        <div className="dl-overlay-br mono">
          <span className="dot dot-green" /> 24 fps · 18 ms latency
        </div>
        <div className="dl-caption mono">
          <span style={{ color: "var(--accent)" }}>›</span>
          {" "}person at 1.4m, chair to your right at 2.1m, doorway ahead{t > 2 ? "." : "_"}
        </div>
      </div>
    </div>
  );
}

function MedBotDemo() {
  return (
    <div className="dl-demo">
      <div className="mb-frame">
        <div className="mb-msg mb-user">
          <div className="mb-tag mono">user</div>
          <div>What's a safe ibuprofen dose for an adult?</div>
        </div>
        <div className="mb-msg mb-bot">
          <div className="mb-tag mono">medbot · grounded</div>
          <div>
            For most adults, 200–400mg every 4–6 hours, max 1200mg/day OTC.
            <span className="mb-cite mono">[1]</span>
          </div>
          <div className="mb-srcs mono">
            <span>[1] FDA Drug Label · ibuprofen monograph</span>
            <span>retrieval score 0.91 · k=3</span>
          </div>
        </div>
        <div className="mb-status mono">
          <span className="dot dot-green" /> RAG · 3 sources · grounded
        </div>
      </div>
    </div>
  );
}

// -------- Project drawer (case study) --------
function ProjectDrawer({ p, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="t-drawer-bg" onClick={onClose}>
      <div className="t-drawer scroll" onClick={(e) => e.stopPropagation()}>
        <div className="t-drawer-head">
          <div className="t-drawer-name">
            <span style={{ color: "var(--fg-3)" }}>projects/</span>{p.id}.md
          </div>
          <button className="t-drawer-x" onClick={onClose}>esc ×</button>
        </div>

        <div className="t-drawer-body">
          <div className="t-md-meta">
            <span className="tag accent">{p.kind}</span>
            <span className="tag">{p.year}</span>
            {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="t-md-h1"># {p.name}</div>
          <div className="t-feat-sub" style={{ marginTop: -4 }}>{p.sub}</div>
          <p className="t-lede">{p.summary}</p>

          {p.problem && <>
            <div className="t-md-h2">## problem</div>
            <p>{p.problem}</p>
          </>}

          {p.approach && <>
            <div className="t-md-h2">## approach</div>
            <ul className="t-bullets">
              {p.approach.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </>}

          {p.stack && <>
            <div className="t-md-h2">## stack</div>
            <div className="t-feat-tags">
              {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

// -------- Skills pane --------
function SkillsPane({ D }) {
  return (
    <div className="pane">
      <div className="pane-h"># skills.toml</div>
      <CodeBlock lang="toml" lines={tomlLines(D.skills)} />
      <div className="t-md-h2">## certifications</div>
      <div className="t-certs">
        {D.certifications.map((c, i) => (
          <div key={i} className="t-cert">
            <span style={{ color: "var(--accent)" }}>◆</span>
            <span>{c.name}</span>
            <span style={{ color: "var(--fg-3)" }}>·</span>
            <span style={{ color: "var(--fg-2)" }}>{c.by}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function tomlLines(skills) {
  const lines = [];
  let n = 1;
  Object.entries(skills).forEach(([cat, arr], i) => {
    if (i > 0) { lines.push({ n: n++, t: "" }); }
    lines.push({ n: n++, t: `[${cat.toLowerCase().replace(/[^a-z0-9]+/g, "_")}]` });
    arr.forEach((item, j) => {
      lines.push({ n: n++, t: `  s${j + 1}  =  "${item}"` });
    });
  });
  return lines;
}

// -------- Education --------
function EducationPane({ D }) {
  return (
    <div className="pane">
      <div className="pane-h"># education.yml</div>
      <div className="t-edu">
        {D.education.map((ed, i) => (
          <div key={i} className="t-edu-row">
            <div className="t-edu-period mono">{ed.period}</div>
            <div className="t-edu-card">
              <div className="t-edu-degree">{ed.degree}</div>
              <div className="t-edu-school">{ed.school} <span style={{ color: "var(--fg-3)" }}>· {ed.location}</span></div>
              {ed.coursework && (
                <div className="t-edu-cw">
                  {ed.coursework.map((c) => <span key={c} className="tag">{c}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------- Contact --------
function ContactPane({ D }) {
  return (
    <div className="pane">
      <div className="pane-h"># contact.sh <span className="pane-h-sub">— pick your channel</span></div>
      <CodeBlock lang="bash" lines={[
        { n: 1, t: "#!/bin/bash" },
        { n: 2, t: "# preferred order: email > linkedin > carrier pigeon" },
        { n: 3, t: "" },
        { n: 4, t: `mail "${D.email}"` },
        { n: 5, t: `open "https://${D.linkedin}"` },
        { n: 6, t: `# based in ${D.location} · open to EU roles + relocation` },
      ]} />
      <div className="t-contact-grid">
        <a className="t-contact-card" href={`mailto:${D.email}`}>
          <div className="t-contact-k mono">email</div>
          <div className="t-contact-v">{D.email}</div>
          <div className="t-contact-go mono">→ compose</div>
        </a>
        <a className="t-contact-card" href={`https://${D.linkedin}`} target="_blank" rel="noreferrer">
          <div className="t-contact-k mono">linkedin</div>
          <div className="t-contact-v">{D.linkedin}</div>
          <div className="t-contact-go mono">→ open</div>
        </a>
        <a className="t-contact-card" href="uploads/Rishabh_Jain_Resume_2026-04.pdf" download>
          <div className="t-contact-k mono">resume</div>
          <div className="t-contact-v">Rishabh_Jain_Resume_2026-04.pdf</div>
          <div className="t-contact-go mono">→ download</div>
        </a>
      </div>
    </div>
  );
}

// -------- Status bar --------
function StatusBar({ D, active }) {
  return (
    <div className="t-status mono">
      <div className="t-status-l">
        <span style={{ color: "var(--accent)" }}>● ready</span>
        <span>·</span>
        <span>~/portfolio</span>
        <span>·</span>
        <span>{active}</span>
      </div>
      <div className="t-status-r">
        <span>UTF-8</span>
        <span>·</span>
        <span>LF</span>
        <span>·</span>
        <span>spaces: 2</span>
        <span>·</span>
        <span>Ln 42, Col 7</span>
      </div>
    </div>
  );
}

window.TerminalPortfolio = TerminalPortfolio;
