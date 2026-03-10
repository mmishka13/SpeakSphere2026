import { useState } from "react";

const DARK   = "#0d0702";
const CARD   = "#1b0f06";
const CARD2  = "#201108";
const GOLD   = "#d4a843";
const GOLDLT = "#f0cc55";
const CREAM  = "#f5ede0";
const MUTED  = "#c8aa80";
const DIM    = "#a08050";
const BORD   = "rgba(212,168,67,0.20)";
const BODY   = "#c8aa80";
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

/* ── LANGUAGES ── */
const LANGS = [
  { code:"ES", name:"Spanish",  script:"Español",  color:"#d4a843", light:"#f0cc55", dark:"#7a5a20" },
  { code:"FR", name:"French",   script:"Français", color:"#b89070", light:"#d4aa88", dark:"#6a4a30" },
  { code:"JP", name:"Japanese", script:"日本語",    color:"#a8856a", light:"#c4a080", dark:"#584030" },
  { code:"KO", name:"Korean",   script:"한국어",    color:"#c0956a", light:"#d8ae88", dark:"#704828" },
];

/* ── MASTERY ── */
const M = {
  mastered:    { label:"Mastered",    c:"#f0cc55", bg:"rgba(232,192,122,0.18)", pct:1.0  },
  proficient:  { label:"Proficient",  c:"#c4956a", bg:"rgba(196,149,106,0.15)", pct:0.66 },
  familiar:    { label:"Familiar",    c:"#a8855a", bg:"rgba(168,133,90,0.12)",  pct:0.40 },
  attempted:   { label:"Attempted",   c:"#7a5535", bg:"rgba(122,85,53,0.12)",   pct:0.15 },
  not_started: { label:"Not started", c:"#3d2210", bg:"transparent",            pct:0    },
};

/* ── COURSE DATA per language ── */
const COURSES = {
  ES: {
    totalPossibleXP: 3750,
    earnedXP: 700,
    units: [
      { id:1, title:"Foundations",           color:"#d4a843", light:"#f0cc55",
        lessons:[
          { id:"1.1", title:"Greetings & Introductions",   mastery:"mastered",   xp:150 },
          { id:"1.2", title:"Numbers, Dates & Time",        mastery:"mastered",   xp:150 },
          { id:"1.3", title:"Nouns & Gender",               mastery:"proficient", xp:100 },
          { id:"1.4", title:"Articles: El, La, Los, Las",   mastery:"proficient", xp:100 },
          { id:"1.5", title:"Present Tense: -AR Verbs",     mastery:"familiar",   xp:50  },
          { id:"1.6", title:"Present Tense: -ER/-IR",       mastery:"attempted",  xp:25  },
          { id:"1.7", title:"Unit Test",                    mastery:"attempted",  xp:25, isTest:true },
        ]},
      { id:2, title:"Intermediate Grammar",  color:"#b89070", light:"#d4aa88",
        lessons:[
          { id:"2.1", title:"Ser vs. Estar",                mastery:"proficient", xp:100 },
          { id:"2.2", title:"Preterite vs. Imperfect",      mastery:"familiar",   xp:50  },
          { id:"2.3", title:"The Present Subjunctive",      mastery:"attempted",  xp:25, active:true },
          { id:"2.4", title:"Por vs. Para",                 mastery:"not_started",xp:0   },
          { id:"2.5", title:"Reflexive Verbs",              mastery:"not_started",xp:0   },
          { id:"2.6", title:"Commands (Imperative)",        mastery:"not_started",xp:0   },
          { id:"2.7", title:"Unit Test",                    mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:3, title:"Vocabulary & Culture",  color:"#a8856a", light:"#c4a080",
        lessons:[
          { id:"3.1", title:"Travel & Directions",          mastery:"not_started",xp:0 },
          { id:"3.2", title:"Food & Restaurants",           mastery:"not_started",xp:0 },
          { id:"3.3", title:"Health & Body",                mastery:"not_started",xp:0 },
          { id:"3.4", title:"Work & Career",                mastery:"not_started",xp:0 },
          { id:"3.5", title:"Unit Test",                    mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:4, title:"Advanced Structures",   color:"#c09060", light:"#dca878",
        lessons:[
          { id:"4.1", title:"Imperfect Subjunctive",        mastery:"not_started",xp:0 },
          { id:"4.2", title:"Conditional Tense",            mastery:"not_started",xp:0 },
          { id:"4.3", title:"Passive Voice",                mastery:"not_started",xp:0 },
          { id:"4.4", title:"Relative Clauses",             mastery:"not_started",xp:0 },
          { id:"4.5", title:"Unit Test",                    mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:5, title:"Culture & Literature",  color:"#b89060", light:"#d4a878",
        lessons:[
          { id:"5.1", title:"Latin American Authors",       mastery:"not_started",xp:0 },
          { id:"5.2", title:"Spanish Cinema",               mastery:"not_started",xp:0 },
          { id:"5.3", title:"Regional Dialects",            mastery:"not_started",xp:0 },
          { id:"5.4", title:"Course Challenge",             mastery:"not_started",xp:0, isTest:true },
        ]},
    ]
  },
  FR: {
    totalPossibleXP: 2250,
    earnedXP: 150,
    units: [
      { id:1, title:"Foundations",         color:"#b89070", light:"#d4aa88",
        lessons:[
          { id:"1.1", title:"Bonjour! Greetings",        mastery:"proficient", xp:100 },
          { id:"1.2", title:"Numbers & Time",            mastery:"familiar",   xp:50  },
          { id:"1.3", title:"Nouns & Gender",            mastery:"not_started",xp:0   },
          { id:"1.4", title:"Present Tense Verbs",       mastery:"not_started",xp:0   },
          { id:"1.5", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:2, title:"Core Grammar",        color:"#a8856a", light:"#c4a080",
        lessons:[
          { id:"2.1", title:"Être vs. Avoir",            mastery:"not_started",xp:0 },
          { id:"2.2", title:"Passé Composé",             mastery:"not_started",xp:0 },
          { id:"2.3", title:"Imparfait",                 mastery:"not_started",xp:0 },
          { id:"2.4", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:3, title:"Conversation",        color:"#c09060", light:"#dca878",
        lessons:[
          { id:"3.1", title:"At the Café",               mastery:"not_started",xp:0 },
          { id:"3.2", title:"Shopping & Directions",     mastery:"not_started",xp:0 },
          { id:"3.3", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
    ]
  },
  JP: {
    totalPossibleXP: 1800,
    earnedXP: 50,
    units: [
      { id:1, title:"Writing Systems",     color:"#a8856a", light:"#c4a080",
        lessons:[
          { id:"1.1", title:"Hiragana Complete",         mastery:"familiar",   xp:50 },
          { id:"1.2", title:"Katakana Complete",         mastery:"not_started",xp:0  },
          { id:"1.3", title:"Basic Kanji",               mastery:"not_started",xp:0  },
          { id:"1.4", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:2, title:"Core Grammar",        color:"#b89070", light:"#d4aa88",
        lessons:[
          { id:"2.1", title:"Particles: は、が、を",      mastery:"not_started",xp:0 },
          { id:"2.2", title:"Verb Groups",               mastery:"not_started",xp:0 },
          { id:"2.3", title:"Adjective Types",           mastery:"not_started",xp:0 },
          { id:"2.4", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:3, title:"Conversation",        color:"#c09060", light:"#dca878",
        lessons:[
          { id:"3.1", title:"Greetings & Keigo",         mastery:"not_started",xp:0 },
          { id:"3.2", title:"Asking Questions",          mastery:"not_started",xp:0 },
          { id:"3.3", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
    ]
  },
  KO: {
    totalPossibleXP: 1800,
    earnedXP: 100,
    units: [
      { id:1, title:"Hangul & Phonics",    color:"#c09060", light:"#dca878",
        lessons:[
          { id:"1.1", title:"Hangul: Consonants",        mastery:"proficient", xp:100 },
          { id:"1.2", title:"Hangul: Vowels",            mastery:"not_started",xp:0   },
          { id:"1.3", title:"Syllable Blocks",           mastery:"not_started",xp:0   },
          { id:"1.4", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:2, title:"Grammar Basics",      color:"#a8856a", light:"#c4a080",
        lessons:[
          { id:"2.1", title:"Particles & Markers",       mastery:"not_started",xp:0 },
          { id:"2.2", title:"Verb Endings",              mastery:"not_started",xp:0 },
          { id:"2.3", title:"Formal vs Informal",        mastery:"not_started",xp:0 },
          { id:"2.4", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
      { id:3, title:"Daily Conversation",  color:"#b89070", light:"#d4aa88",
        lessons:[
          { id:"3.1", title:"K-Drama Vocabulary",        mastery:"not_started",xp:0 },
          { id:"3.2", title:"Ordering Food",             mastery:"not_started",xp:0 },
          { id:"3.3", title:"Unit Test",                 mastery:"not_started",xp:0, isTest:true },
        ]},
    ]
  }
};

/* ── CIRCULAR RING SVG ── */
function Ring({ pct, size=72, stroke=5, color, trackColor="rgba(255,255,255,0.06)", children }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", position:"absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition:"stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        {children}
      </div>
    </div>
  );
}

/* ── LESSON CHIP ── */
function LessonChip({ lesson, color, light, onClick }) {
  const m = M[lesson.mastery] || M.not_started;
  const filled = lesson.mastery !== "not_started";

  if (lesson.isTest) return (
    <button onClick={() => onClick(lesson)} title={lesson.title}
      style={{ width:26, height:26, borderRadius:4, border:`1.5px solid ${filled ? light+"88" : DIM}`,
        background: filled ? `${color}20` : "transparent", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all .15s", flexShrink:0 }}>
      <svg width={11} height={11} viewBox="0 0 24 24">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={filled ? light : DIM}/>
      </svg>
    </button>
  );

  return (
    <button onClick={() => onClick(lesson)} title={`${lesson.id} — ${lesson.title}\n${m.label}`}
      style={{ width:26, height:26, borderRadius:4, border:`1.5px solid ${m.c}`,
        background: m.bg, cursor:"pointer", position:"relative", overflow:"hidden",
        outline: lesson.active ? `2px solid ${GOLDLT}` : "none", outlineOffset:2,
        flexShrink:0, transition:"all .15s" }}>
      {lesson.mastery === "mastered" && (
        <div style={{ position:"absolute", inset:0, background:`${color}50`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke={light} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      {lesson.mastery === "attempted" && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"30%",
          background:`${color}50` }}/>
      )}
      {lesson.mastery === "familiar" && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"55%",
          background:`${color}55` }}/>
      )}
      {lesson.mastery === "proficient" && (
        <div style={{ position:"absolute", inset:0, background:`${color}40` }}/>
      )}
      {lesson.active && (
        <div style={{ position:"absolute", inset:0,
          boxShadow:`inset 0 0 0 2px ${GOLDLT}80`,
          borderRadius:3, animation:"activePulse 2s ease-in-out infinite" }}/>
      )}
    </button>
  );
}

/* ── LESSON POPUP ── */
function LessonPopup({ lesson, color, light, onOpen, onClose }) {
  const m = M[lesson.mastery] || M.not_started;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.75)",
      backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:CARD2, border:`1px solid ${color}40`,
          borderRadius:12, padding:"36px 40px", width:460,
          backgroundImage:GRAIN, backgroundSize:"300px",
          animation:"popIn .2s cubic-bezier(.34,1.3,.64,1) both",
          position:"relative", overflow:"hidden" }}>
        {/* Top accent bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
          background:`linear-gradient(90deg,transparent,${light},transparent)` }}/>
        {/* Corner marks */}
        {[[0,0,"top","left"],[0,"auto","top","right"],["auto",0,"bottom","left"],["auto","auto","bottom","right"]].map(([t,b,tt,lr],i)=>(
          <div key={i} style={{ position:"absolute", top:t===0?0:undefined, bottom:t==="auto"?0:undefined,
            left:lr==="left"?0:undefined, right:lr==="right"?0:undefined,
            width:18, height:18,
            borderTop: tt==="top" ? `1px solid ${color}60` : "none",
            borderBottom: tt==="bottom" ? `1px solid ${color}60` : "none",
            borderLeft: lr==="left" ? `1px solid ${color}60` : "none",
            borderRight: lr==="right" ? `1px solid ${color}60` : "none" }}/>
        ))}

        <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
          color, letterSpacing:"0.16em", marginBottom:8 }}>LESSON {lesson.id}</p>
        <h3 style={{ fontFamily:"'Oswald',sans-serif", fontSize:26, color:CREAM,
          letterSpacing:"0.02em", lineHeight:1.2, marginBottom:18 }}>{lesson.title}</h3>

        {/* Mastery + ring */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:24 }}>
          <Ring pct={M[lesson.mastery]?.pct||0} size={80} stroke={6} color={m.c}>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:16, color:m.c,
              lineHeight:1 }}>{Math.round((M[lesson.mastery]?.pct||0)*100)}%</span>
          </Ring>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:m.c }}/>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14,
                color:m.c, letterSpacing:"0.1em" }}>{m.label.toUpperCase()}</span>
            </div>
            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
              color:GOLDLT }}>{lesson.xp} / 150 XP</p>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ height:5, borderRadius:3, background:"rgba(255,255,255,0.06)", marginBottom:24 }}>
          <div style={{ height:"100%", borderRadius:3, width:`${(lesson.xp/150)*100}%`,
            background:`linear-gradient(90deg,${color},${light})`, transition:"width .5s" }}/>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { onOpen(lesson); onClose(); }}
            style={{ flex:1, fontFamily:"'Oswald',sans-serif", fontSize:14,
              letterSpacing:"0.1em", textTransform:"uppercase", padding:"14px",
              borderRadius:6, border:"none", fontWeight:700,
              background: lesson.mastery==="mastered" ? `${color}25` : light,
              color: lesson.mastery==="mastered" ? light : DARK,
              cursor:"pointer", transition:"all .15s" }}>
            {lesson.mastery==="mastered" ? "Review →" :
             lesson.mastery==="not_started" ? "Start Lesson →" : "Continue →"}
          </button>
          <button onClick={onClose}
            style={{ padding:"14px 20px", borderRadius:6, border:`1px solid ${BORD}`,
              background:"transparent", color:MUTED, cursor:"pointer",
              fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:"0.08em" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function SpanishCourseOverview({ onOpenLesson }) {
  const [langCode,  setLangCode]  = useState("ES");
  const [popup,     setPopup]     = useState(null);
  const [popupMeta, setPopupMeta] = useState(null);

  const lang    = LANGS.find(l => l.code === langCode) || LANGS[0];
  const course  = COURSES[langCode];
  const allLessons = course.units.flatMap(u => u.lessons);
  const masteredN  = allLessons.filter(l => l.mastery==="mastered").length;
  const profN      = allLessons.filter(l => l.mastery==="proficient").length;
  const famN       = allLessons.filter(l => l.mastery==="familiar").length;
  const totalN     = allLessons.length;
  const overallPct = Math.round(((masteredN + profN*0.66 + famN*0.33) / totalN) * 100);
  const xpPct      = course.earnedXP / course.totalPossibleXP;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh",
      background:DARK, color:CREAM, overflow:"hidden",
      backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(212,168,67,0.18); border-radius:2px; }
        .chip-btn:hover { transform:scale(1.12) !important; z-index:5; }
        .lang-tab:hover { background:rgba(212,168,67,0.14) !important; }
        .unit-card:hover { border-color:rgba(212,168,67,0.2) !important; }
        .open-btn:hover { filter:brightness(1.12); transform:translateY(-1px); }
        @keyframes popIn    { from{opacity:0;transform:scale(.92) translateY(8px)} to{opacity:1;transform:none} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes activePulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes shimmer  { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }

        @media(max-width:767px){
          .res-overview-topbar { padding:12px 16px !important; gap:8px !important; }
          .res-overview-body { flex-direction:column !important; overflow:visible !important; height:auto !important; }
          .res-overview-left { width:100% !important; flex-direction:row !important; flex-wrap:wrap !important; border-right:none !important; border-bottom:1px solid rgba(212,168,67,0.20) !important; padding:12px 14px !important; gap:12px !important; overflow-y:visible !important; max-height:none !important; }
          .res-overview-right { flex:none !important; width:100% !important; height:auto !important; overflow:visible !important; }
          .res-overview-right-scroll { overflow-y:visible !important; height:auto !important; }
          .res-units-padding { padding:0 14px !important; }
          .res-banner { padding:16px 14px !important; }
          .res-banner-main-row { flex-wrap:wrap !important; gap:12px !important; }
          .res-banner-xp { border-left:none !important; padding-left:0 !important; text-align:left !important; }
        }
        @media(min-width:768px) and (max-width:1023px){
          .res-overview-left { width:240px !important; }
          .res-units-padding { padding:0 20px !important; }
          .res-banner { padding:20px 24px !important; }
        }
      `}</style>

      {/* ══ TOPBAR ══ */}
      <div className="res-overview-topbar" style={{ borderBottom:`1px solid ${BORD}`, padding:"18px 32px",
        display:"flex", alignItems:"center", gap:16, flexShrink:0,
        background:CARD, flexWrap:"wrap", rowGap:12 }}>
        {/* Title */}
        <div style={{ marginRight:12 }}>
          <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
            color:MUTED, letterSpacing:"0.16em", marginBottom:5 }}>RESOURCES / COURSES</p>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:CREAM,
            fontWeight:600, letterSpacing:"0.03em", lineHeight:1 }}>My Languages</h1>
        </div>

        {/* Language tabs */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {LANGS.map(l => {
            const lc    = COURSES[l.code];
            const lpct  = Math.round((lc.earnedXP / lc.totalPossibleXP) * 100);
            const active = l.code === langCode;
            return (
              <button key={l.code} onClick={() => setLangCode(l.code)} className="lang-tab"
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 18px",
                  borderRadius:6, border:`1px solid ${active ? l.color+"60" : BORD}`,
                  background: active ? `${l.color}14` : "transparent",
                  cursor:"pointer", transition:"all .15s" }}>
                <Ring pct={lpct/100} size={42} stroke={4} color={active ? l.light : l.color}
                  trackColor="rgba(255,255,255,0.06)">
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
                    color: active ? l.light : MUTED }}>{lpct}%</span>
                </Ring>
                <div style={{ textAlign:"left" }}>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:15,
                    color: active ? l.light : MUTED, letterSpacing:"0.06em",
                    lineHeight:1.2 }}>{l.name}</p>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:DIM,
                    fontStyle:"italic" }}>{l.script}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current lesson pill */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10,
          background:`${lang.color}10`, border:`1px solid ${lang.color}30`,
          borderRadius:20, padding:"8px 18px" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:lang.light,
            animation:"shimmer 2s ease-in-out infinite" }}/>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
            color:lang.light, letterSpacing:"0.1em" }}>
            {langCode==="ES" ? "2.3 — Present Subjunctive" :
             langCode==="FR" ? "1.1 — Bonjour! Greetings" :
             langCode==="JP" ? "1.1 — Hiragana" : "1.1 — Hangul"} ▶
          </span>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="res-overview-body" style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* LEFT: Big progress panel */}
        <div className="res-overview-left" style={{ width:320, flexShrink:0, borderRight:`1px solid ${BORD}`,
          background:CARD, display:"flex", flexDirection:"column",
          padding:"0 20px 20px", gap:20, overflowY:"auto" }}>

          {/* Big ring */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14,
            paddingTop:20, borderBottom:`1px solid ${BORD}`, paddingBottom:20 }}>
            <Ring pct={0.27} size={160} stroke={9} color={lang.light}
              trackColor="rgba(212,168,67,0.14)">
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:36, color:lang.light,
                lineHeight:1 }}>27%</span>
              <span style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED,
                fontStyle:"italic", marginTop:3 }}>course</span>
            </Ring>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, color:CREAM,
                letterSpacing:"0.03em" }}>{lang.name}</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:MUTED,
                fontStyle:"italic", marginTop:4 }}>{course.units.length} units · {totalN} skills</p>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ background:CARD2, border:`1px solid ${BORD}`,
            borderRadius:6, padding:"16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                color:MUTED, letterSpacing:"0.12em" }}>TOTAL XP</span>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14,
                color:lang.light }}>{course.earnedXP.toLocaleString()}</span>
            </div>
            <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.05)",
              overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:3, width:`${xpPct*100}%`,
                background:`linear-gradient(90deg,${lang.color},${lang.light})`,
                transition:"width .8s cubic-bezier(.4,0,.2,1)" }}/>
            </div>
            <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:DIM,
              fontStyle:"italic", marginTop:8, textAlign:"right" }}>
              of {course.totalPossibleXP.toLocaleString()} possible
            </p>
          </div>

          {/* Mastery breakdown — mini rings */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
              color:MUTED, letterSpacing:"0.12em" }}>SKILL BREAKDOWN</p>
            {[
              { label:"Mastered",   n:masteredN, c:M.mastered.c   },
              { label:"Proficient", n:profN,     c:M.proficient.c },
              { label:"Familiar",   n:famN,      c:M.familiar.c   },
              { label:"Not started",n:totalN-masteredN-profN-famN-allLessons.filter(l=>l.mastery==="attempted").length, c:M.not_started.c },
            ].map((row,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
                      letterSpacing:"0.06em", color:row.c }}>{row.label}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
                      color:MUTED }}>{row.n}</span>
                  </div>
                  <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ height:"100%", borderRadius:2, background:row.c,
                      width:`${(row.n/totalN)*100}%`, transition:"width .6s" }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Unit quick-jump */}
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginTop:4 }}>
            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
              color:MUTED, letterSpacing:"0.12em", marginBottom:6 }}>UNITS</p>
            {course.units.map(u => {
              const done = u.lessons.filter(l => l.mastery!=="not_started").length;
              const upct = done / u.lessons.length;
              return (
                <button key={u.id}
                  onClick={() => document.getElementById(`unit-${langCode}-${u.id}`)
                    ?.scrollIntoView({behavior:"smooth", block:"start"})}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                    borderRadius:4, border:"none", background:"transparent",
                    cursor:"pointer", textAlign:"left", transition:"all .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(212,168,67,0.12)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <Ring pct={upct} size={32} stroke={3} color={u.light}
                    trackColor="rgba(255,255,255,0.07)">
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                      color:u.color }}>{u.id}</span>
                  </Ring>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14,
                    color:BODY, letterSpacing:"0.03em", lineHeight:1.3 }}>{u.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Units scroll */}
        <div className="res-overview-right" style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* ══ INTERMEDIATE PROGRESS BANNER ══ */}
          {langCode === "ES" && (
            <div className="res-banner" style={{ flexShrink:0, borderBottom:`1px solid ${lang.color}25`,
              background:`linear-gradient(135deg, ${lang.color}0e 0%, ${CARD2} 60%)`,
              backgroundImage:`${GRAIN}, linear-gradient(135deg, ${lang.color}0e 0%, ${CARD2} 60%)`,
              backgroundSize:"300px, 100%",
              padding:"28px 36px 24px", position:"relative", overflow:"hidden" }}>

              {/* Decorative background number */}
              <div style={{ position:"absolute", right:36, top:"50%", transform:"translateY(-50%)",
                fontFamily:"'Oswald',sans-serif", fontSize:120, fontWeight:700,
                color:`${lang.color}07`, lineHeight:1, userSelect:"none",
                letterSpacing:"-0.04em", pointerEvents:"none" }}>17%</div>

              {/* Top label row */}
              <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:16 }}>
                <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                  color:lang.color, letterSpacing:"0.18em" }}>INTERMEDIATE SPANISH</p>
                <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${lang.color}30,transparent)` }}/>
                <p style={{ fontFamily:"'Lora',serif", fontSize:10, color:MUTED,
                  fontStyle:"italic" }}>Unit 2 — Intermediate Grammar</p>
              </div>

              {/* Main row: pct + bar + XP */}
              <div className="res-banner-main-row" style={{ display:"flex", alignItems:"center", gap:24 }}>

                {/* Big % */}
                <div style={{ flexShrink:0, lineHeight:1 }}>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:52,
                    fontWeight:700, color:lang.light, letterSpacing:"-0.02em" }}>17</span>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:22,
                    color:lang.color, letterSpacing:"0.04em" }}>%</span>
                </div>

                {/* Bar + legend */}
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
                  {/* Bar */}
                  <div style={{ position:"relative", height:12, borderRadius:6,
                    background:"rgba(255,255,255,0.05)",
                    border:`1px solid ${lang.color}20`, overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:0, width:"17%",
                      background:`linear-gradient(90deg, ${lang.color}, ${lang.light})`,
                      borderRadius:6, transition:"width .8s cubic-bezier(.4,0,.2,1)" }}/>
                    {/* Tick marks at 25/50/75 */}
                    {[25,50,75].map(t => (
                      <div key={t} style={{ position:"absolute", top:0, bottom:0,
                        left:`${t}%`, width:1, background:`${lang.color}20` }}/>
                    ))}
                  </div>
                  {/* Legend */}
                  <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                    {Object.entries(M).map(([k,mv]) => (
                      <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:9, height:9, borderRadius:2,
                          background:mv.bg||"transparent", border:`1.5px solid ${mv.c}` }}/>
                        <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
                          color:BODY, letterSpacing:"0.05em" }}>{mv.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* XP block */}
                <div className="res-banner-xp" style={{ flexShrink:0, textAlign:"right", paddingLeft:16,
                  borderLeft:`1px solid ${lang.color}20` }}>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:48,
                    color:lang.light, lineHeight:1, letterSpacing:"-0.01em" }}>
                    175<span style={{ fontSize:20, color:MUTED, fontWeight:400,
                      marginLeft:5 }}>XP</span>
                  </p>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:DIM,
                    fontStyle:"italic", marginTop:6 }}>of 1,050 in this unit</p>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
                    color:lang.color, letterSpacing:"0.1em", marginTop:8 }}>
                    3 / 7 SKILLS STARTED</p>
                </div>
              </div>
            </div>
          )}

          {/* SCROLLABLE CONTENT */}
          <div className="res-overview-right-scroll" style={{ flex:1, overflowY:"auto", padding:"0 0 60px" }}>

          {/* Legend */}
          <div style={{ padding:"16px 36px 0" }}>
          <div style={{ display:"flex", gap:14, marginBottom:28, flexWrap:"wrap",
            alignItems:"center" }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
              color:DIM, letterSpacing:"0.1em" }}>LEGEND</span>
            {Object.entries(M).map(([k,mv]) => (
              <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:12, height:12, borderRadius:2,
                  background:mv.bg, border:`1.5px solid ${mv.c}` }}/>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:9.5,
                  color:BODY, letterSpacing:"0.04em" }}>{mv.label}</span>
              </div>
            ))}
          </div>
          </div>{/* end legend padding wrapper */}

          <div className="res-units-padding" style={{ padding:"0 36px" }}>
          {/* Units */}
          {course.units.map((unit, ui) => {
            const nonTest = unit.lessons.filter(l => !l.isTest);
            const tests   = unit.lessons.filter(l =>  l.isTest);
            const doneCt  = unit.lessons.filter(l => l.mastery!=="not_started").length;
            const unitPct = doneCt / unit.lessons.length;

            return (
              <div key={unit.id} id={`unit-${langCode}-${unit.id}`}
                className="unit-card"
                style={{ marginBottom:20, border:`1px solid ${BORD}`,
                  borderRadius:8, overflow:"hidden",
                  transition:"border-color .15s",
                  animation:`fadeUp .3s ease ${ui*0.06}s both` }}>

                {/* Unit header */}
                <div style={{ display:"flex", alignItems:"center", gap:16,
                  padding:"16px 22px", background:CARD2,
                  borderBottom:`1px solid ${BORD}` }}>

                  {/* Unit ring */}
                  <Ring pct={unitPct} size={52} stroke={4} color={unit.light}
                    trackColor="rgba(255,255,255,0.06)">
                    <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
                      color:unit.color, lineHeight:1 }}>{unit.id}</span>
                  </Ring>

                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                      color:unit.color, letterSpacing:"0.12em", marginBottom:3 }}>
                      UNIT {unit.id}</p>
                    <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:16,
                      color:CREAM, letterSpacing:"0.02em" }}>{unit.title}</p>
                  </div>

                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:20,
                      color:doneCt===unit.lessons.length ? unit.light : MUTED, lineHeight:1 }}>
                      {doneCt}<span style={{ fontSize:12, color:DIM }}>/{unit.lessons.length}</span>
                    </p>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:9,
                      color:DIM, fontStyle:"italic", marginTop:2 }}>skills started</p>
                  </div>
                </div>

                {/* Chips row */}
                <div style={{ padding:"14px 22px", display:"flex",
                  alignItems:"center", gap:7, flexWrap:"wrap",
                  background:`${unit.color}04` }}>
                  {nonTest.map(lesson => (
                    <div key={lesson.id} className="chip-btn"
                      style={{ transition:"transform .12s" }}>
                      <LessonChip lesson={lesson} color={unit.color} light={unit.light}
                        onClick={l => { setPopup(l); setPopupMeta(unit); }}/>
                    </div>
                  ))}
                  {tests.length > 0 && (
                    <>
                      <div style={{ width:1, height:24, background:BORD, margin:"0 2px" }}/>
                      {tests.map(lesson => (
                        <div key={lesson.id} className="chip-btn"
                          style={{ transition:"transform .12s" }}>
                          <LessonChip lesson={lesson} color={unit.color} light={unit.light}
                            onClick={l => { setPopup(l); setPopupMeta(unit); }}/>
                        </div>
                      ))}
                    </>
                  )}
                  {unit.lessons.some(l => l.active) && (
                    <div style={{ marginLeft:"auto", display:"flex", alignItems:"center",
                      gap:6, background:`${GOLDLT}10`, border:`1px solid ${GOLDLT}30`,
                      borderRadius:20, padding:"4px 12px" }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:GOLDLT,
                        animation:"shimmer 1.5s ease-in-out infinite" }}/>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                        color:GOLDLT, letterSpacing:"0.1em" }}>UP NEXT FOR YOU</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          </div>{/* end units padding wrapper */}
          <div className="res-units-padding" style={{ padding:"0 36px" }}>
          {/* Course challenge */}
          <div style={{ border:`1px solid rgba(212,168,67,0.15)`,
            borderLeft:`4px solid ${lang.color}`,
            borderRadius:"0 8px 8px 0", padding:"20px 24px",
            display:"flex", alignItems:"center", gap:20,
            background:`${lang.color}06`, marginTop:8 }}>
            <Ring pct={overallPct/100} size={56} stroke={4} color={lang.light}
              trackColor="rgba(212,168,67,0.14)">
              <svg width={16} height={16} viewBox="0 0 24 24" fill={overallPct>=80?lang.light:DIM}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </Ring>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
                letterSpacing:"0.14em", color:lang.color, marginBottom:4 }}>COURSE CHALLENGE</p>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:15, color:CREAM,
                letterSpacing:"0.02em", marginBottom:4 }}>
                Test knowledge across all {course.units.length} units</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:MUTED, fontStyle:"italic" }}>
                {overallPct >= 80
                  ? "You're ready — take the challenge!"
                  : `Reach 80% mastery to unlock. You're at ${overallPct}%.`}
              </p>
            </div>
            <button style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
              letterSpacing:"0.1em", padding:"10px 20px", borderRadius:5,
              border:`1px solid ${overallPct>=80 ? lang.light+"60" : DIM}`,
              background: overallPct>=80 ? `${lang.color}20` : "transparent",
              color: overallPct>=80 ? lang.light : DIM,
              cursor: overallPct>=80 ? "pointer" : "not-allowed",
              opacity: overallPct>=80 ? 1 : 0.5 }}>
              {overallPct >= 80 ? "BEGIN →" : "LOCKED"}
            </button>
          </div>
          </div>{/* end challenge padding */}
          </div>{/* end scrollable content */}
        </div>
      </div>

      {popup && popupMeta && (
        <LessonPopup lesson={popup} color={popupMeta.color} light={popupMeta.light}
          onOpen={l => onOpenLesson(l)} onClose={() => { setPopup(null); setPopupMeta(null); }}/>
      )}
    </div>
  );
}