/* global React */
const { useState: useS3, useEffect: useE3, useRef: useR3 } = React;

// ============== StudioPortfolio (v3 — hybrid) ==============
// IDE chrome (v1) + editorial document body (v2).

function StudioPortfolio({ embedded = false }) {
  const D = window.PORTFOLIO;
  const [activeFile, setActiveFile] = useS3("readme.md");
  const [openProject, setOpenProject] = useS3(null);
  const [time, setTime] = useS3(() => fmtClock3());
  const [mumbaiTime, setMumbaiTime] = useS3(() => fmtClock3("Asia/Kolkata"));
  const mainRef = useR3(null);

  useE3(() => {
    const id = setInterval(() => {
      setTime(fmtClock3());
      setMumbaiTime(fmtClock3("Asia/Kolkata"));
    }, 1000 * 30);
    return () => clearInterval(id);
  }, []);

  // section -> file map for breadcrumb sync
  const sectionToFile = {
    readme: "readme.md",
    work: "projects/",
    experience: "experience.log",
    skills: "skills.toml",
    education: "education.yml",
    contact: "contact.sh",
  };

  // observe scroll to update active file in sidebar
  useE3(() => {
    if (!mainRef.current) return;
    const sections = ["readme", "work", "experience", "skills", "education", "contact"];
    const onScroll = () => {
      const root = mainRef.current;
      if (!root) return;
      const top = root.scrollTop + 80;
      let cur = "readme";
      for (const id of sections) {
        const el = root.querySelector(`#sec-${id}`);
        if (el && el.offsetTop <= top) cur = id;
      }
      setActiveFile(sectionToFile[cur]);
    };
    const el = mainRef.current;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id) => {
    const el = mainRef.current?.querySelector(`#sec-${id}`);
    if (el) mainRef.current.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  };

  return (
    <div className="st-shell mono">
      <StTopChrome time={time} mumbaiTime={mumbaiTime} D={D} />
      <div className="st-body">
        <StSidebar D={D} active={activeFile} onJump={jump} />
        <main ref={mainRef} className="st-main scroll">
          <StTabBar active={activeFile} />
          <div className="st-doc">
            <section id="sec-readme"><StHero D={D} onJumpWork={() => jump("work")} /></section>

            <StDivider label="§ 01" title="featured work" file="projects/featured/" />
            <section id="sec-work"><StFeatured D={D} onOpen={setOpenProject} /></section>

            <StDivider label="§ 02" title="experience" file="experience.log" />
            <section><StExperience D={D} /></section>

            <StDivider label="§ 03" title="other projects" file="projects/" />
            <section><StProjectGrid D={D} onOpen={setOpenProject} /></section>

            <StDivider label="§ 04" title="skills & education" file="skills.toml" />
            <section id="sec-skills"><StSkillsEdu D={D} /></section>

            <StDivider label="§ 05" title="contact" file="contact.sh" />
            <section id="sec-contact"><StContact D={D} /></section>

            <StFooter D={D} />
          </div>
        </main>
      </div>
      <StStatusBar D={D} active={activeFile} />
      {openProject && <StProjectModal p={openProject} onClose={() => setOpenProject(null)} />}
    </div>
  );
}

function fmtClock3(tz) {
  return new Date().toLocaleTimeString("en-IE", {
    hour: "2-digit", minute: "2-digit", hour12: false,
    ...(tz ? { timeZone: tz } : {}),
  });
}

// ----- Top chrome -----
function StTopChrome({ time, mumbaiTime, D }) {
  return (
    <div className="st-chrome">
      <div className="st-chrome-l">
        <span className="st-traffic st-tr-r" />
        <span className="st-traffic st-tr-y" />
        <span className="st-traffic st-tr-g" />
        <span className="st-chrome-title">~/{D.name.toLowerCase().replace(/\s+/g, "-")} — portfolio</span>
      </div>
      <div className="st-chrome-c mono">
        <span style={{ color: "var(--fg-3)" }}>⌘</span>
        <span>main</span>
        <span style={{ color: "var(--fg-3)" }}>·</span>
        <span style={{ color: "var(--accent)" }}>● live</span>
      </div>
      <div className="st-chrome-r mono">
        <span>{time}</span>
        <span style={{ color: "var(--fg-3)" }}>Dublin</span>
        <span style={{ color: "var(--fg-3)" }}>·</span>
        <span>{mumbaiTime}</span>
        <span style={{ color: "var(--fg-3)" }}>Mumbai</span>
      </div>
    </div>
  );
}

// ----- Sidebar -----
function StSidebar({ D, active, onJump }) {
  const files = [
    { f: "readme.md",       k: "md",  id: "readme" },
    { f: "projects/",       k: "dir", id: "work" },
    { f: "experience.log",  k: "log", id: "experience" },
    { f: "skills.toml",     k: "toml",id: "skills" },
    { f: "education.yml",   k: "yml", id: "education" },
    { f: "contact.sh",      k: "sh",  id: "contact" },
  ];
  return (
    <aside className="st-sidebar">
      <div className="st-side-section">
        <div className="st-side-head">EXPLORER</div>
        <div className="st-tree">
          <div className="st-tree-row st-tree-folder">
            <span className="st-caret">▾</span>
            <span style={{ color: "var(--fg-1)" }}>~ portfolio</span>
          </div>
          {files.map((f) => (
            <button
              key={f.f}
              className={`st-tree-row st-tree-file ${active === f.f ? "is-active" : ""}`}
              onClick={() => onJump(f.id)}
            >
              <FileGlyph3 kind={f.k} />
              <span>{f.f}</span>
            </button>
          ))}
          <div className="st-tree-row st-tree-folder" style={{ marginTop: 6 }}>
            <span className="st-caret">▸</span>
            <span style={{ color: "var(--fg-2)" }}>.config/</span>
          </div>
          <div className="st-tree-row st-tree-folder">
            <span className="st-caret">▸</span>
            <span style={{ color: "var(--fg-2)" }}>archive/</span>
          </div>
        </div>
      </div>

      <div className="st-side-section">
        <div className="st-side-head">NOW</div>
        <div className="st-now">
          {D.now.map((n, i) => (
            <div key={i} className="st-now-row">
              <span style={{ color: "var(--accent)" }}>›</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="st-side-section">
        <div className="st-side-head">CONNECT</div>
        <div className="st-connect">
          <a className="uline" href={`mailto:${D.email}`}>{D.email}</a>
          <a className="uline" href={`https://${D.linkedin}`} target="_blank" rel="noreferrer">linkedin/in/rishabh12j</a>
          <a className="uline" href={`https://${D.github}`} target="_blank" rel="noreferrer">github/rishabh12j</a>
          <a className="uline" href="Rishabh_Jain_Resume.pdf" download>resume.pdf ↓</a>
        </div>
      </div>

      <div className="st-side-foot mono">
        <span style={{ color: "var(--fg-3)" }}>v</span>2026.10
      </div>
    </aside>
  );
}

function FileGlyph3({ kind }) {
  const map = { md: "M", log: "L", dir: "▸", toml: "T", yml: "Y", sh: "$" };
  const cmap = { md: "var(--info)", log: "var(--warn)", dir: "var(--accent)", toml: "var(--fg-1)", yml: "var(--fg-1)", sh: "var(--accent)" };
  return <span className="st-fglyph" style={{ color: cmap[kind] }}>{map[kind]}</span>;
}

// ----- Tab bar -----
function StTabBar({ active }) {
  return (
    <div className="st-tabbar mono">
      <div className="st-tab is-active">
        <span style={{ color: "var(--accent)" }}>●</span>
        <span>{active}</span>
      </div>
      <div className="st-breadcrumb">
        <span>~</span>
        <span style={{ color: "var(--fg-3)" }}>/</span>
        <span>portfolio</span>
        <span style={{ color: "var(--fg-3)" }}>/</span>
        <span style={{ color: "var(--fg)" }}>{active}</span>
      </div>
    </div>
  );
}

// ----- Hero -----
function StHero({ D, onJumpWork }) {
  return (
    <div className="st-hero">
      <div className="st-hero-grid">
        <div className="st-hero-l">
          <div className="st-cell-meta mono">
            <span>In&nbsp;[<span style={{ color: "var(--accent)" }}>1</span>]:</span>
            <span style={{ color: "var(--fg-3)" }}>cell · readme · 10/26</span>
          </div>
          <div className="st-avail mono"><span className="dot dot-green"></span>available to join immediately</div>
          <h1 className="st-h1">
            {D.role} shipping
            <br />
            <span className="st-h1-accent">production GenAI</span> &amp;
            <br />
            <span className="st-h1-accent">embedded ML.</span>
          </h1>
          <p className="st-hero-lede">
            I'm <strong>{D.name}</strong>. Almost 5 years bridging enterprise integration and production AI
            across GenAI, LLMs, RAG, NLP, and computer vision, engineering deterministic validation and
            guardrails around probabilistic models.
          </p>
          <div className="st-hero-meta">
            <div className="st-meta-row">
              <span className="st-meta-k mono">based</span>
              <span>{D.location}</span>
            </div>
            <div className="st-meta-row">
              <span className="st-meta-k mono">status</span>
              <span style={{ color: "var(--accent)" }}>● {D.statusLine}</span>
            </div>
            <div className="st-meta-row">
              <span className="st-meta-k mono">degree</span>
              <span>MSc Robotics &amp; Embedded AI · Maynooth University</span>
            </div>
            <div className="st-meta-row">
              <span className="st-meta-k mono">cloud</span>
              <span>AWS · GCP</span>
            </div>
          </div>
          <div className="st-hero-cta">
            <a href={`mailto:${D.email}`} className="st-btn-primary">say hello →</a>
            <a href="Rishabh_Jain_Resume.pdf" download className="st-btn-ghost mono">resume.pdf <span className="kbd">↓</span></a>
            <button className="st-btn-ghost mono" onClick={onJumpWork}>see work <span className="kbd">↓</span></button>
          </div>
        </div>

        <aside className="st-hero-r">
          <div className="st-abstract">
            <div className="st-abstract-head mono">// abstract</div>
            <p className="st-abstract-body">{D.summary}</p>
            <div className="st-keywords mono">
              keywords: <span>LLMs</span>, <span>RAG</span>, <span>AI agents</span>,
              <span> guardrails</span>, <span>ROS 2</span>
            </div>
          </div>

          <div className="st-stats">
            <div className="st-stats-head mono">// figure 1 · at a glance</div>
            <div className="st-stats-grid">
              {D.stats.map((s) => (
                <div key={s.k} className="st-stat">
                  <div className="st-stat-v mono">{s.v}</div>
                  <div className="st-stat-k mono">{s.k.replace(/_/g, " ")}</div>
                  <div className="st-stat-n">{s.note}</div>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

// ----- Section divider -----
function StDivider({ label, title, file }) {
  return (
    <div className="st-divider">
      <div className="st-divider-l mono">{label}</div>
      <div className="st-divider-line" />
      <div className="st-divider-t">{title}</div>
      <div className="st-divider-f mono">{file}</div>
    </div>
  );
}

// ----- Featured -----
function StVisual({ kind }) {
  if (kind === "growmate") return <StBTFigure />;
  if (kind === "flowguard") return <StFlowGuardDemo />;
  if (kind === "depthlens") return <StDepthDemo />;
  if (kind === "discord") return <StDiscordDemo />;
  return null;
}

function StLinks({ links }) {
  if (!links || !links.length) return null;
  return links.map((l) => (
    <a key={l.href} className="st-demo-link mono" href={l.href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{l.label}</a>
  ));
}

function StFeatured({ D, onOpen }) {
  const featured = D.projects.filter((p) => p.featured);
  return (
    <div className="st-featured">
      {featured.map((p, i) => (
        <article key={p.id} className={`st-figure ${p.status === "dissertation" ? "st-figure-thesis" : ""}`}>
          <div className="st-figure-head mono">
            <span style={{ color: "var(--fg-3)" }}>fig. {String(i + 1).padStart(2, "0")}</span>
            <span style={{ color: "var(--fg-2)" }}>·</span>
            <span style={{ color: "var(--accent)" }}>{p.kind}</span>
            {p.status && <span className={`tag ${p.status === "in progress" ? "st-tag-wip" : "accent"}`} style={{ marginLeft: 8 }}>● {p.status}</span>}
            <span className="st-figure-yr">{p.year}</span>
          </div>
          <div className="st-figure-grid">
            <div className="st-figure-l">
              <div className="st-figure-img"><StVisual kind={p.visual} /></div>
              <div className="st-figure-cap mono">
                <span style={{ color: "var(--fg-3)" }}>caption.</span> {p.caption}
              </div>
            </div>
            <div className="st-figure-r">
              <h2 className="st-figure-title">{p.name}</h2>
              <div className="st-figure-sub mono">{p.sub}</div>
              <p className="st-figure-summary">{p.summary}</p>
              {p.results && (
                <div className="st-thesis-results">
                  <div className="st-thesis-results-h mono">// results</div>
                  <div className="st-thesis-results-grid">
                    {p.results.map((r) => (
                      <div key={r.k} className="st-tr-cell">
                        <div className="st-tr-v mono">{r.v}</div>
                        <div className="st-tr-k mono">{r.k}</div>
                        <div className="st-tr-n">{r.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="st-figure-tags">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="st-cta-row">
                <button className="st-link-btn mono" onClick={() => onOpen(p)}>read case study <span>↗</span></button>
                <StLinks links={p.links} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// Behaviour tree live-tick figure (used in GrowMate-BT)
function StBTFigure() {
  return (
    <div className="st-anim">
      <div className="st-anim-head mono">// figure 2 · behaviour tree · live tick</div>
      <svg className="st-anim-svg" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <marker id="st-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.45" />
          </marker>
        </defs>
        <g className="st-anim-edges">
          <line x1="180" y1="34" x2="50"  y2="74" markerEnd="url(#st-arrow)" />
          <line x1="180" y1="34" x2="135" y2="74" markerEnd="url(#st-arrow)" />
          <line x1="180" y1="34" x2="220" y2="74" markerEnd="url(#st-arrow)" />
          <line x1="180" y1="34" x2="305" y2="74" markerEnd="url(#st-arrow)" />
          <line x1="305" y1="96" x2="305" y2="124" markerEnd="url(#st-arrow)" />
        </g>
        <g className="st-anim-nodes">
          <g className="st-node st-node-root"><rect x="148" y="12" width="64" height="22" rx="5" /><text x="180" y="23">Sequence</text></g>
          <g className="st-node st-n1"><rect x="10"  y="74"  width="80" height="22" rx="5" /><text x="50"  y="85">check_bounds</text></g>
          <g className="st-node st-n2"><rect x="98"  y="74"  width="74" height="22" rx="5" /><text x="135" y="85">check_plant</text></g>
          <g className="st-node st-n3"><rect x="184" y="74"  width="72" height="22" rx="5" /><text x="220" y="85">move_to</text></g>
          <g className="st-node st-n4"><rect x="270" y="74"  width="70" height="22" rx="5" /><text x="305" y="85">water</text></g>
          <g className="st-node st-n5 st-leaf"><rect x="252" y="124" width="106" height="22" rx="5" /><text x="305" y="135">/keyboard_topic</text></g>
        </g>
        <g className="st-anim-caption mono">
          <text x="0"   y="170">tick →</text>
          <text x="50"  y="170" className="st-c1">check_bounds</text>
          <text x="135" y="170" className="st-c2">check_plant</text>
          <text x="220" y="170" className="st-c3">move_to</text>
          <text x="305" y="170" className="st-c4">water ✓</text>
        </g>
      </svg>
    </div>
  );
}

// GrowMate — behaviour tree visualisation
function StGrowMateDemo() {
  const [step, setStep] = useS3(0);
  useE3(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 5), 1100);
    return () => clearInterval(id);
  }, []);
  const stages = [
    { l: "speech", v: "\u201cwater the tomatoes\u201d" },
    { l: "intent", v: "{action: water, target: tomatoes}" },
    { l: "tree", v: "Sequence \u2192 check_bounds \u2192 check_plant \u2192 MOVE \u2192 WATER" },
    { l: "safety", v: "\u2713 in workspace \u00b7 \u2713 plant exists" },
    { l: "ros2", v: "\u2192 /keyboard_topic [M 400 200 -100, D W 1, D W 0]" },
  ];
  const nodes = [
    { x: 6,   label: "check_bounds", on: step >= 3 },
    { x: 105, label: "check_plant",  on: step >= 3 },
    { x: 204, label: "move_to",      on: step >= 4 },
    { x: 303, label: "water",        on: step >= 4 },
  ];
  const NW = 91, rootX = 154, rootCx = rootX + 46;
  const cxOf = (n) => n.x + NW / 2;
  const busL = cxOf(nodes[0]);
  const busR = cxOf(nodes[nodes.length - 1]);
  return (
    <div className="st-gm-frame">
      <svg className="st-gm-svg" viewBox="0 0 400 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g className="st-gm-edges">
          <path className="st-gm-edge" d={`M ${rootCx} 30 V 38`} />
          <path className="st-gm-edge" d={`M ${busL} 38 H ${busR}`} />
          {nodes.map((n, i) => (
            <path key={i} d={`M ${cxOf(n)} 38 V 44`} className={n.on ? "st-gm-edge is-on" : "st-gm-edge"} />
          ))}
        </g>
        <g className="st-gm-svg-node st-gm-svg-root">
          <rect x={rootX} y="6" width="92" height="24" rx="5" />
          <text x={rootCx} y="18">Sequence</text>
        </g>
        {nodes.map((n, i) => (
          <g key={i} className={n.on ? "st-gm-svg-node is-on" : "st-gm-svg-node"}>
            <rect x={n.x} y="44" width={NW} height="24" rx="5" />
            <text x={n.x + NW / 2} y="56">{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="st-gm-pipeline mono">
        {stages.map((s, i) => (
          <div key={i} className={`st-gm-stage ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`}>
            <div className="st-gm-stage-l">{s.l}</div>
            <div className="st-gm-stage-v">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// FlowGuard — investigation workflow
function StFlowGuardDemo() {
  const [step, setStep] = useS3(0);
  useE3(() => {
    const id = setInterval(() => setStep((x) => (x + 1) % 7), 1100);
    return () => clearInterval(id);
  }, []);
  const steps = [
    { k: "triage", v: "orders-sync · HTTP 502 spike · sev2" },
    { k: "evidence", v: "app logs · runbook RB-14 · API spec v3" },
    { k: "trace", v: "orders-sync → pricing-api → erp-connector" },
    { k: "root cause", v: "deploy #418 changed auth header schema" },
    { k: "remediate", v: "rollback #418 · rotate connector token" },
    { k: "approval", v: "awaiting on-call engineer" },
  ];
  return (
    <div className="st-fg-frame mono">
      <div className="st-fg-head">
        <span style={{ color: "var(--warn)" }}>▲ incident</span>
        <span>INC-2291</span>
        <span style={{ marginLeft: "auto", color: "var(--fg-3)" }}>scoped tools · audit on</span>
      </div>
      <div className="st-fg-steps">
        {steps.map((s, i) => (
          <div key={s.k} className={`st-fg-step ${i < step ? "is-done" : ""} ${i === step ? "is-active" : ""}`}>
            <span className="st-fg-mark">{i < step ? "✓" : i === step ? "›" : "·"}</span>
            <span className="st-fg-k">{s.k}</span>
            <span className="st-fg-v">{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Discord moderator — masked action policy
function StDiscordDemo() {
  const [m, setM] = useS3(0);
  useE3(() => {
    const id = setInterval(() => setM((x) => (x + 1) % 3), 2200);
    return () => clearInterval(id);
  }, []);
  const msgs = [
    { lang: "es", tox: 0.82, inf: 1, p: [0.04, 0.21, 0.58, 0.17, 0], mask: [0, 0, 0, 0, 1], pick: 2 },
    { lang: "hi", tox: 0.12, inf: 0, p: [0.91, 0.09, 0, 0, 0], mask: [0, 0, 1, 1, 1], pick: 0 },
    { lang: "de", tox: 0.95, inf: 4, p: [0, 0.02, 0.18, 0.31, 0.49], mask: [1, 0, 0, 0, 0], pick: 4 },
  ];
  const acts = ["allow", "warn", "delete", "timeout", "ban"];
  const cur = msgs[m];
  return (
    <div className="st-dm-frame mono">
      <div className="st-dm-head">
        <span>obs ∈ ℝ<sup>403</sup></span>
        <span className="tag">lang: {cur.lang}</span>
        <span className="tag">xlm-r tox: {cur.tox.toFixed(2)}</span>
        <span className="tag">infractions: {cur.inf}</span>
      </div>
      <div className="st-dm-bars">
        {acts.map((a, i) => (
          <div key={a} className={`st-dm-row ${cur.mask[i] ? "is-masked" : ""} ${cur.pick === i ? "is-pick" : ""}`}>
            <span className="st-dm-a">{a}</span>
            <span className="st-dm-track"><span className="st-dm-fill" style={{ width: `${cur.p[i] * 100}%` }}></span></span>
            <span className="st-dm-p">{cur.mask[i] ? "masked" : cur.p[i].toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Live DepthLens-ish demo
function StDepthDemo() {
  const [tick, setTick] = useS3(0);
  useE3(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="st-dl-frame dotgrid">
      <div className="st-dl-depth" />
      <div className="st-dl-box" style={{ left: "12%", top: "28%", width: "22%", height: "58%" }}>
        <div className="st-dl-tag mono">person · 0.94 · 1.4m</div>
      </div>
      <div className="st-dl-box" style={{ left: "44%", top: "52%", width: "22%", height: "32%" }}>
        <div className="st-dl-tag mono">chair · 0.81 · 2.1m</div>
      </div>
      <div className="st-dl-box" style={{ left: "72%", top: "12%", width: "22%", height: "72%" }}>
        <div className="st-dl-tag mono">doorway · 0.76 · 3.6m</div>
      </div>
      <div className="st-dl-tl mono">depth_anything_v2 · yolov8n · vlm-1.3b</div>
      <div className="st-dl-br mono"><span className="dot dot-green" /> 24 fps · 18 ms</div>
      <div className="st-dl-cap mono">
        <span style={{ color: "var(--accent)" }}>›</span>{" "}
        person at 1.4m, chair to your right at 2.1m, doorway ahead{tick % 2 ? "_" : "."}
      </div>
    </div>
  );
}

// ----- Experience -----
function StExperience({ D }) {
  return (
    <div className="st-exp">
      <div className="st-exp-thead mono">
        <span>period</span>
        <span>role</span>
        <span>org · location</span>
        <span>focus</span>
        <span></span>
      </div>
      {D.experience.map((e) => (
        <details key={e.id} className="st-exp-row">
          <summary className="st-exp-summary">
            <span className="mono st-exp-period">{e.period}</span>
            <span className="st-exp-role">{e.role}</span>
            <span className="st-exp-org">
              <span style={{ color: "var(--fg)" }}>{e.company}</span>
              <span className="mono" style={{ color: "var(--fg-3)" }}> · {e.location}</span>
            </span>
            <span className="st-exp-tags">
              {e.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
            </span>
            <span className="st-exp-toggle mono">+</span>
          </summary>
          <div className="st-exp-detail">
            {e.context && <p className="st-exp-context">{e.context}</p>}
            <ul className="t-bullets">
              {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="st-exp-detail-tags">
              {e.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

// ----- Project grid -----
function StProjectGrid({ D, onOpen }) {
  const rest = D.projects.filter((p) => !p.featured);
  return (
    <div className="st-grid">
      {rest.map((p) => (
        <article
          key={p.id}
          className="st-card"
          role="button"
          tabIndex={0}
          onClick={() => onOpen(p)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(p))}
        >
          <div className="st-card-head mono">
            <span style={{ color: "var(--accent)" }}>{p.kind}</span>
            <span style={{ color: "var(--fg-3)" }}>{p.year}</span>
          </div>
          <div className="st-card-name">{p.name}</div>
          <div className="st-card-sub mono">{p.sub}</div>
          <p className="st-card-summary">{p.summary}</p>
          <div className="st-card-tags">
            {p.tags.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          {p.links && p.links.length > 0 && <div className="st-cta-row" style={{ marginBottom: 10 }}><StLinks links={p.links} /></div>}
          <div className="st-card-arrow mono">read more →</div>
        </article>
      ))}
    </div>
  );
}

// ----- Skills + Education -----
function StSkillsEdu({ D }) {
  return (
    <div className="st-se">
      <div className="st-se-l">
        <div className="st-se-head mono">// skills</div>
        {Object.entries(D.skills).map(([cat, arr]) => (
          <div key={cat} className="st-skill-row">
            <div className="st-skill-cat mono">{cat}</div>
            <div className="st-skill-items">
              {arr.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        ))}
        <div className="st-se-head mono" style={{ marginTop: 28 }}>// certifications</div>
        <div className="st-certs">
          {D.certifications.map((c, i) => (
            <div key={i} className="st-cert">
              <span className="mono st-cert-n">[{String(i + 1).padStart(2, "0")}]</span>
              <span>{c.name}</span>
              <span className="mono" style={{ color: "var(--fg-3)" }}>— {c.by}</span>
            </div>
          ))}
        </div>
        {D.languages && (
          <>
            <div className="st-se-head mono" style={{ marginTop: 28 }}>// languages</div>
            <div className="st-skill-items">
              {D.languages.map((l) => <span key={l.name} className="tag">{l.name} · {l.level}</span>)}
            </div>
          </>
        )}
      </div>
      <div className="st-se-r" id="sec-education">
        <div className="st-se-head mono">// education</div>
        {D.education.map((ed, i) => (
          <div key={i} className="st-edu">
            <div className="st-edu-period mono">{ed.period}</div>
            <div className="st-edu-degree">{ed.degree}</div>
            {ed.honours && <div className="st-edu-hon mono">◆ {ed.honours}</div>}
            <div className="st-edu-school mono">{ed.school}</div>
            <div className="st-edu-loc mono">{ed.location}</div>
            {ed.coursework && (
              <div className="st-edu-cw">
                {ed.coursework.map((c) => <span key={c} className="tag">{c}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----- Contact -----
function StContact({ D }) {
  return (
    <div className="st-contact">
      <div className="st-contact-l">
        <div className="st-cell-meta mono">
          <span>In&nbsp;[<span style={{ color: "var(--accent)" }}>n</span>]:</span>
          <span style={{ color: "var(--fg-3)" }}>cell · final</span>
        </div>
        <h2 className="st-h2">Let's build something useful.</h2>
        <p className="st-contact-lede">
          Based in India, open to relocation, and available to join immediately.
          If you're hiring for applied AI, LLM systems, or production ML, I'd like to hear about it.
        </p>
      </div>
      <div className="st-contact-r">
        <a className="st-contact-row" href={`mailto:${D.email}`}>
          <span className="mono st-contact-k">email</span>
          <span className="st-contact-v">{D.email}</span>
          <span className="mono st-contact-a">→</span>
        </a>
        <a className="st-contact-row" href={`https://${D.linkedin}`} target="_blank" rel="noreferrer">
          <span className="mono st-contact-k">linkedin</span>
          <span className="st-contact-v">{D.linkedin}</span>
          <span className="mono st-contact-a">↗</span>
        </a>
        <a className="st-contact-row" href={`https://${D.github}`} target="_blank" rel="noreferrer">
          <span className="mono st-contact-k">github</span>
          <span className="st-contact-v">{D.github}</span>
          <span className="mono st-contact-a">↗</span>
        </a>
        <a className="st-contact-row" href="Rishabh_Jain_Resume.pdf" download>
          <span className="mono st-contact-k">resume</span>
          <span className="st-contact-v">Rishabh_Jain_Resume.pdf</span>
          <span className="mono st-contact-a">↓</span>
        </a>
        <div className="st-contact-row st-contact-static">
          <span className="mono st-contact-k">phone</span>
          <span className="st-contact-v">{D.phone}</span>
        </div>
      </div>
    </div>
  );
}

function StFooter({ D }) {
  return (
    <footer className="st-footer mono">
      <span>© 2026 {D.name}</span>
      <span style={{ color: "var(--fg-3)" }}>·</span>
      <span>built in Indore</span>
      <span style={{ color: "var(--fg-3)" }}>·</span>
      <span>last commit · oct 2026</span>
    </footer>
  );
}

// ----- Status bar -----
function StStatusBar({ D, active }) {
  return (
    <div className="st-status mono">
      <div className="st-status-l">
        <span style={{ color: "var(--accent)" }}>● ready</span>
        <span>·</span>
        <span>~/portfolio</span>
        <span>·</span>
        <span>{active}</span>
      </div>
      <div className="st-status-r">
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

// ----- Project modal -----
function StProjectModal({ p, onClose }) {
  useE3(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="st-modal-bg" onClick={onClose}>
      <div className="st-modal scroll" onClick={(e) => e.stopPropagation()}>
        <div className="st-modal-head mono">
          <span><span style={{ color: "var(--fg-3)" }}>case-study/</span>{p.id}.md</span>
          <button onClick={onClose} className="st-modal-x">esc ×</button>
        </div>
        <div className="st-modal-body">
          <div className="st-md-meta">
            <span className="tag accent">{p.kind}</span>
            <span className="tag">{p.year}</span>
          </div>
          <h2 className="st-h2">{p.name}</h2>
          <div className="st-figure-sub mono" style={{ marginBottom: 16 }}>{p.sub}</div>
          <p className="st-contact-lede">{p.summary}</p>
          {p.problem && <>
            <h3 className="st-h3 mono">// problem</h3>
            <p className="st-p">{p.problem}</p>
          </>}
          {p.approach && <>
            <h3 className="st-h3 mono">// approach</h3>
            <ul className="t-bullets">{p.approach.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </>}
          {p.results && p.results.length > 0 && <>
            <h3 className="st-h3 mono">// results</h3>
            <div className="st-thesis-results-grid" style={{ marginTop: 12 }}>
              {p.results.map((r) => (
                <div key={r.k} className="st-tr-cell">
                  <div className="st-tr-v mono">{r.v}</div>
                  <div className="st-tr-k mono">{r.k}</div>
                  <div className="st-tr-n">{r.note}</div>
                </div>
              ))}
            </div>
          </>}
          {p.authors && <>
            <h3 className="st-h3 mono">// authors</h3>
            <p className="st-p">{p.authors}</p>
          </>}
          {p.supervisor && <>
            <h3 className="st-h3 mono">// supervision</h3>
            <p className="st-p">
              <strong>{p.supervisor}</strong> · {p.institution}
            </p>
          </>}
          {p.sdg && <>
            <h3 className="st-h3 mono">// broader impact</h3>
            <div className="st-figure-tags">{p.sdg.map((s) => <span key={s} className="tag accent">{s}</span>)}</div>
          </>}
          {p.stack && <>
            <h3 className="st-h3 mono">// stack</h3>
            <div className="st-figure-tags">
              {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </>}
          {p.links && p.links.length > 0 && <div className="st-cta-row" style={{ marginTop: 22 }}><StLinks links={p.links} /></div>}
        </div>
      </div>
    </div>
  );
}

window.StudioPortfolio = StudioPortfolio;
