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
    skills: "skills.txt",
    education: "education.json",
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

            <StDivider label="§ 04" title="skills & education" file="skills.txt" />
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
    { f: "skills.txt",     k: "txt", id: "skills" },
    { f: "education.json",   k: "json", id: "education" },
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
          <a className="uline" href="uploads/Rishabh_Jain_Resume_2026-04.pdf" target="_blank" rel="noreferrer">resume.pdf ↗</a>
        </div>
      </div>

      <div className="st-side-foot mono">
        <span style={{ color: "var(--fg-3)" }}>v</span>2026.04
      </div>
    </aside>
  );
}

function FileGlyph3({ kind }) {
  const map = { md: "M", log: "L", dir: "▸", toml: "T", yml: "Y", txt: "T", json: "J", sh: "$" };
  const cmap = { md: "var(--info)", log: "var(--warn)", dir: "var(--accent)", toml: "var(--fg-1)", yml: "var(--fg-1)", txt: "var(--fg-1)", json: "var(--warn)", sh: "var(--accent)" };
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
            <span style={{ color: "var(--fg-3)" }}>cell · readme · 04/26</span>
          </div>
          <h1 className="st-h1">
            {D.role} at the
            <br />
            <span className="st-h1-accent">intersection of</span>
            <br />
            <span className="st-h1-accent">LLMs and robots.</span>
          </h1>
          <p className="st-hero-lede">
            I'm <strong>{D.name}</strong> — bridging enterprise integration and applied ML.
            4+ years shipping things to production: invoice intelligence, recommendation systems,
            and now voice-controlled robotics at Maynooth.
          </p>
          <div className="st-hero-meta">
            <div className="st-meta-row">
              <span className="st-meta-k mono">based</span>
              <span>{D.location}</span>
            </div>
            <div className="st-meta-row">
              <span className="st-meta-k mono">status</span>
              <span style={{ color: "var(--accent)" }}>● open to AI/ML roles · location-flexible</span>
            </div>
            <div className="st-meta-row">
              <span className="st-meta-k mono">studies</span>
              <span>MSc Robotics &amp; Embedded AI · Maynooth</span>
            </div>
          </div>
          <div className="st-hero-cta">
            <a href={`mailto:${D.email}`} className="st-btn-primary">say hello →</a>
            <button className="st-btn-ghost mono" onClick={onJumpWork}>see work <span className="kbd">↓</span></button>
          </div>
        </div>

        <aside className="st-hero-r">
          <div className="st-abstract">
            <div className="st-abstract-head mono">// abstract</div>
            <p className="st-abstract-body">
              AI Engineer with 4+ years bridging Enterprise Integration and Artificial Intelligence.
              Specialized in <em>Generative AI</em>, <em>Large Language Models</em>, and
              <em> Computer Vision</em>. Currently pursuing MSc in Robotics and Embedded AI with
              foundations in Deep Learning, NLP, and AI system deployment.
            </p>
            <div className="st-keywords mono">
              keywords: <span>LLMs</span>, <span>RAG</span>, <span>computer vision</span>,
              <span> embedded AI</span>, <span>ROS2</span>
            </div>
          </div>

          <div className="st-anim">
            <div className="st-anim-head mono">// figure 1 · behaviour tree · live tick</div>
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
function StFeatured({ D, onOpen }) {
  const featured = D.projects.filter((p) => p.featured);
  return (
    <div className="st-featured">
      {featured.map((p, i) => (
        <article key={p.id} className={`st-figure ${p.thesis ? "st-figure-thesis" : ""}`}>
          <div className="st-figure-head mono">
            <span style={{ color: "var(--fg-3)" }}>fig. {String(i + 1).padStart(2, "0")}</span>
            <span style={{ color: "var(--fg-2)" }}>·</span>
            <span style={{ color: "var(--accent)" }}>{p.kind}</span>
            {p.thesis && <span className="tag accent" style={{ marginLeft: 8 }}>● active thesis</span>}
            <span className="st-figure-yr">{p.year}</span>
          </div>
          <div className="st-figure-grid">
            <div className="st-figure-l">
              <div className="st-figure-img">
                {p.id === "growmate" ? <StGrowMateDemo />
                  : p.id === "depthlens" ? <StDepthDemo />
                  : <StGeekNaviDemo />}
              </div>
              <div className="st-figure-cap mono">
                <span style={{ color: "var(--fg-3)" }}>caption.</span>{" "}
                {p.id === "growmate"
                  ? "speech → intent classification (Gemma 3 4B) → typed-node behaviour tree → safety-checked ROS2 publish."
                  : p.id === "depthlens"
                  ? "monocular depth + YOLOv8 detections → metric distances → VLM scene description for visually impaired users."
                  : "audio lecture → Whisper transcript → hierarchical summary + auto-generated quiz, all timestamp-linked."}
              </div>
            </div>
            <div className="st-figure-r">
              <h2 className="st-figure-title">{p.name}</h2>
              <div className="st-figure-sub mono">{p.sub}</div>
              <p className="st-figure-summary">{p.summary}</p>

              {p.supervisor && (
                <div className="st-thesis-meta mono">
                  <div><span style={{ color: "var(--fg-3)" }}>supervisor.</span> {p.supervisor}</div>
                  <div><span style={{ color: "var(--fg-3)" }}>institution.</span> {p.institution}</div>
                </div>
              )}

              <div className="st-figure-tags">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>

              <div className="st-cta-row">
                <button className="st-link-btn mono" onClick={() => onOpen(p)}>
                  read more <span>↗</span>
                </button>
                {p.hasDemo && D.links.geeknavi_demo && D.links.geeknavi_demo !== "#" && (
                  <a className="st-demo-link mono" href={D.links.geeknavi_demo} target="_blank" rel="noreferrer">
                    ▶ try live demo
                  </a>
                )}
                {p.hasHF && D.links.depthlens_hf && (
                  <a className="st-demo-link mono" href={D.links.depthlens_hf} target="_blank" rel="noreferrer">
                    ▶ try live demo
                  </a>
                )}
                {p.thesis && D.links.growmate_paper && (
                  <a className="st-demo-link mono" href={D.links.growmate_paper} target="_blank" rel="noreferrer">
                    📄 read paper (PDF)
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
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
    { l: "speech", v: "“water the tomatoes”" },
    { l: "intent", v: "{action: water, target: tomatoes}" },
    { l: "tree", v: "Sequence → check_bounds → check_plant → MOVE → WATER" },
    { l: "safety", v: "✓ in workspace · ✓ plant exists" },
    { l: "ros2", v: "→ /keyboard_topic [M 400 200 -100, D W 1, D W 0]" },
  ];
  return (
    <div className="st-gm-frame">
      <div className="st-gm-tree mono">
        <div className="st-gm-node st-gm-root">root <span className="st-gm-status">Sequence</span></div>
        <div className="st-gm-children">
          {[
            { t: "check_bounds", k: "safety", active: step >= 3 },
            { t: "check_plant_found", k: "safety", active: step >= 3 },
            { t: "move_to(tomato)", k: "action", active: step >= 4 },
            { t: "water_action", k: "action", active: step >= 4 },
          ].map((n, i) => (
            <div key={i} className={`st-gm-node st-gm-child st-gm-${n.k} ${n.active ? "is-active" : ""}`}>
              {n.t}
            </div>
          ))}
        </div>
      </div>
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

// GEEKNAVI — lecture summariser
function StGeekNaviDemo() {
  return (
    <div className="st-gn-frame">
      <div className="st-gn-head mono">
        <span style={{ color: "var(--accent)" }}>● rec</span>
        <span>lecture_03 · backprop.mp3</span>
        <span style={{ marginLeft: "auto", color: "var(--fg-3)" }}>42:18</span>
      </div>
      <div className="st-gn-wave">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="st-gn-bar" style={{ height: `${20 + Math.abs(Math.sin(i * 0.7) * 60)}%`, opacity: i < 30 ? 1 : 0.3 }} />
        ))}
      </div>
      <div className="st-gn-out">
        <div className="st-gn-block">
          <div className="st-gn-block-h mono">▾ summary · §1 chain rule</div>
          <div className="st-gn-block-b">Backprop is the chain rule applied node-by-node through a computation graph; gradients flow backward via local Jacobians.</div>
        </div>
        <div className="st-gn-block">
          <div className="st-gn-block-h mono">▾ quiz · auto-generated</div>
          <div className="st-gn-quiz mono">
            <div className="st-gn-q">Q. What does backprop compute?</div>
            <div className="st-gn-a"><span style={{ color: "var(--accent)" }}>○</span> the chain-rule gradient w.r.t. each weight</div>
            <div className="st-gn-a"><span style={{ color: "var(--fg-3)" }}>○</span> the forward pass activations</div>
          </div>
        </div>
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

// MedBot demo
function StMedDemo() {
  return (
    <div className="st-mb-frame">
      <div className="st-mb-msg st-mb-q mono">
        <span style={{ color: "var(--fg-3)" }}>Q.</span> What's a safe ibuprofen dose for an adult?
      </div>
      <div className="st-mb-flow mono">
        <span>retriever</span><span>→</span>
        <span style={{ color: "var(--accent)" }}>k=3</span><span>→</span>
        <span>med-palm</span><span>→</span>
        <span>cite-or-reject</span>
      </div>
      <div className="st-mb-msg st-mb-a mono">
        <span style={{ color: "var(--fg-3)" }}>A.</span> 200–400mg every 4–6h, max 1200mg/day OTC
        <sup style={{ color: "var(--accent)" }}> [1]</sup>. Consult a clinician for chronic use.
        <sup style={{ color: "var(--accent)" }}> [2]</sup>
      </div>
      <div className="st-mb-srcs mono">
        <span>[1] FDA Drug Label · ibuprofen monograph · sim 0.91</span>
        <span>[2] NICE clinical guideline · NG193 · sim 0.84</span>
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
          {p.hasHF && D.links.depthlens_hf && (
            <a
              className="st-hf-pill mono"
              href={D.links.depthlens_hf}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              🤗 HF Space ↗
            </a>
          )}
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
      </div>
      <div className="st-se-r" id="sec-education">
        <div className="st-se-head mono">// education</div>
        {D.education.map((ed, i) => (
          <div key={i} className="st-edu">
            <div className="st-edu-period mono">{ed.period}</div>
            <div className="st-edu-degree">{ed.degree}</div>
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
          Open to AI/ML engineering roles — full-time, on-site or remote, location-flexible.
          Whether it's GenAI, computer vision, classical ML, applied research, or robotics
          that ships — if it's real work solving real problems, I'd love to talk.
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
        <a className="st-contact-row" href="uploads/Rishabh_Jain_Resume_2026-04.pdf" target="_blank" rel="noreferrer">
          <span className="mono st-contact-k">resume</span>
          <span className="st-contact-v">Rishabh_Jain_Resume_2026-04.pdf</span>
          <span className="mono st-contact-a">↗</span>
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
      <span>built with care in Dublin</span>
      <span style={{ color: "var(--fg-3)" }}>·</span>
      <span>last commit · apr 2026</span>
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
          {p.results && <>
            <h3 className="st-h3 mono">// preliminary results</h3>
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
        </div>
      </div>
    </div>
  );
}

window.StudioPortfolio = StudioPortfolio;
