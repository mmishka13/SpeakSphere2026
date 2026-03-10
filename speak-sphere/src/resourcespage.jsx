import { useState, useRef, useEffect } from "react";
import SpanishCourseOverview from "./spanishcourseoverview.jsx";

/* ═══════════════════════════════════════════════════════════════
   SPEAKSPHERE — Resources
   Lesson 2.3: The Present Subjunctive (Spanish · Intermediate)

   DESIGN: Dark Academia editorial — like a hand-annotated
   textbook page. Rich typographic hierarchy, marginalia-style
   callouts, ink-stained progress spine, glowing quiz cards.
   Khan Academy's linear lesson flow × literary aesthetics.
═══════════════════════════════════════════════════════════════ */

const DARK   = "#0d0702";
const CARD   = "#1b0f06";
const CARD2  = "#1f1108";
const GOLD   = "#d4a843";
const GOLDLT = "#f0cc55";
const CREAM  = "#f5ede0";
const MUTED  = "#c8aa80";
const DIM    = "#a08050";
const BORD   = "rgba(212,168,67,0.20)";
const BODY   = "#c8aa80";
const A_GREEN  = "#a8855a";
const A_BLUE   = "#c4956a";
const A_ROSE   = "#8a6440";
const A_AMBER  = "#d4a96a";
const A_VIOLET = "#b8956e";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

/* ── LESSON SECTIONS (ids for progress tracking) ── */
const SECTIONS = [
  { id:"intro",    label:"Introduction",    icon:"◈" },
  { id:"concept",  label:"What & Why",      icon:"◉" },
  { id:"conjugate",label:"Conjugation",     icon:"◈" },
  { id:"weirdos",  label:"WEIRDOS Triggers",icon:"◉" },
  { id:"video",    label:"Video Lesson",    icon:"▶" },
  { id:"examples", label:"Examples",        icon:"◈" },
  { id:"practice", label:"PDF Practice",    icon:"⬡" },
  { id:"quiz",     label:"Quiz",            icon:"◉" },
];

/* ── QUIZ DATA ── */
const QUIZ = [
  {
    q: "Which sentence correctly uses the present subjunctive?",
    opts: [
      "Quiero que tú vengas a la fiesta.",
      "Quiero que tú vienes a la fiesta.",
      "Quiero que tú venir a la fiesta.",
      "Quiero tú vengas a la fiesta.",
    ],
    ans: 0,
    explain: "After querer + que + different subject, the subjunctive is required. \"Vengas\" is the tú form of venir in the present subjunctive.",
  },
  {
    q: "What does the acronym W.E.I.R.D.O. stand for in the subjunctive?",
    opts: [
      "Words, Emotions, Instances, Requirements, Doubts, Observations",
      "Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá",
      "Wishes, Expressions, Irregular, Requests, Denial, Observations",
      "Wants, Errors, Instances, Rules, Doubts, Options",
    ],
    ans: 1,
    explain: "W.E.I.R.D.O. = Wishes, Emotions, Impersonal expressions, Recommendations/Requests, Doubt/Denial/Disbelief, Ojalá — the six main triggers for the subjunctive.",
  },
  {
    q: "To form the present subjunctive of hablar (yo hablo), what is the stem?",
    opts: ["habla-", "hablo-", "habl-", "habler-"],
    ans: 2,
    explain: "Take the yo form (hablo), remove the -o → habl-. Then add the opposite vowel endings: hable, hables, hable, hablemos, habléis, hablen.",
  },
  {
    q: "Which expression does NOT trigger the subjunctive?",
    opts: [
      "Es importante que...",
      "Ojalá que...",
      "Sé que...",
      "Me alegra que...",
    ],
    ans: 2,
    explain: "\"Sé que...\" (I know that...) expresses certainty, so it uses the indicative. The other three all introduce doubt, emotion, or wishes — W.E.I.R.D.O. triggers.",
  },
  {
    q: "Translate: \"I hope that she speaks more slowly.\"",
    opts: [
      "Espero que ella habla más despacio.",
      "Espero que ella hable más despacio.",
      "Espero ella hable más despacio.",
      "Espero que ella hablar más despacio.",
    ],
    ans: 1,
    explain: "\"Espero que\" (Wishes) + different subject triggers the subjunctive: hable (ella form of hablar in subjunctive). The conjunction \"que\" is also required.",
  },
  {
    q: "Which is the correct nosotros subjunctive form of tener?",
    opts: ["tenemos", "tengamos", "tenamos", "teniemos"],
    ans: 1,
    explain: "Tener has an irregular yo form: tengo. Remove -o → teng-. Add the nosotros subjunctive ending -amos → tengamos.",
  },
];

/* ── PDF RESOURCES ── */
const PDFS = [
  {
    title:"Present Subjunctive Conjugation Charts",
    desc:"Full conjugation tables for regular -AR, -ER, -IR verbs plus 12 common irregulars with the WEIRDOS mnemonic reference.",
    pages:4, level:"Intermediate", color:A_BLUE,
    url:"/pdf_conjugation_charts.pdf",
  },
  {
    title:"WEIRDOS Trigger Phrases — Fill-in Worksheet",
    desc:"Practice sentences for all six W.E.I.R.D.O. categories. Write the correct subjunctive form, then check with the answer key.",
    pages:6, level:"Intermediate", color:GOLD,
    url:"/pdf_weirdos_worksheet.pdf",
  },
  {
    title:"Indicative vs. Subjunctive — Contrast Drills",
    desc:"Side-by-side sentence pairs showing when to switch from indicative to subjunctive. 40 practice sentences with explanations.",
    pages:8, level:"Intermediate", color:A_GREEN,
    url:"/pdf_indicative_subjunctive_drills.pdf",
  },
  {
    title:"Ojalá & Espero Que — Conversation Scripts",
    desc:"Two authentic dialogue scripts featuring ojalá and espero que in natural conversation. Great for speaking practice with a partner.",
    pages:3, level:"Intermediate–Advanced", color:A_VIOLET,
    url:"/pdf_conversation_scripts.pdf",
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(212,168,67,0.18); border-radius:3px; }
  .spine-seg { transition:background .3s, box-shadow .3s; }
  .pdf-card:hover { border-color:rgba(212,168,67,0.28) !important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.45) !important; }
  .pdf-dl:hover { filter:brightness(1.12); }
  .nav-pill:hover { background:rgba(212,168,67,0.14) !important; color:#f5ede0 !important; }
  .quiz-opt:hover { border-color:rgba(212,168,67,0.3) !important; background:rgba(212,168,67,0.05) !important; }
  .section-anchor { scroll-margin-top:20px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes drawIn { from{stroke-dashoffset:280} to{stroke-dashoffset:0} }

  @media(max-width:767px){
    .res-layout { flex-direction:column !important; }
    .res-spine { width:100% !important; height:auto !important; border-right:none !important; border-bottom:1px solid rgba(212,168,67,0.20) !important; padding:12px 14px !important; overflow-y:visible !important; }
    .res-spine-inner { flex-direction:row !important; flex-wrap:wrap !important; gap:8px !important; height:auto !important; }
    .res-content { padding:20px 16px 60px !important; }
    .res-topbar { flex-wrap:wrap !important; padding:8px 14px !important; gap:6px !important; }
    .res-right-margin { display:none !important; }
    .res-grid-2col { grid-template-columns:1fr !important; }
    .res-pdf-grid { grid-template-columns:1fr !important; }
    .res-weirdos-grid { grid-template-columns:1fr !important; }
  }
  @media(min-width:768px) and (max-width:1023px){
    .res-spine { width:160px !important; }
    .res-content { padding:24px 28px 60px !important; }
    .res-pdf-grid { grid-template-columns:repeat(auto-fill,minmax(220px,1fr)) !important; }
    .res-weirdos-grid { grid-template-columns:repeat(auto-fill,minmax(220px,1fr)) !important; }
    .res-grid-2col { grid-template-columns:1fr 1fr !important; }
  }
`;

/* ── PROGRESS SPINE component ── */
function ProgressSpine({ completed, active, onJump }) {
  const pct = Math.round((Object.keys(completed).length / SECTIONS.length) * 100);
  return (
    <div style={{ width:200, flexShrink:0, position:"sticky", top:20,
      height:"calc(100vh - 80px)", display:"flex", flexDirection:"column" }}>

      {/* Circular progress dial */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
        padding:"20px 0 18px", borderBottom:`1px solid ${BORD}`, marginBottom:16 }}>
        <div style={{ position:"relative", width:80, height:80 }}>
          <svg width={80} height={80} style={{ transform:"rotate(-90deg)" }}>
            <circle cx={40} cy={40} r={34} fill="none"
              stroke="rgba(212,168,67,0.1)" strokeWidth={5}/>
            <circle cx={40} cy={40} r={34} fill="none"
              stroke={GOLD} strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*34}`}
              strokeDashoffset={`${2*Math.PI*34*(1 - pct/100)}`}
              style={{ transition:"stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex",
            flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:24, color:GOLDLT,
              lineHeight:1 }}>{pct}%</span>
            <span style={{ fontFamily:"'Lora',serif", fontSize:10, color:MUTED,
              fontStyle:"italic" }}>done</span>
          </div>
        </div>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, letterSpacing:"0.12em",
          textTransform:"uppercase", color:MUTED, marginTop:8 }}>Lesson 2.3</p>
        <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:BODY,
          fontStyle:"italic", textAlign:"center", marginTop:3, lineHeight:1.4 }}>
          Present Subjunctive
        </p>
      </div>

      {/* Section pills */}
      <div style={{ display:"flex", flexDirection:"column", gap:3, flex:1, overflowY:"auto" }}>
        {SECTIONS.map((s, i) => {
          const done   = !!completed[s.id];
          const isAct  = active === s.id;
          return (
            <button key={s.id} onClick={() => onJump(s.id)} className="nav-pill"
              style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 10px",
                borderRadius:4, border:"none", background: isAct ? "rgba(212,168,67,0.1)" : "transparent",
                borderLeft:`2px solid ${isAct ? GOLD : done ? GOLDLT+"66" : "transparent"}`,
                cursor:"pointer", textAlign:"left", transition:"all .15s" }}>
              {/* status dot */}
              <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0,
                border:`1.5px solid ${done ? GOLDLT : isAct ? GOLD : DIM}`,
                background: done ? GOLDLT : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .3s" }}>
                {done && (
                  <svg width={8} height={8} viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke={DARK} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12,
                letterSpacing:"0.04em", color: isAct ? CREAM : done ? BODY : MUTED,
                lineHeight:1.3 }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* XP earned */}
      <div style={{ marginTop:12, padding:"12px 10px",
        background:"rgba(212,168,67,0.06)", border:`1px solid ${BORD}`,
        borderRadius:5, textAlign:"center" }}>
        <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
          color:MUTED, letterSpacing:"0.1em", marginBottom:4 }}>XP EARNED</p>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:GOLDLT, lineHeight:1 }}>
          {Object.keys(completed).length * 25}</p>
        <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:MUTED,
          fontStyle:"italic", marginTop:2 }}>of {SECTIONS.length * 25} possible</p>
      </div>
    </div>
  );
}

/* ── SECTION WRAPPER ── */
function Section({ id, children, onVisible }) {
  const ref   = useRef(null);
  const cbRef = useRef(onVisible);
  useEffect(() => { cbRef.current = onVisible; });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Find the scrollable parent
    const scrollParent = el.closest("[data-scroll]") || null;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) cbRef.current(id); },
      { root: scrollParent, threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [id]);
  return (
    <div ref={ref} id={id} className="section-anchor"
      style={{ marginBottom:48 }}>
      {children}
    </div>
  );
}

/* ── CALLOUT BOX ── */
function Callout({ color=GOLD, icon="◈", title, children }) {
  return (
    <div style={{ borderLeft:`3px solid ${color}`, background:`${color}08`,
      border:`1px solid ${color}20`, borderLeftWidth:3,
      borderRadius:"0 6px 6px 0", padding:"14px 18px", margin:"18px 0" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <span style={{ color, fontSize:14 }}>{icon}</span>
        <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, letterSpacing:"0.14em",
          textTransform:"uppercase", color }}>{title}</span>
      </div>
      <div style={{ fontFamily:"'Lora',serif", fontSize:15, color:BODY, lineHeight:1.75 }}>
        {children}
      </div>
    </div>
  );
}

/* ── CONJUGATION TABLE ── */
function ConjTable({ verb, stem, endings, color }) {
  const rows = [
    ["yo",        stem + endings[0]],
    ["tú",        stem + endings[1]],
    ["él/ella",   stem + endings[2]],
    ["nosotros",  stem + endings[3]],
    ["vosotros",  stem + endings[4]],
    ["ellos",     stem + endings[5]],
  ];
  return (
    <div style={{ flex:1, minWidth:200 }}>
      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.1em",
        textTransform:"uppercase", color, marginBottom:8 }}>{verb}</div>
      <div style={{ border:`1px solid ${BORD}`, borderRadius:5, overflow:"hidden" }}>
        {rows.map(([pro, conj], i) => (
          <div key={i} style={{ display:"flex", padding:"8px 14px",
            background: i%2===0 ? CARD : "rgba(255,255,255,0.01)",
            borderBottom: i<5 ? `1px solid ${BORD}` : "none" }}>
            <span style={{ fontFamily:"'Lora',serif", fontSize:14, color:MUTED,
              fontStyle:"italic", width:90, flexShrink:0 }}>{pro}</span>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:15,
              color:CREAM, letterSpacing:"0.04em" }}>{conj}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN EXPORT ── */
function Lesson23({ onBack }) {
  const [completed, setCompleted] = useState({});  // { sectionId: true }
  const [active,    setActive]    = useState("intro");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore]  = useState(null);
  const mainRef = useRef(null);

  function markVisible(id) {
    setActive(id);
    setCompleted(prev => prev[id] ? prev : { ...prev, [id]: true });
  }

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  function handleQuizSubmit() {
    let score = 0;
    QUIZ.forEach((q, i) => { if (quizAnswers[i] === q.ans) score++; });
    setQuizScore(score);
    setQuizSubmitted(true);
    setCompleted(prev => ({ ...prev, quiz: true }));
  }

  const quizComplete = Object.keys(quizAnswers).length === QUIZ.length;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%",
      background:DARK, color:CREAM, overflow:"hidden",
      backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
      <style>{CSS}</style>

      {/* ── TOP BREADCRUMB BAR ── */}
      <div className="res-topbar" style={{ borderBottom:`1px solid ${BORD}`, padding:"10px 24px",
        display:"flex", alignItems:"center", gap:8, flexShrink:0,
        background:CARD, backdropFilter:"blur(12px)" }}>
        {[["RESOURCES",onBack],["SPANISH",onBack],["INTERMEDIATE",onBack]].map(([label,fn],i)=>(
          <span key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={fn} style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
              letterSpacing:"0.16em", color:MUTED, background:"none", border:"none",
              cursor:"pointer", padding:0, transition:"color .12s" }}
              onMouseEnter={e=>e.currentTarget.style.color=CREAM}
              onMouseLeave={e=>e.currentTarget.style.color=MUTED}>{label}</button>
            <span style={{ color:DIM, fontSize:11 }}>›</span>
          </span>
        ))}
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
          color:GOLD, letterSpacing:"0.1em" }}>2.3 — PRESENT SUBJUNCTIVE</span>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED,
            fontStyle:"italic" }}>~25 min</span>
          <span style={{ background:"rgba(212,168,67,0.1)", border:`1px solid ${BORD}`,
            borderRadius:3, padding:"3px 10px", fontFamily:"'Oswald',sans-serif",
            fontSize:11, letterSpacing:"0.1em", color:GOLD }}>INTERMEDIATE</span>
        </div>
      </div>

      {/* ── BODY: SPINE + CONTENT ── */}
      <div className="res-layout" style={{ flex:1, display:"flex", gap:0, overflow:"hidden" }}>

        {/* Left: Progress Spine */}
        <div className="res-spine" style={{ width:220, flexShrink:0, borderRight:`1px solid ${BORD}`,
          padding:"20px 14px", overflowY:"auto" }}>
          <ProgressSpine completed={completed} active={active} onJump={jumpTo}/>
        </div>

        {/* Center: Lesson content */}
        <div ref={mainRef} data-scroll="" className="res-content" style={{ flex:1, overflowY:"auto", padding:"32px 48px 80px" }}>

          {/* ═══ SECTION 1: INTRO ═══ */}
          <Section id="intro" onVisible={markVisible}>
            <div style={{ marginBottom:6 }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
                color:GOLD, letterSpacing:"0.14em" }}>LESSON 2.3</span>
            </div>
            <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:46, fontWeight:700,
              color:CREAM, letterSpacing:"0.01em", lineHeight:1.05, marginBottom:6 }}>
              The Present Subjunctive
            </h1>
            <p style={{ fontFamily:"'Lora',serif", fontSize:17, color:MUTED,
              fontStyle:"italic", letterSpacing:"0.02em", marginBottom:24 }}>
              El subjuntivo presente — expressing wishes, doubt, and emotion
            </p>
            <div style={{ width:48, height:2, background:`linear-gradient(90deg,${GOLD},transparent)`,
              marginBottom:24 }}/>
            <p style={{ fontFamily:"'Lora',serif", fontSize:16.5, color:BODY,
              lineHeight:1.85, maxWidth:680 }}>
              The subjunctive is one of the most important — and most feared — grammar concepts
              in Spanish. Unlike the indicative, which deals in facts, the subjunctive lives in the realm
              of feelings, uncertainty, and desire. By the end of this lesson, you'll understand
              when and how to use it, and it will start to feel natural.
            </p>
            <div style={{ display:"flex", gap:14, marginTop:22, flexWrap:"wrap" }}>
              {[
                { label:"Concept", desc:"What & why", c:A_BLUE },
                { label:"Conjugation", desc:"Forms & stems", c:GOLD },
                { label:"WEIRDOS", desc:"6 trigger types", c:A_ROSE },
                { label:"Video", desc:"Señor Jordan", c:A_VIOLET },
                { label:"Quiz", desc:"6 questions", c:A_GREEN },
              ].map((t,i) => (
                <div key={i} style={{ background:`${t.c}0a`, border:`1px solid ${t.c}25`,
                  borderRadius:5, padding:"10px 14px", minWidth:100 }}>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:t.c,
                    letterSpacing:"0.08em" }}>{t.label}</p>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:MUTED,
                    fontStyle:"italic", marginTop:2 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══ SECTION 2: CONCEPT ═══ */}
          <Section id="concept" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:16 }}>What is the Subjunctive?</h2>

            <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
              lineHeight:1.85, marginBottom:18, maxWidth:680 }}>
              In Spanish, <em style={{ color:GOLDLT }}>moods</em> don't describe time — they describe
              the speaker's attitude toward what they're saying. The <strong style={{ color:CREAM }}>
              indicative</strong> states facts. The <strong style={{ color:GOLDLT }}>subjunctive</strong> expresses
              subjectivity: wishes, doubts, emotions, hypotheticals.
            </p>

            {/* Indicative vs Subjunctive comparison */}
            <div className="res-grid-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
              <div style={{ background:CARD, border:`1px solid rgba(78,159,232,0.2)`,
                borderRadius:6, padding:"16px 18px" }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:A_BLUE,
                  letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>
                  Indicative — Facts</p>
                {[
                  ["Sé que ella", "viene.","I know she is coming."],
                  ["Es verdad que", "habla bien.","It's true she speaks well."],
                  ["Creo que", "tiene razón.","I think she's right."],
                ].map(([s1,s2,eng],i) => (
                  <div key={i} style={{ marginBottom:10 }}>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:BODY }}>
                      {s1} <span style={{ color:A_BLUE, fontWeight:600 }}>{s2}</span>
                    </p>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED,
                      fontStyle:"italic" }}>{eng}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:CARD, border:`1px solid rgba(212,168,67,0.2)`,
                borderRadius:6, padding:"16px 18px" }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:GOLD,
                  letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>
                  Subjunctive — Subjectivity</p>
                {[
                  ["Espero que ella", "venga.","I hope she comes."],
                  ["Es importante que", "hable bien.","It's important she speak well."],
                  ["No creo que", "tenga razón.","I don't think she's right."],
                ].map(([s1,s2,eng],i) => (
                  <div key={i} style={{ marginBottom:10 }}>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:BODY }}>
                      {s1} <span style={{ color:GOLDLT, fontWeight:600 }}>{s2}</span>
                    </p>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED,
                      fontStyle:"italic" }}>{eng}</p>
                  </div>
                ))}
              </div>
            </div>

            <Callout color={A_AMBER} icon="★" title="The Golden Rule">
              The subjunctive almost always appears in a <strong style={{color:CREAM}}>dependent clause</strong> after{" "}
              <strong style={{color:CREAM}}>que</strong>, when there is a <strong style={{color:CREAM}}>change of subject</strong> between
              the main clause and the dependent clause.
              <br/><br/>
              <span style={{color:GOLDLT,fontFamily:"'Share Tech Mono',monospace", fontSize:14}}>
                [Subject A] + [trigger verb] + que + [Subject B] + [subjunctive verb]
              </span>
            </Callout>
          </Section>

          {/* ═══ SECTION 3: CONJUGATION ═══ */}
          <Section id="conjugate" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:8 }}>Forming the Present Subjunctive</h2>
            <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
              lineHeight:1.8, marginBottom:22, maxWidth:680 }}>
              The formula is elegantly simple: take the <em style={{color:GOLDLT}}>yo</em> form of the
              present indicative, drop the <strong style={{color:CREAM}}>-o</strong>, then add the{" "}
              <em>opposite vowel</em> endings — <strong style={{color:CREAM}}>-e endings for -AR</strong>,{" "}
              <strong style={{color:CREAM}}>-a endings for -ER/-IR</strong>.
            </p>

            {/* Step by step */}
            <div style={{ background:CARD2, border:`1px solid ${BORD}`, borderRadius:6,
              padding:"18px 22px", marginBottom:24 }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:MUTED,
                letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:14 }}>
                Step-by-step: hablar → yo hablo</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                {[
                  { step:"1", label:"yo form", val:"hablo", c:A_BLUE },
                  { step:"→", label:"", val:"", c:"transparent" },
                  { step:"2", label:"drop -o", val:"habl-", c:A_AMBER },
                  { step:"→", label:"", val:"", c:"transparent" },
                  { step:"3", label:"add -e endings", val:"hable, hables...", c:A_GREEN },
                ].map((s,i) => s.step==="→" ? (
                  <span key={i} style={{ color:DIM, fontSize:18 }}>›</span>
                ) : (
                  <div key={i} style={{ background:`${s.c}10`, border:`1px solid ${s.c}30`,
                    borderRadius:4, padding:"10px 14px", textAlign:"center" }}>
                    <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:s.c, letterSpacing:"0.1em", marginBottom:4 }}>STEP {s.step}</p>
                    <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:17, color:CREAM }}>
                      {s.val}</p>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:MUTED,
                      fontStyle:"italic", marginTop:2 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conjugation tables */}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:22 }}>
              <ConjTable verb="hablar (-AR)" stem="habl" color={A_BLUE}
                endings={["e","es","e","emos","éis","en"]}/>
              <ConjTable verb="comer (-ER)" stem="com" color={GOLD}
                endings={["a","as","a","amos","áis","an"]}/>
              <ConjTable verb="vivir (-IR)" stem="viv" color={A_ROSE}
                endings={["a","as","a","amos","áis","an"]}/>
            </div>

            <Callout color={A_ROSE} icon="⚠" title="Common Irregular Stems">
              These verbs have irregular yo forms — use that stem for the entire subjunctive:
              <br/>
              <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap" }}>
                {[
                  ["tener","tengo →","teng-"],
                  ["venir","vengo →","veng-"],
                  ["hacer","hago →","hag-"],
                  ["poner","pongo →","pong-"],
                  ["decir","digo →","dig-"],
                  ["salir","salgo →","salg-"],
                ].map(([v,yo,stem],i) => (
                  <span key={i} style={{ fontFamily:"'Share Tech Mono',monospace",
                    fontSize:13, color:BODY }}>
                    <span style={{color:MUTED}}>{v}: </span>
                    <span style={{color:A_AMBER}}>{yo}</span>
                    <span style={{color:CREAM}}> {stem}</span>
                  </span>
                ))}
              </div>
            </Callout>
          </Section>

          {/* ═══ SECTION 4: WEIRDOS ═══ */}
          <Section id="weirdos" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:8 }}>When to Use It: W.E.I.R.D.O.S</h2>
            <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
              lineHeight:1.8, marginBottom:22, maxWidth:680 }}>
              This acronym covers the six main contexts where the subjunctive is triggered.
              Knowing these triggers is the key to subjunctive mastery.
            </p>

            <div className="res-weirdos-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
              {[
                { letter:"W", word:"Wishes & Desires", color:A_BLUE,
                  triggers:["querer que","desear que","necesitar que"],
                  ex:"Quiero que tú vengas.", eng:"I want you to come." },
                { letter:"E", word:"Emotions", color:A_ROSE,
                  triggers:["alegrarse de que","sentir que","temer que"],
                  ex:"Me alegra que estés aquí.", eng:"I'm glad you are here." },
                { letter:"I", word:"Impersonal Expressions", color:GOLD,
                  triggers:["es importante que","es necesario que","es bueno que"],
                  ex:"Es importante que estudies.", eng:"It's important that you study." },
                { letter:"R", word:"Recommendations", color:A_GREEN,
                  triggers:["recomendar que","sugerir que","aconsejar que"],
                  ex:"Te recomiendo que comas.", eng:"I recommend you eat." },
                { letter:"D", word:"Doubt & Denial", color:A_AMBER,
                  triggers:["dudar que","no creer que","negar que"],
                  ex:"Dudo que él sepa.", eng:"I doubt he knows." },
                { letter:"O", word:"Ojalá", color:A_VIOLET,
                  triggers:["ojalá (que)","quizás","tal vez"],
                  ex:"Ojalá que llueva.", eng:"I hope it rains." },
              ].map((item, i) => (
                <div key={i} style={{ background:CARD, border:`1px solid ${item.color}20`,
                  borderRadius:6, padding:"16px 18px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:10, right:14,
                    fontFamily:"'Oswald',sans-serif", fontSize:42, fontWeight:700,
                    color:`${item.color}12`, lineHeight:1 }}>{item.letter}</div>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:item.color,
                    letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:4 }}>
                    {item.letter} — </p>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, color:CREAM,
                    letterSpacing:"0.02em", marginBottom:10 }}>{item.word}</p>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
                    {item.triggers.map((t,j) => (
                      <span key={j} style={{ fontFamily:"'Share Tech Mono',monospace",
                        fontSize:11, color:MUTED, background:`${item.color}0a`,
                        border:`1px solid ${item.color}20`, borderRadius:2,
                        padding:"2px 7px" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ borderLeft:`2px solid ${item.color}40`, paddingLeft:10 }}>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:BODY,
                      fontStyle:"italic" }}>{item.ex}</p>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED,
                      marginTop:2 }}>{item.eng}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══ SECTION 5: VIDEO ═══ */}
          <Section id="video" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:6 }}>Video Lesson</h2>
            <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
              fontStyle:"italic", marginBottom:20 }}>
              Señor Jordan — Introduction to the Present Subjunctive
            </p>

            {/* YouTube embed */}
            <div style={{ position:"relative", paddingBottom:"56.25%", height:0,
              borderRadius:8, overflow:"hidden", border:`1px solid ${BORD}`,
              boxShadow:`0 8px 40px rgba(0,0,0,0.5)`, marginBottom:18 }}>
              <iframe
                style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%" }}
                src="https://www.youtube.com/embed/pG_2m9_sTTY"
                title="Introduction to the Present Subjunctive in Spanish — Señor Jordan"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen/>
            </div>

            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[
                { label:"Channel", val:"Señor Jordan", c:A_ROSE },
                { label:"Level", val:"Intermediate", c:GOLD },
                { label:"Topic", val:"Present Subjunctive Intro", c:A_BLUE },
              ].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:6, alignItems:"center",
                  background:CARD, border:`1px solid ${BORD}`, borderRadius:3,
                  padding:"5px 10px" }}>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                    color:MUTED, letterSpacing:"0.1em" }}>{t.label}:</span>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
                    color:t.c, letterSpacing:"0.04em" }}>{t.val}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══ SECTION 6: EXAMPLES ═══ */}
          <Section id="examples" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:20 }}>Examples in Context</h2>

            {/* Example sentences annotated */}
            {[
              { sp:"Espero que él llegue a tiempo.",
                en:"I hope he arrives on time.",
                trigger:"Espero que", verb:"llegue",
                note:"Wish → subjunctive. Two subjects: yo (espero) ≠ él (llegue).",
                c:A_BLUE },
              { sp:"Es necesario que practiques todos los días.",
                en:"It's necessary that you practice every day.",
                trigger:"Es necesario que", verb:"practiques",
                note:"Impersonal expression → subjunctive. The 'subject' of the main clause is impersonal.",
                c:GOLD },
              { sp:"Me alegra que hayas venido.",
                en:"I'm glad you came.",
                trigger:"Me alegra que", verb:"hayas venido",
                note:"Emotion trigger → subjunctive. Hayas venido = present perfect subjunctive.",
                c:A_ROSE },
              { sp:"No creo que él tenga razón.",
                en:"I don't think he's right.",
                trigger:"No creo que", verb:"tenga",
                note:"Doubt/Denial (negative creer) → subjunctive. Creo que (positive) = indicative.",
                c:A_AMBER },
            ].map((ex, i) => (
              <div key={i} style={{ background:CARD, border:`1px solid ${ex.c}18`,
                borderLeft:`3px solid ${ex.c}`, borderRadius:"0 6px 6px 0",
                padding:"16px 20px", marginBottom:14 }}>
                <p style={{ fontFamily:"'Lora',serif", fontSize:18, color:CREAM,
                  lineHeight:1.5, marginBottom:6 }}>
                  <span style={{ color:MUTED }}>{ex.sp.replace(ex.trigger,"").replace(ex.verb,"")}</span>
                  <span style={{ color:ex.c }}>{ex.trigger}</span>
                  <span style={{ color:MUTED }}>{" "}</span>
                  <span style={{ color:CREAM }}>{ex.sp.replace(ex.trigger+" ","").replace(ex.verb,
                    `[${ex.verb}]`).split("[")[0]}</span>
                  <span style={{ background:`${ex.c}20`, color:ex.c, borderRadius:2,
                    padding:"0 4px", fontWeight:600 }}>{ex.verb}</span>
                  <span style={{ color:CREAM }}>{ex.sp.replace(ex.trigger+" ","").split(ex.verb)[1]}</span>
                </p>
                <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:MUTED,
                  fontStyle:"italic", marginBottom:8 }}>{ex.en}</p>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                    color:ex.c, letterSpacing:"0.1em", flexShrink:0, marginTop:1 }}>NOTE</span>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:BODY }}>{ex.note}</p>
                </div>
              </div>
            ))}
          </Section>

          {/* ═══ SECTION 7: PDF PRACTICE ═══ */}
          <Section id="practice" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:8 }}>Practice Materials</h2>
            <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
              fontStyle:"italic", marginBottom:22 }}>
              Download these PDFs for extra practice outside the app.
            </p>
            <div className="res-pdf-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
              {PDFS.map((pdf, i) => (
                <div key={i} className="pdf-card"
                  style={{ background:CARD, border:`1px solid ${BORD}`,
                    borderRadius:6, padding:"18px 20px", transition:"all .2s",
                    position:"relative", overflow:"hidden",
                    backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
                  {/* Top accent */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                    background:`linear-gradient(90deg,transparent,${pdf.color},transparent)` }}/>
                  {/* PDF icon */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:36, height:36, borderRadius:4,
                      background:`${pdf.color}14`, border:`1px solid ${pdf.color}25`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0 }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                        stroke={pdf.color} strokeWidth="1.5" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <path d="M14 2v6h6M9 13h6M9 17h4"/>
                      </svg>
                    </div>
                    <div>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                        color:pdf.color, letterSpacing:"0.1em" }}>PDF · {pdf.pages} PAGES</span>
                      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                        color:MUTED, letterSpacing:"0.08em", marginLeft:8 }}>{pdf.level}</span>
                    </div>
                  </div>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:16, color:CREAM,
                    letterSpacing:"0.02em", marginBottom:6, lineHeight:1.3 }}>{pdf.title}</p>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:13.5, color:BODY,
                    lineHeight:1.65, fontStyle:"italic", marginBottom:16 }}>{pdf.desc}</p>
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer"
                    className="pdf-dl"
                    style={{ display:"inline-flex", alignItems:"center", gap:6,
                      background:`${pdf.color}12`, border:`1px solid ${pdf.color}35`,
                      borderRadius:4, padding:"7px 14px", fontFamily:"'Oswald',sans-serif",
                      fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase",
                      color:pdf.color, textDecoration:"none", transition:"all .15s" }}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Open Resource
                  </a>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══ SECTION 8: QUIZ ═══ */}
          <Section id="quiz" onVisible={markVisible}>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
              letterSpacing:"0.03em", marginBottom:6 }}>Lesson Quiz</h2>
            <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
              fontStyle:"italic", marginBottom:24 }}>
              6 questions · Test your understanding of the present subjunctive
            </p>

            {quizSubmitted ? (
              /* ── RESULTS ── */
              <div style={{ animation:"fadeUp .3s ease both" }}>
                {/* Score hero */}
                <div style={{ background:CARD2, border:`1px solid ${quizScore>=5?A_GREEN:quizScore>=3?A_AMBER:A_ROSE}30`,
                  borderRadius:8, padding:"32px 28px", textAlign:"center", marginBottom:28,
                  position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, background:
                    `radial-gradient(circle at 50% 0%, ${quizScore>=5?A_GREEN:quizScore>=3?A_AMBER:A_ROSE}08, transparent 70%)` }}/>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
                    color:MUTED, letterSpacing:"0.14em", marginBottom:8 }}>FINAL SCORE</p>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:64,
                    color:quizScore>=5?GOLDLT:quizScore>=3?A_AMBER:A_ROSE, lineHeight:1 }}>
                    {quizScore}/{QUIZ.length}
                  </p>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
                    fontStyle:"italic", marginTop:8 }}>
                    {quizScore===6 ? "¡Perfecto! Outstanding work." :
                     quizScore>=4 ? "¡Muy bien! Strong understanding." :
                     quizScore>=2 ? "Buen intento. Review and try again." :
                     "Keep practicing — you've got this."}
                  </p>
                  <div style={{ marginTop:16, display:"flex", justifyContent:"center", gap:8 }}>
                    {QUIZ.map((_,i) => (
                      <div key={i} style={{ width:10, height:10, borderRadius:"50%",
                        background:quizAnswers[i]===QUIZ[i].ans ? GOLDLT : "#7a5535" }}/>
                    ))}
                  </div>
                </div>

                {/* Answer review */}
                {QUIZ.map((q, qi) => {
                  const correct = quizAnswers[qi] === q.ans;
                  return (
                    <div key={qi} style={{ background:CARD,
                      border:`1px solid ${correct ? GOLDLT+"25" : "#7a5535"}`,
                      borderLeft:`3px solid ${correct ? GOLDLT : "#7a5535"}`,
                      borderRadius:"0 6px 6px 0", padding:"16px 18px", marginBottom:12 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:10 }}>
                        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
                          color:correct?GOLDLT:"#a8855a", flexShrink:0 }}>
                          Q{qi+1} {correct ? "✓" : "✗"}
                        </span>
                        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:15,
                          color:CREAM, letterSpacing:"0.02em" }}>{q.q}</p>
                      </div>
                      <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:BODY,
                        fontStyle:"italic", marginBottom:6 }}>
                        Your answer: <span style={{ color:correct?GOLDLT:"#a8855a" }}>
                          {q.opts[quizAnswers[qi]]}
                        </span>
                      </p>
                      {!correct && (
                        <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:A_GREEN,
                          marginBottom:6 }}>
                          Correct: <strong>{q.opts[q.ans]}</strong>
                        </p>
                      )}
                      <p style={{ fontFamily:"'Lora',serif", fontSize:13.5, color:MUTED,
                        lineHeight:1.65, borderLeft:`2px solid ${BORD}`, paddingLeft:10,
                        marginTop:6 }}>{q.explain}</p>
                    </div>
                  );
                })}

                <button onClick={() => {
                  setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null);
                }} style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.1em",
                  textTransform:"uppercase", padding:"10px 24px", borderRadius:4,
                  border:`1px solid ${BORD}`, background:"transparent",
                  color:MUTED, cursor:"pointer", marginTop:8 }}>
                  Retake Quiz
                </button>
              </div>
            ) : (
              /* ── QUESTIONS ── */
              <div>
                {QUIZ.map((q, qi) => (
                  <div key={qi} style={{ background:CARD, border:`1px solid ${BORD}`,
                    borderRadius:6, padding:"24px 26px", marginBottom:20 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:18 }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
                        color:GOLD, flexShrink:0, marginTop:2 }}>Q{qi+1}</span>
                      <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:18,
                        color:CREAM, letterSpacing:"0.02em", lineHeight:1.4 }}>{q.q}</p>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {q.opts.map((opt, oi) => {
                        const sel = quizAnswers[qi] === oi;
                        const letter = String.fromCharCode(65 + oi);
                        return (
                          <button key={oi} onClick={() => setQuizAnswers(prev => ({...prev,[qi]:oi}))}
                            className="quiz-opt"
                            style={{ display:"flex", alignItems:"center", gap:12,
                              padding:"13px 16px", borderRadius:5,
                              border:`1px solid ${sel ? GOLD+"60" : BORD}`,
                              background: sel ? "rgba(212,168,67,0.14)" : "transparent",
                              cursor:"pointer", textAlign:"left", transition:"all .14s" }}>
                            <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                              border:`1.5px solid ${sel ? GOLD : DIM}`,
                              background: sel ? GOLD : "transparent",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              transition:"all .14s" }}>
                              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12,
                                color: sel ? DARK : MUTED, lineHeight:1 }}>{letter}</span>
                            </div>
                            <span style={{ fontFamily:"'Lora',serif", fontSize:16,
                              color: sel ? CREAM : BODY }}>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <button onClick={handleQuizSubmit} disabled={!quizComplete}
                  style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:"0.1em",
                    textTransform:"uppercase", padding:"15px 40px", borderRadius:5,
                    border:"none", background: quizComplete ? GOLD : "#2a1508",
                    color:quizComplete ? DARK : MUTED, cursor:quizComplete ? "pointer" : "default",
                    fontWeight:700, transition:"all .2s",
                    opacity:quizComplete ? 1 : 0.6 }}>
                  Submit Quiz →
                </button>
                {!quizComplete && (
                  <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED,
                    fontStyle:"italic", marginTop:10 }}>
                    Answer all {QUIZ.length} questions to submit.
                  </p>
                )}
              </div>
            )}
          </Section>

        </div>
        {/* Right margin: intentional breathing room */}
        <div className="res-right-margin" style={{ width:32, flexShrink:0 }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESOURCES PAGE ROUTER
   — Shows overview by default
   — Drills into Lesson23 when lesson 2.3 is selected
═══════════════════════════════════════════════════════════════ */
export default function ResourcesPage() {
  const [view, setView] = useState("overview"); // "overview" | "lesson"

  function openLesson(lesson) {
    // For now only lesson 2.3 is built; others show coming soon
    if (lesson.id === "2.3") setView("lesson");
    else alert(`Lesson ${lesson.id} coming soon!`);
  }

  if (view === "lesson") {
    return <Lesson23 onBack={() => setView("overview")}/>;
  }

  return <SpanishCourseOverview onOpenLesson={openLesson}/>;
}