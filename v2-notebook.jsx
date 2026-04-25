/* global React */
const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

// ============== NotebookPortfolio (v2) ==============
// Jupyter / research-paper feel. Wider columns, figure captions, citation footnotes.

function NotebookPortfolio() {
  const D = window.PORTFOLIO;
  const [openProject, setOpenProject] = useState2(null);
  return (
    <div className="nb-shell">
      <NbTopNav D={D} />
      <main className="nb-main scroll">
        <NbHero D={D} />
        <NbDivider label="§ 1" title="featured work" />
        <NbFeatured D={D} onOpen={setOpenProject} />
        <NbDivider label="§ 2" title="experience" />
        <NbExperience D={D} />
        <NbDivider label="§ 3" title="other projects" />
        <NbProjectGrid D={D} onOpen={setOpenProject} />
        <NbDivider label="§ 4" title="skills & education" />
        <NbSkillsEdu D={D} />
        <NbDivider label="§ 5" title="contact" />
        <NbContact D={D} />
        <NbFooter D={D} />
      </main>
      {openProject && <NbProjectModal p={openProject} onClose={() => setOpenProject(null)} />}
    </div>
  );
}

function NbTopNav({ D }) {
  return (
    <nav className="nb-nav mono">
      <div className="nb-nav-l">
        <span style={{ color: "var(--accent)" }}>◇</span>
        <span style={{ fontWeight: 600, color: "var(--fg)" }}>{D.name}</span>
        <span style={{ color: "var(--fg-3)" }}>/</span>
        <span style={{ color: "var(--fg-2)" }}>portfolio.ipynb</span>
      </div>
      <div className="nb-nav-r">
        <a href="#work" className="nb-nav-link">work</a>
        <a href="#experience" className="nb-nav-link">experience</a>
        <a href="#contact" className="nb-nav-link">contact</a>
        <a href="uploads/Rishabh_Jain_Resume_2026-04.pdf" download className="nb-nav-cta">
          resume.pdf →
        </a>
      </div>
    </nav>
  );
}

function NbHero({ D }) {
  return (
    <section className="nb-hero">
      <div className="nb-hero-grid">
        <div className="nb-hero-l">
          <div className="nb-cell-meta mono">
            <span>In&nbsp;[<span style={{ color: "var(--accent)" }}>1</span>]:</span>
            <span style={{ color: "var(--fg-3)" }}>cell · markdown · 04/26</span>
          </div>
          <h1 className="nb-h1">
            {D.role} working on
            <br />
            <span className="nb-h1-accent">production GenAI</span> &amp;
            <br />
            <span className="nb-h1-accent">embedded ML.</span>
          </h1>
          <p className="nb-hero-lede">
            I'm <strong>{D.name}</strong> — currently bridging enterprise integration and applied ML.
            4+ years shipping things to production: invoice intelligence, recommendation systems, and
            now voice-controlled robotics at Maynooth.
          </p>
          <div className="nb-hero-meta">
            <div className="nb-meta-row">
              <span className="nb-meta-k mono">based</span>
              <span>{D.location}</span>
            </div>
            <div className="nb-meta-row">
              <span className="nb-meta-k mono">status</span>
              <span style={{ color: "var(--accent)" }}>● open to AI/ML roles in EU</span>
            </div>
            <div className="nb-meta-row">
              <span className="nb-meta-k mono">studies</span>
              <span>MSc Robotics &amp; Embedded AI · Maynooth University</span>
            </div>
          </div>
          <div className="nb-hero-cta">
            <a href={`mailto:${D.email}`} className="nb-btn-primary">say hello →</a>
            <a href="#work" className="nb-btn-ghost">see work</a>
          </div>
        </div>

        <aside className="nb-hero-r">
          <NbAbstract D={D} />
          <NbStats D={D} />
        </aside>
      </div>
    </section>
  );
}

function NbAbstract({ D }) {
  return (
    <div className="nb-abstract">
      <div className="nb-abstract-head mono">// abstract</div>
      <p className="nb-abstract-body">
        AI Engineer with 4+ years bridging Enterprise Integration and Artificial Intelligence.
        Specialized in <em>Generative AI</em>, <em>Large Language Models</em>, and
        <em> Computer Vision</em>. Currently pursuing MSc in Robotics and Embedded AI at
        Maynooth University with foundations in Deep Learning, NLP, and AI system deployment.
      </p>
      <div className="nb-keywords mono">
        keywords: <span>LLMs</span>, <span>RAG</span>, <span>computer vision</span>,
        <span> embedded AI</span>, <span>ROS2</span>
      </div>
    </div>
  );
}

function NbStats({ D }) {
  return (
    <div className="nb-stats">
      <div className="nb-stats-head mono">// figure 1 · key metrics</div>
      <div className="nb-stats-grid">
        {D.stats.map((s) => (
          <div key={s.k} className="nb-stat">
            <div className="nb-stat-v mono">{s.v}</div>
            <div className="nb-stat-k">{s.k.replace(/_/g, " ")}</div>
            <div className="nb-stat-n">{s.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NbDivider({ label, title }) {
  return (
    <div className="nb-divider" id={title.split(" ")[0]}>
      <div className="nb-divider-l mono">{label}</div>
      <div className="nb-divider-line" />
      <div className="nb-divider-t">{title}</div>
    </div>
  );
}

function NbFeatured({ D, onOpen }) {
  const featured = D.projects.filter((p) => p.featured);
  return (
    <section className="nb-featured" id="work">
      {featured.map((p, i) => (
        <article key={p.id} className="nb-figure">
          <div className="nb-figure-head mono">
            <span style={{ color: "var(--fg-3)" }}>fig. {i + 1}</span>
            <span style={{ color: "var(--fg-2)" }}>·</span>
            <span style={{ color: "var(--accent)" }}>{p.kind}</span>
            <span style={{ color: "var(--fg-3)", marginLeft: "auto" }}>{p.year}</span>
          </div>
          <div className="nb-figure-body">
            <div className="nb-figure-img">
              {p.id === "depthlens" ? <NbDepthLensFig /> : <NbMedBotFig />}
            </div>
            <div className="nb-figure-caption mono">
              <span style={{ color: "var(--fg-3)" }}>caption.</span> {captionFor(p.id)}
            </div>
          </div>

          <div className="nb-figure-meta">
            <h2 className="nb-figure-title">{p.name} <span className="nb-figure-sub">— {p.sub}</span></h2>
            <p className="nb-figure-summary">{p.summary}</p>
            <div className="nb-figure-tags">
              {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
            <button className="nb-link-btn" onClick={() => onOpen(p)}>
              read full case study <span className="mono">↗</span>
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

function captionFor(id) {
  const m = {
    depthlens: "Concurrent VLM caption + monocular depth + YOLOv8 detections, fused into a metric scene graph for assistive audio output.",
    medbot: "RAG response with passage-level citations, retrieval scores surfaced inline so users can trace claims back to source.",
  };
  return m[id] || "";
}

function NbDepthLensFig() {
  return (
    <div className="nb-fig-canvas">
      <div className="nb-fig-grid gridlines" />
      <div className="dl-depth" style={{ borderRadius: 0 }} />
      <svg viewBox="0 0 400 240" className="nb-fig-overlay">
        <rect x="80" y="70" width="60" height="130" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="220" y="120" width="80" height="70" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="310" y="40" width="70" height="170" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="80" y="62" fill="var(--accent)" fontSize="9" fontFamily="JetBrains Mono">person · 1.4m</text>
        <text x="220" y="112" fill="var(--accent)" fontSize="9" fontFamily="JetBrains Mono">chair · 2.1m</text>
        <text x="310" y="32" fill="var(--accent)" fontSize="9" fontFamily="JetBrains Mono">doorway · 3.6m</text>
      </svg>
      <div className="nb-fig-corner mono">depth + objects + caption</div>
    </div>
  );
}

function NbMedBotFig() {
  return (
    <div className="nb-fig-canvas nb-fig-medbot">
      <div className="nb-mb-msg nb-mb-q mono">
        <span style={{ color: "var(--fg-3)" }}>Q:</span> What's a safe ibuprofen dose for an adult?
      </div>
      <div className="nb-mb-flow mono">
        <span>retriever</span><span>→</span><span style={{color:"var(--accent)"}}>k=3</span><span>→</span><span>med-palm</span>
      </div>
      <div className="nb-mb-msg nb-mb-a mono">
        <span style={{ color: "var(--fg-3)" }}>A:</span> 200–400mg every 4–6h, max 1200mg/day OTC <sup style={{color:"var(--accent)"}}>[1]</sup>
      </div>
      <div className="nb-mb-srcs mono">
        [1] FDA Drug Label · ibuprofen monograph · sim 0.91
      </div>
    </div>
  );
}

function NbExperience({ D }) {
  return (
    <section className="nb-exp" id="experience">
      <div className="nb-exp-table">
        <div className="nb-exp-thead mono">
          <span>period</span>
          <span>role</span>
          <span>org · location</span>
          <span>focus</span>
        </div>
        {D.experience.map((e) => (
          <details key={e.id} className="nb-exp-row">
            <summary className="nb-exp-summary">
              <span className="mono nb-exp-period">{e.period}</span>
              <span className="nb-exp-role">{e.role}</span>
              <span className="nb-exp-org">
                <span style={{ color: "var(--fg)" }}>{e.company}</span>
                <span style={{ color: "var(--fg-3)" }}> · {e.location}</span>
              </span>
              <span className="nb-exp-tags">
                {e.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
              </span>
              <span className="nb-exp-toggle mono">+</span>
            </summary>
            <div className="nb-exp-detail">
              <ul className="t-bullets">
                {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <div className="nb-exp-detail-tags">
                {e.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function NbProjectGrid({ D, onOpen }) {
  const rest = D.projects.filter((p) => !p.featured);
  return (
    <section className="nb-grid">
      {rest.map((p) => (
        <button key={p.id} className="nb-grid-card" onClick={() => onOpen(p)}>
          <div className="nb-grid-head mono">
            <span style={{ color: "var(--accent)" }}>{p.kind}</span>
            <span style={{ color: "var(--fg-3)" }}>{p.year}</span>
          </div>
          <div className="nb-grid-name">{p.name}</div>
          <div className="nb-grid-sub mono">{p.sub}</div>
          <p className="nb-grid-summary">{p.summary}</p>
          <div className="nb-grid-tags">
            {p.tags.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="nb-grid-arrow mono">read more →</div>
        </button>
      ))}
    </section>
  );
}

function NbSkillsEdu({ D }) {
  return (
    <section className="nb-se">
      <div className="nb-se-l">
        <div className="nb-se-head mono">// skills</div>
        {Object.entries(D.skills).map(([cat, arr]) => (
          <div key={cat} className="nb-skill-row">
            <div className="nb-skill-cat mono">{cat}</div>
            <div className="nb-skill-items">
              {arr.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        ))}

        <div className="nb-se-head mono" style={{ marginTop: 32 }}>// certifications</div>
        <div className="nb-certs">
          {D.certifications.map((c, i) => (
            <div key={i} className="nb-cert">
              <span className="mono nb-cert-n">[{String(i + 1).padStart(2, "0")}]</span>
              <span>{c.name}</span>
              <span className="mono" style={{ color: "var(--fg-3)" }}>— {c.by}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="nb-se-r">
        <div className="nb-se-head mono">// education</div>
        {D.education.map((ed, i) => (
          <div key={i} className="nb-edu">
            <div className="nb-edu-period mono">{ed.period}</div>
            <div className="nb-edu-degree">{ed.degree}</div>
            <div className="nb-edu-school mono">{ed.school}</div>
            <div className="nb-edu-loc mono">{ed.location}</div>
            {ed.coursework && (
              <div className="nb-edu-cw">
                {ed.coursework.map((c) => <span key={c} className="tag">{c}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function NbContact({ D }) {
  return (
    <section className="nb-contact" id="contact">
      <div className="nb-contact-l">
        <div className="nb-cell-meta mono">
          <span>In&nbsp;[<span style={{ color: "var(--accent)" }}>n</span>]:</span>
          <span style={{ color: "var(--fg-3)" }}>cell · markdown · final</span>
        </div>
        <h2 className="nb-h2">Let's build something useful.</h2>
        <p className="nb-contact-lede">
          I'm looking for AI/ML engineering roles in the EU — full-time, remote-flex.
          If you're working on production GenAI, applied research, or robotics that ships,
          I'd love to talk.
        </p>
      </div>
      <div className="nb-contact-r">
        <a className="nb-contact-row" href={`mailto:${D.email}`}>
          <span className="mono nb-contact-k">email</span>
          <span className="nb-contact-v">{D.email}</span>
          <span className="mono nb-contact-arrow">→</span>
        </a>
        <a className="nb-contact-row" href={`https://${D.linkedin}`} target="_blank" rel="noreferrer">
          <span className="mono nb-contact-k">linkedin</span>
          <span className="nb-contact-v">{D.linkedin}</span>
          <span className="mono nb-contact-arrow">↗</span>
        </a>
        <a className="nb-contact-row" href="uploads/Rishabh_Jain_Resume_2026-04.pdf" download>
          <span className="mono nb-contact-k">resume</span>
          <span className="nb-contact-v">Rishabh_Jain_Resume_2026-04.pdf</span>
          <span className="mono nb-contact-arrow">↓</span>
        </a>
        <div className="nb-contact-row nb-contact-static">
          <span className="mono nb-contact-k">phone</span>
          <span className="nb-contact-v">{D.phone}</span>
        </div>
      </div>
    </section>
  );
}

function NbFooter({ D }) {
  return (
    <footer className="nb-footer mono">
      <span>© 2026 {D.name}</span>
      <span style={{ color: "var(--fg-3)" }}>·</span>
      <span>built with care in Dublin</span>
      <span style={{ color: "var(--fg-3)" }}>·</span>
      <span>last updated apr 2026</span>
    </footer>
  );
}

function NbProjectModal({ p, onClose }) {
  useEffect2(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="nb-modal-bg" onClick={onClose}>
      <div className="nb-modal scroll" onClick={(e) => e.stopPropagation()}>
        <div className="nb-modal-head mono">
          <span><span style={{ color: "var(--fg-3)" }}>case-study/</span>{p.id}.md</span>
          <button onClick={onClose} className="nb-modal-x">close ×</button>
        </div>
        <div className="nb-modal-body">
          <div className="t-md-meta">
            <span className="tag accent">{p.kind}</span>
            <span className="tag">{p.year}</span>
          </div>
          <h2 className="nb-h2">{p.name}</h2>
          <div className="nb-figure-sub" style={{ marginBottom: 16 }}>{p.sub}</div>
          <p className="nb-contact-lede">{p.summary}</p>
          {p.problem && <>
            <h3 className="nb-h3 mono">// problem</h3>
            <p className="nb-p">{p.problem}</p>
          </>}
          {p.approach && <>
            <h3 className="nb-h3 mono">// approach</h3>
            <ul className="t-bullets">{p.approach.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </>}
          {p.stack && <>
            <h3 className="nb-h3 mono">// stack</h3>
            <div className="nb-figure-tags">
              {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

window.NotebookPortfolio = NotebookPortfolio;
