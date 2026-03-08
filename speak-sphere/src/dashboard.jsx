import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─── DESIGN TOKENS — dark academia (matches landing page) ─── */
const DARK   = "#140b04";
const SURF   = "#1d0f06";
const CARD   = "#1a0d05";
const CREAM  = "#eadcca";
const GOLD   = "#c9a05a";
const GOLDLT = "#e8c07a";
const MUTED  = "#9a7d5a";
const DIM    = "#5a3a22";
const BORD   = "rgba(201,160,90,0.14)";

const A_BLUE   = "#6a9ec0";
const A_GREEN  = "#7db87d";
const A_ROSE   = "#c07070";
const A_VIOLET = "#9a7db8";
const A_AMBER  = GOLD;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

/* ─── DATA ─── */
const LEARNER_LVL = [
  { n:1, title:"Novice",         xp:0     },
  { n:2, title:"Apprentice",     xp:500   },
  { n:3, title:"Journeyman",     xp:1200  },
  { n:4, title:"Scholar",        xp:2500  },
  { n:5, title:"Linguist",       xp:5000  },
  { n:6, title:"Polyglot",       xp:9000  },
  { n:7, title:"Grand Linguist", xp:15000 },
];
const TUTOR_LVL = [
  { n:1, title:"Apprentice Tutor", sessions:0   },
  { n:2, title:"Guide",            sessions:5   },
  { n:3, title:"Mentor",           sessions:20  },
  { n:4, title:"Master",           sessions:60  },
  { n:5, title:"Grand Master",     sessions:150 },
];
const ALL_LANGS = [
  { code:"ES", name:"Spanish",  script:"Hola",      c:A_AMBER  },
  { code:"FR", name:"French",   script:"Bonjour",   c:A_BLUE   },
  { code:"JP", name:"Japanese", script:"こんにちは", c:A_ROSE   },
  { code:"KO", name:"Korean",   script:"안녕하세요",  c:A_GREEN  },
  { code:"DE", name:"German",   script:"Hallo",     c:A_VIOLET },
];
const USER = {
  name:"Mishka Mittal", initials:"MM",
  languages:[
    {
      code:"ES",
      learner:{
        xp:1840, level:3, streak:12, best:21,
        week:[3,5,2,4,6,3,1],
        skills:{ vocab:68, grammar:54, reading:72, speaking:45 },
        dailyQ:{ q:"Past tense of 'ir' (to go)?", opts:["iba","fui","voy","fue"], ans:1, done:false },
        sessions:[
          { title:"Conversation Practice", with:"Carlos M.", date:"Mar 6", stars:5, duration:"45 min" },
          { title:"Grammar Deep Dive",      with:"Sofia R.",  date:"Mar 3", stars:4, duration:"60 min" },
          { title:"Vocab Sprint",           with:"Luis P.",   date:"Feb 28",stars:5, duration:"30 min" },
        ],
        resources:[
          { title:"Ser vs Estar",          type:"Lesson", diff:"Intermediate", time:"12 min" },
          { title:"Preterite Tense Quiz",  type:"Quiz",   diff:"Intermediate", time:"8 min"  },
          { title:"Chilean Slang",         type:"Video",  diff:"Advanced",     time:"18 min" },
        ],
        placement:"Intermediate", sessionsTotal:24, avgScore:60,
      },
      tutor:{
        level:2, hosted:14, rating:4.7, students:38, hours:21,
        upcoming:[
          { title:"Spanish Basics",   student:"Alex T.",  date:"Mar 10, 4:00 PM", spots:3 },
          { title:"Verb Conjugation", student:"Priya M.", date:"Mar 12, 6:00 PM", spots:1 },
        ],
        reviews:[
          { from:"Jamie L.", stars:5, text:"Super patient and explains things clearly!" },
          { from:"Priya M.", stars:5, text:"Best tutor on the platform." },
        ],
        badges:["First Session","5 Sessions","Top Rated"],
      },
    },
    {
      code:"FR",
      learner:{
        xp:430, level:1, streak:3, best:7,
        week:[0,1,0,2,1,0,1],
        skills:{ vocab:32, grammar:28, reading:41, speaking:19 },
        dailyQ:{ q:"'I am going to the store'?",
          opts:["Je vais au magasin","Je suis au magasin","J'aime le magasin","Je mange au magasin"], ans:0, done:false },
        sessions:[{ title:"French Basics", with:"Claire D.", date:"Mar 5", stars:5, duration:"30 min" }],
        resources:[
          { title:"French Greetings", type:"Lesson", diff:"Beginner", time:"6 min" },
          { title:"Basic Verb Quiz",  type:"Quiz",   diff:"Beginner", time:"5 min" },
        ],
        placement:"Beginner", sessionsTotal:1, avgScore:40,
      },
      tutor:{ level:1, hosted:0, rating:0, students:0, hours:0, upcoming:[], reviews:[], badges:[] },
    },
  ],
};

const NAV_ITEMS = [
  { id:"dashboard",    label:"Dashboard"     },
  { id:"calendar",     label:"Schedule"      },
  { id:"resources",    label:"Resources"     },
  { id:"ai-tutor",     label:"AI Tutor"      },
  { id:"pronunciation",label:"Pronunciation" },
  { id:"pen-pals",     label:"Pen Pals"      },
  { id:"community",    label:"Community"     },
];
const ROUTES = { calendar:"/calendar", resources:"/resources", "ai-tutor":"/ai-tutor",
  pronunciation:"/pronunciation", "pen-pals":"/pen-pals", community:"/community" };

/* ─── SVG ICONS ─── */
function Ico({ d, size=16, color=MUTED, sw=1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
const IcoGrid  = p => <><Ico {...p} d="M3 3h7v7H3z"/><Ico {...p} d="M14 3h7v7h-7z"/><Ico {...p} d="M3 14h7v7H3z"/><Ico {...p} d="M14 14h7v7h-7z"/></>;
const IcoCal   = p => <Ico {...p} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>;
const IcoBook  = p => <Ico {...p} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>;
const IcoBot   = p => <Ico {...p} d="M12 2a4 4 0 014 4v1h1a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1V6a4 4 0 014-4z"/>;
const IcoMic   = p => <Ico {...p} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>;
const IcoMail  = p => <Ico {...p} d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"/>;
const IcoChat  = p => <Ico {...p} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>;
const IcoGear  = p => <Ico {...p} d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>;
const IcoPlus  = p => <Ico {...p} d="M12 5v14M5 12h14"/>;
const IcoArrow = ({ size=14, color=GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke={color} strokeWidth="1.6" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
);
const NAV_ICONS = { dashboard:IcoGrid, calendar:IcoCal, resources:IcoBook,
  "ai-tutor":IcoBot, pronunciation:IcoMic, "pen-pals":IcoMail, community:IcoChat };

/* ─── ANIMATED COUNTER ─── */
function AnimNum({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s, id;
    const run = ts => { if(!s) s=ts; const p=Math.min((ts-s)/900,1); setV(Math.round(p*to)); if(p<1) id=requestAnimationFrame(run); };
    id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{v.toLocaleString()}</>;
}

/* ─── GLOW BAR ─── */
function GlowBar({ pct, color, h=7 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 120); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height:h, borderRadius:99, background:"rgba(255,255,255,0.04)", overflow:"visible", position:"relative" }}>
      <div style={{ height:"100%", width:`${w}%`, borderRadius:99, background:color,
        transition:"width 1.1s cubic-bezier(.4,0,.2,1)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)",
          animation:"shimmer 2s infinite" }}/>
      </div>
    </div>
  );
}

/* ─── GLOW RING ─── */
function GlowRing({ label, pct, color, size=70 }) {
  const r = (size-14)/2, circ = 2*Math.PI*r;
  const [d, setD] = useState(0);
  useEffect(() => { const t = setTimeout(() => setD(pct), 200); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)", display:"block", overflow:"visible" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ - circ*d/100}
            style={{ transition:"stroke-dashoffset 1.1s ease" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
          justifyContent:"center", fontFamily:"'Oswald',sans-serif", fontSize:13,
          fontWeight:700, color:CREAM }}>{pct}%</div>
      </div>
      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, fontWeight:600,
        color:MUTED, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</span>
    </div>
  );
}

/* ─── WEEK BARS ─── */
const DAYLABELS = ["S","M","T","W","T","F","S"];
function WeekBars({ data, color, h=46 }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display:"flex", gap:5, alignItems:"flex-end" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div title={`${v} sessions`} style={{
            width:"100%", height:Math.max(3, (v/max)*h), borderRadius:3,
            background: v ? color : "rgba(255,255,255,0.04)",
            boxShadow: "none",
            opacity: v ? 0.3+(v/max)*0.7 : 1,
            transition:"height .7s ease",
          }}/>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, color:DIM }}>{DAYLABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── STARS ─── */
function Stars({ n, size=12 }) {
  return (
    <span style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 14 14"
          fill={i<=n ? GOLD : "none"} stroke={GOLD} strokeWidth="1">
          <polygon points="7,1 8.8,5.2 13.5,5.6 10,8.7 11.1,13.3 7,10.8 2.9,13.3 4,8.7 0.5,5.6 5.2,5.2"/>
        </svg>
      ))}
    </span>
  );
}

/* ─── CARD WRAPPER ─── */
function Card({ children, style={} }) {
  return (
    <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:8,
      backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
      ...style }}>
      {children}
    </div>
  );
}

/* ─── DAILY QUESTION ─── */
function DailyQuestion({ q, opts, ans, done, onDone }) {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(done);

  function pick(i) {
    if (revealed) return;
    setPicked(i); setRevealed(true);
    if (i === ans) onDone();
  }

  const optColors = [A_AMBER, A_BLUE, A_GREEN, A_ROSE];
  const optLabels = ["A","B","C","D"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:CREAM, lineHeight:1.6, marginBottom:4 }}>
        {q}
      </p>
      {opts.map((o, i) => {
        const isCorrect = i === ans, isChosen = i === picked;
        let bg = `rgba(201,160,90,0.04)`;
        let bord = `1px solid rgba(201,160,90,0.12)`;
        let col = CREAM;
        if (revealed && isCorrect) { bg = "rgba(125,184,125,0.12)"; bord=`1px solid ${A_GREEN}55`; col=A_GREEN; }
        if (revealed && isChosen && !isCorrect) { bg = "rgba(192,112,112,0.1)"; bord=`1px solid ${A_ROSE}44`; col=A_ROSE; }
        return (
          <button key={i} onClick={() => pick(i)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px",
              background:bg, border:bord, borderRadius:5, cursor:revealed?"default":"pointer",
              textAlign:"left", transition:"all .18s" }}>
            <span style={{ width:22, height:22, borderRadius:4, background:`${optColors[i]}18`,
              border:`1px solid ${optColors[i]}44`, display:"flex", alignItems:"center",
              justifyContent:"center", fontFamily:"'Oswald',sans-serif", fontSize:10,
              color:optColors[i], flexShrink:0 }}>{optLabels[i]}</span>
            <span style={{ fontFamily:"'Lora',serif", fontSize:13, color:col }}>{o}</span>
          </button>
        );
      })}
      {revealed && (
        <p style={{ fontFamily:"'Lora',serif", fontSize:12, fontStyle:"italic",
          color:picked===ans ? A_GREEN : A_ROSE, marginTop:4 }}>
          {picked===ans ? "Correct — well done." : `The answer was "${opts[ans]}".`}
        </p>
      )}
    </div>
  );
}

/* ─── ADD LANGUAGE MODAL ─── */
function AddLangModal({ onAdd, onClose, existing }) {
  const available = ALL_LANGS.filter(l => !existing.includes(l.code));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,5,2,0.85)",
      backdropFilter:"blur(8px)", zIndex:999, display:"flex",
      alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <Card style={{ padding:32, width:380, maxWidth:"90vw" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, color:CREAM, letterSpacing:"0.04em" }}>
            Add a Language</h2>
          <button onClick={onClose} style={{ background:"none", border:"none",
            cursor:"pointer", color:MUTED, fontSize:22, lineHeight:1, padding:"0 4px" }}>×</button>
        </div>
        {available.length === 0
          ? <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#c4aa80", fontStyle:"italic" }}>
              You're enrolled in all languages!</p>
          : available.map(l => (
            <button key={l.code} onClick={()=>{ onAdd(l); onClose(); }}
              style={{ display:"flex", alignItems:"center", gap:14, width:"100%",
                background:"transparent", border:`1px solid ${BORD}`, borderRadius:5,
                padding:"12px 16px", cursor:"pointer", marginBottom:8, transition:"all .2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${l.c}10`; e.currentTarget.style.borderColor=`${l.c}55`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=BORD; }}>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, color:l.c, width:40 }}>
                {l.script.slice(0,4)}</span>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM, letterSpacing:"0.04em" }}>
                {l.name}</span>
            </button>
          ))
        }
      </Card>
    </div>
  );
}

/* ─── HERO BANNER ─── */
const BANNERS = [
  {
    tag:    "Your streak is alive",
    title:  "12 days and counting.",
    body:   "You've studied Spanish every day this week. Don't let the chain break — your daily question is waiting.",
    cta:    "Answer today's question",
    path:   null, // scrolls to daily Q
    accent: GOLD,
    pattern: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(201,160,90,0.13) 0%, transparent 70%)",
  },
  {
    tag:    "Ready to level up?",
    title:  "660 XP from Scholar.",
    body:   "You're a Journeyman — but Scholar is within reach. Three focused sessions this week will get you there.",
    cta:    "Book a session",
    path:   "/calendar",
    accent: A_BLUE,
    pattern: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(106,158,192,0.13) 0%, transparent 70%)",
  },
  {
    tag:    "Your weakest skill",
    title:  "Speaking is at 45%.",
    body:   "Reading and vocab are strong — but speaking is where fluency is won. Book a conversation session today.",
    cta:    "Find a tutor",
    path:   "/calendar",
    accent: A_ROSE,
    pattern: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(192,112,112,0.13) 0%, transparent 70%)",
  },
  {
    tag:    "Your students are waiting",
    title:  "2 upcoming sessions.",
    body:   "You're a Guide-level tutor with a 4.7 rating. Your next session is March 10 — review your notes.",
    cta:    "View schedule",
    path:   "/calendar",
    accent: A_GREEN,
    pattern: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(125,184,125,0.13) 0%, transparent 70%)",
  },
];

function HeroBanner({ onDailyQ, navigate }) {
  const [idx, setIdx]         = useState(0);
  const [hovered, setHovered] = useState(false);
  const [fading, setFading]   = useState(false);

  // Auto-rotate every 6s, pauses on hover
  useEffect(() => {
    if (hovered) return;
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(i => (i+1) % BANNERS.length); setFading(false); }, 260);
    }, 6000);
    return () => clearInterval(t);
  }, [hovered]);

  function goTo(i) {
    setFading(true);
    setTimeout(() => { setIdx(i); setFading(false); }, 200);
  }

  const b = BANNERS[idx];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position:"relative", borderRadius:8, overflow:"hidden", cursor:"default",
        border:`1px solid rgba(201,160,90,0.14)`,
        background: CARD,
        backgroundImage: GRAIN,
        backgroundRepeat:"repeat", backgroundSize:"300px",
        marginBottom:20, transition:"border-color .25s",
        minHeight:"52vh",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        borderColor: hovered ? `${b.accent}55` : "rgba(201,160,90,0.14)" }}>

      {/* Decorative pattern layer */}
      <div style={{ position:"absolute", inset:0, background:b.pattern,
        transition:"background .5s ease", pointerEvents:"none" }}/>

      {/* Giant background word — right-aligned, fully contained */}
      <div style={{ position:"absolute", right:50, top:0, bottom:0,
        display:"flex", alignItems:"center",
        fontFamily:"'Oswald',sans-serif", fontSize:"clamp(140px, 22vw, 350px)", fontWeight:700,
        letterSpacing:"-0.04em", lineHeight:1, paddingRight:24,
        color:b.accent, opacity: hovered ? 0.13 : 0.08,
        transition:"opacity .35s", pointerEvents:"none", userSelect:"none" }}>
        {idx === 0 ? "12" : idx === 1 ? "XP" : idx === 2 ? "ES" : "GO"}
      </div>

      {/* ── TOP STATS STRIP — normal flow so it isn't clipped ── */}
      <div style={{ position:"relative", zIndex:1,
        display:"flex", gap:0,
        borderBottom:`1px solid rgba(201,160,90,0.08)`, flexShrink:0 }}>
        {[
          { label:"Current Level",   value:"Journeyman",  sub:"Spanish"          },
          { label:"Total XP",        value:"1,840",       sub:"660 to Scholar"   },
          { label:"Day Streak",      value:"12",          sub:"Best: 21 days"    },
          { label:"Sessions",        value:"24",          sub:"3 this week"      },
          { label:"Avg Score",       value:"60%",         sub:"Intermediate"     },
          { label:"Tutor Rating",    value:"4.7",         sub:"38 students"      },
        ].map((s, i) => (
          <div key={i} style={{ flex:1,
            paddingTop:20, paddingBottom:16,
            paddingLeft: i === 0 ? 36 : 20, paddingRight: i === 5 ? 36 : 20,
            borderRight: i < 5 ? `1px solid rgba(201,160,90,0.08)` : "none" }}>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, letterSpacing:"0.16em",
              textTransform:"uppercase", color:MUTED, marginBottom:5 }}>{s.label}</p>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, color:CREAM,
              letterSpacing:"0.02em", lineHeight:1 }}>{s.value}</p>
            <p style={{ fontFamily:"'Lora',serif", fontSize:10, color:"#c4aa80",
              fontStyle:"italic", marginTop:3 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Content — pinned to bottom-left */}
      <div style={{ position:"relative", padding:"36px 36px 32px",
        opacity: fading ? 0 : 1, transition:"opacity .26s ease" }}>

        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.2em",
          textTransform:"uppercase", color:b.accent, marginBottom:10 }}>{b.tag}</p>

        <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:38, color:CREAM,
          letterSpacing:"0.01em", lineHeight:1.15, marginBottom:14,
          maxWidth:600 }}>{b.title}</h2>

        <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:"#c8b89a",
          lineHeight:1.7, fontStyle:"italic", maxWidth:520,
          opacity: hovered ? 1 : 0.75,
          transition:"opacity .3s ease" }}>
          {b.body}
        </p>

        {/* CTA */}
        <button
          onClick={() => b.path ? navigate(b.path) : onDailyQ?.()}
          style={{ marginTop:22, fontFamily:"'Oswald',sans-serif", fontSize:11,
            letterSpacing:"0.12em", textTransform:"uppercase",
            padding:"10px 24px", borderRadius:4, border:`1px solid ${b.accent}`,
            background: hovered ? b.accent : "transparent",
            color: hovered ? DARK : b.accent,
            cursor:"pointer", transition:"all .25s",
            display:"inline-flex", alignItems:"center", gap:8,
            fontWeight:600 }}>
          {b.cta}
          <IcoArrow size={12} color={hovered ? DARK : b.accent}/>
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ position:"absolute", top:20, right:20,
        display:"flex", gap:6, alignItems:"center" }}>
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i===idx ? 18 : 6, height:6, borderRadius:3,
              background: i===idx ? b.accent : "rgba(201,160,90,0.2)",
              border:"none", cursor:"pointer", padding:0,
              transition:"all .3s ease" }}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function Dashboard() {
  const navigate   = useNavigate();
  const [tab,      setTab]      = useState("learner");
  const [lcode,    setLcode]    = useState("ES");
  const [langs,    setLangs]    = useState(USER.languages);
  const [addModal, setAddModal] = useState(false);
  const [doneDQ,   setDoneDQ]   = useState({});
  const [toast,    setToast]    = useState(null);
  const [page,     setPage]     = useState("dashboard");
  const [sideExpanded, setSideExpanded] = useState(false);
  const dqRef = useRef(null);

  const lm   = ALL_LANGS.find(l => l.code === lcode) || ALL_LANGS[0];
  const lang = langs.find(l => l.code === lcode) || langs[0];
  const ld   = lang.learner;
  const td   = lang.tutor;
  const lLvl = LEARNER_LVL.find(l => l.n === ld.level) || LEARNER_LVL[0];
  const lNxt = LEARNER_LVL.find(l => l.n === ld.level + 1);
  const lPct = lNxt ? Math.min(((ld.xp - lLvl.xp) / (lNxt.xp - lLvl.xp)) * 100, 100) : 100;
  const tLvl = TUTOR_LVL.find(l => l.n === td.level) || TUTOR_LVL[0];
  const tNxt = TUTOR_LVL.find(l => l.n === td.level + 1);
  const tPct = tNxt ? Math.min((td.hosted / tNxt.sessions) * 100, 100) : 100;
  const isDQ = doneDQ[lcode] || ld.dailyQ.done;

  const sideW = sideExpanded ? 210 : 56;

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  function fireToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function scrollToDQ() {
    dqRef.current?.scrollIntoView({ behavior:"smooth", block:"center" });
  }

  function addLang(l) {
    setLangs(prev => [...prev, {
      code:l.code,
      learner:{ xp:0, level:1, streak:0, best:0, week:[0,0,0,0,0,0,0],
        skills:{vocab:0,grammar:0,reading:0,speaking:0},
        dailyQ:{q:`How do you say 'hello' in ${l.name}?`,
          opts:["Hello","Goodbye","Please","Thank you"], ans:0, done:false},
        sessions:[], resources:[], placement:"Beginner", sessionsTotal:0, avgScore:0 },
      tutor:{ level:1, hosted:0, rating:0, students:0, hours:0, upcoming:[], reviews:[], badges:[] },
    }]);
    setLcode(l.code);
    fireToast(`${l.name} added!`);
  }

  /* ── QUICK ACCESS BUTTONS ── */
  const quickLinks = [
    { label:"Book Session",  path:"/calendar",      c:A_BLUE   },
    { label:"AI Tutor Chat", path:"/ai-tutor",      c:A_AMBER  },
    { label:"Pronunciation", path:"/pronunciation", c:A_ROSE   },
    { label:"Resources",     path:"/resources",     c:A_GREEN  },
    { label:"Pen Pals",      path:"/pen-pals",      c:A_VIOLET },
    { label:"Community",     path:"/community",     c:MUTED    },
  ];

  /* ── SIDEBAR ── */
  const sidebar = (
    <aside
      onMouseEnter={() => setSideExpanded(true)}
      onMouseLeave={() => setSideExpanded(false)}
      style={{ width:sideW, flexShrink:0, background:DARK,
        borderRight:`1px solid ${BORD}`, position:"fixed", top:0, left:0, bottom:0,
        zIndex:50, display:"flex", flexDirection:"column",
        backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
        transition:"width .22s cubic-bezier(.4,0,.2,1)", overflow:"hidden" }}>

      {/* Logo */}
      <div style={{ padding:"20px 14px 16px", borderBottom:`1px solid rgba(201,160,90,0.08)`,
        cursor:"pointer", display:"flex", alignItems:"center", gap:10, flexShrink:0,
        minWidth:210 }}
        onClick={() => navigate("/")}>
        <svg width={26} height={26} viewBox="0 0 26 26" fill="none" style={{ flexShrink:0 }}>
          <circle cx="13" cy="13" r="11" stroke={GOLD} strokeWidth="1.2"/>
          <ellipse cx="13" cy="13" rx="5" ry="11" stroke={GOLD} strokeWidth="0.8" opacity=".5"/>
          <line x1="2" y1="13" x2="24" y2="13" stroke={GOLD} strokeWidth="0.8" opacity=".4"/>
        </svg>
        <div style={{ opacity: sideExpanded ? 1 : 0, transition:"opacity .15s", whiteSpace:"nowrap" }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, fontWeight:600,
            color:CREAM, letterSpacing:"0.08em" }}>SPEAKSPHERE</p>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, color:DIM, letterSpacing:"0.14em" }}>
            LANGUAGE HUB</p>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
        {NAV_ITEMS.map(({ id, label }) => {
          const IconC = NAV_ICONS[id];
          const active = page === id;
          return (
            <button key={id}
              onClick={() => { if (ROUTES[id]) navigate(ROUTES[id]); else setPage(id); }}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                padding:"9px 11px", borderRadius:4, border:"none", marginBottom:2,
                background: active ? "rgba(201,160,90,0.09)" : "transparent",
                borderLeft: active ? `2px solid ${GOLD}` : "2px solid transparent",
                cursor:"pointer", transition:"all .14s", textAlign:"left",
                minWidth:210, overflow:"hidden" }}>
              <div style={{ flexShrink:0, width:20, display:"flex", justifyContent:"center" }}>
                <IconC size={16} color={active ? GOLD : MUTED}/>
              </div>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap",
                color: active ? CREAM : MUTED, fontWeight: active ? 600 : 400,
                opacity: sideExpanded ? 1 : 0, transition:"opacity .12s" }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ margin:"0 8px 12px", padding:"11px 10px",
        border:`1px solid ${BORD}`, borderRadius:6, background:"rgba(255,255,255,0.01)",
        flexShrink:0, minWidth:194, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:6, flexShrink:0,
            background:`linear-gradient(135deg,${GOLD},#8a5a20)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Oswald',sans-serif", fontSize:11, fontWeight:700, color:DARK }}>
            MM</div>
          <div style={{ flex:1, minWidth:0, opacity: sideExpanded ? 1 : 0, transition:"opacity .12s" }}>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:CREAM,
              letterSpacing:"0.04em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              Mishka Mittal</p>
            <p style={{ fontFamily:"'Lora',serif", fontSize:10, color:"#c4aa80", fontStyle:"italic" }}>
              {lLvl.title}</p>
          </div>
          <button onClick={() => fireToast("Settings coming soon.")}
            style={{ background:"none", border:"none", cursor:"pointer", padding:3, flexShrink:0,
              opacity: sideExpanded ? 1 : 0, transition:"opacity .12s" }}>
            <IcoGear size={13} color={DIM}/>
          </button>
        </div>
      </div>
    </aside>
  );

  /* ── RIGHT PANEL — streak / week / placement / daily Q / resources ── */
  const rightPanel = (
    <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>

      {/* This Week — full width, bigger */}
      <Card style={{ padding:"20px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:14 }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.14em",
            textTransform:"uppercase", color:MUTED }}>This Week</p>
          <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#c4aa80", fontStyle:"italic" }}>
            <AnimNum to={ld.sessionsTotal}/> sessions total · streak <span style={{color:GOLDLT}}>{ld.streak}</span> days</p>
        </div>
        <WeekBars data={ld.week} color={lm.c} h={64}/>
      </Card>

      {/* Placement */}
      <Card style={{ padding:"14px 16px" }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, letterSpacing:"0.14em",
          textTransform:"uppercase", color:MUTED, marginBottom:10 }}>Placement</p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM,
            letterSpacing:"0.04em" }}>{ld.placement}</span>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:lm.c }}>
            {ld.avgScore}% avg</span>
        </div>
        <div style={{ display:"flex", gap:10, fontFamily:"'Lora',serif", fontSize:11, color:"#c4aa80" }}>
          <span>{ld.sessionsTotal} sessions</span>
          <span>·</span>
          <span>3 this week</span>
        </div>
      </Card>

      {/* Suggested Resources */}
      <Card style={{ padding:"16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.14em",
            textTransform:"uppercase", color:MUTED }}>Suggested For You</p>
          <button onClick={() => navigate("/resources")}
            style={{ background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Oswald',sans-serif", fontSize:9, color:GOLD,
              letterSpacing:"0.1em", textTransform:"uppercase",
              display:"flex", alignItems:"center", gap:4 }}>
            See all <IcoArrow size={11}/>
          </button>
        </div>
        {ld.resources.map((r, i) => {
          const tc = { Video:A_BLUE, Quiz:A_ROSE, Lesson:A_AMBER }[r.type] || GOLD;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"9px 0", borderBottom: i < ld.resources.length-1 ? `1px solid rgba(201,160,90,0.07)` : "none",
              cursor:"pointer" }}>
              <div style={{ width:32, height:32, borderRadius:4, background:`${tc}12`,
                border:`1px solid ${tc}33`, display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:8,
                  color:tc, letterSpacing:"0.08em" }}>{r.type.slice(0,3).toUpperCase()}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:CREAM,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</p>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, color:MUTED,
                  letterSpacing:"0.06em", marginTop:2 }}>{r.diff} · {r.time}</p>
              </div>
              <IcoArrow size={12} color={DIM}/>
            </div>
          );
        })}
      </Card>
    </div>
  );

  /* ── LEARNER MAIN COLUMN ── */
  const learnerMain = (
    <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:16 }}>

      {/* XP / Level card */}
      <Card style={{ padding:"22px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200,
          borderRadius:"50%", background:"radial-gradient(circle,rgba(201,160,90,0.06),transparent 70%)",
          pointerEvents:"none" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:8, background:`${lm.c}18`,
              border:`1px solid ${lm.c}44`, display:"flex", alignItems:"center",
              justifyContent:"center" }}>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                fontWeight:700, color:lm.c }}>{lcode}</span>
            </div>
            <div>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.14em",
                textTransform:"uppercase", color:MUTED, marginBottom:3 }}>Learner Level</p>
              <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, color:CREAM,
                letterSpacing:"0.02em" }}>{lLvl.title}</h2>
            </div>
          </div>
          <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:lm.c,
            border:`1px solid ${lm.c}44`, borderRadius:20, padding:"4px 12px",
            letterSpacing:"0.06em" }}>
            {ALL_LANGS.find(l=>l.code===lcode)?.name || lcode}
          </div>
        </div>

        {/* XP bar */}
        <GlowBar pct={lPct} color={lm.c} h={8}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, color:MUTED }}>
            {ld.xp.toLocaleString()} XP</span>
          {lNxt && (
            <span style={{ fontFamily:"'Lora',serif", fontSize:10, color:"#c4aa80", fontStyle:"italic" }}>
              {(lNxt.xp - ld.xp).toLocaleString()} XP to {lNxt.title}</span>
          )}
        </div>
      </Card>

      {/* Skill Breakdown */}
      <Card style={{ padding:"22px 24px" }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.14em",
          textTransform:"uppercase", color:MUTED, marginBottom:20 }}>Skill Breakdown</p>

        {/* Glow rings row */}
        <div style={{ display:"flex", justifyContent:"space-around", marginBottom:24 }}>
          <GlowRing label="Vocab"    pct={ld.skills.vocab}    color={A_AMBER}  />
          <GlowRing label="Grammar"  pct={ld.skills.grammar}  color={A_BLUE}   />
          <GlowRing label="Reading"  pct={ld.skills.reading}  color={A_GREEN}  />
          <GlowRing label="Speaking" pct={ld.skills.speaking} color={A_ROSE}   />
        </div>

        {/* Bar chart list */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { label:"Vocabulary", k:"vocab",    c:A_AMBER  },
            { label:"Grammar",    k:"grammar",  c:A_BLUE   },
            { label:"Reading",    k:"reading",  c:A_GREEN  },
            { label:"Speaking",   k:"speaking", c:A_ROSE   },
          ].map(({ label, k, c }) => (
            <div key={k}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                  color:MUTED, letterSpacing:"0.06em" }}>{label}</span>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:c, fontWeight:600 }}>
                  {ld.skills[k]}%</span>
              </div>
              <GlowBar pct={ld.skills[k]} color={c} h={6}/>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Sessions */}
      <Card style={{ padding:"22px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.14em",
            textTransform:"uppercase", color:MUTED }}>Recent Sessions</p>
          <button onClick={() => navigate("/calendar")}
            style={{ background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Oswald',sans-serif", fontSize:9, color:GOLD,
              letterSpacing:"0.1em", textTransform:"uppercase",
              display:"flex", alignItems:"center", gap:4 }}>
            View all <IcoArrow size={11}/>
          </button>
        </div>
        {ld.sessions.length === 0
          ? <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#c4aa80", fontStyle:"italic" }}>
              No sessions yet — book one from the calendar.</p>
          : ld.sessions.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14,
              padding:"12px 0", borderBottom: i < ld.sessions.length-1 ? `1px solid rgba(201,160,90,0.07)` : "none" }}>
              <div style={{ width:36, height:36, borderRadius:6, background:`${lm.c}12`,
                border:`1px solid ${lm.c}33`, display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0 }}>
                <IcoCal size={14} color={lm.c}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:CREAM,
                  letterSpacing:"0.02em", marginBottom:3 }}>{s.title}</p>
                <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:"#c4aa80", fontStyle:"italic" }}>
                  with {s.with} · {s.date} · {s.duration}</p>
              </div>
              <Stars n={s.stars} size={11}/>
            </div>
          ))
        }
      </Card>
    </div>
  );

  /* ── TUTOR VIEW ── */
  const tutorView = (
    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { label:"Sessions",  value:td.hosted   },
          { label:"Students",  value:td.students  },
          { label:"Hours",     value:td.hours     },
          { label:"Rating",    value:td.rating ? td.rating.toFixed(1) : "—" },
        ].map((s, i) => (
          <Card key={i} style={{ padding:"16px 14px" }}>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, letterSpacing:"0.14em",
              textTransform:"uppercase", color:MUTED, marginBottom:8 }}>{s.label}</p>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, color:GOLDLT }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Tutor level card */}
      <Card style={{ padding:"22px 24px" }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.14em",
          textTransform:"uppercase", color:MUTED, marginBottom:6 }}>Tutor Level</p>
        <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, color:CREAM,
          letterSpacing:"0.02em", marginBottom:14 }}>{tLvl.title}</h2>
        <GlowBar pct={tPct} color={A_GREEN} h={7}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, color:MUTED }}>
            {td.hosted} sessions hosted</span>
          {tNxt && <span style={{ fontFamily:"'Lora',serif", fontSize:10, color:"#c4aa80", fontStyle:"italic" }}>
            {tNxt.sessions - td.hosted} more to {tNxt.title}</span>}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Upcoming */}
        <Card style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.14em",
              textTransform:"uppercase", color:MUTED }}>Upcoming</p>
            <button onClick={() => navigate("/calendar")}
              style={{ background:"none", border:"none", cursor:"pointer",
                fontFamily:"'Oswald',sans-serif", fontSize:9, color:GOLD,
                letterSpacing:"0.1em", textTransform:"uppercase",
                display:"flex", alignItems:"center", gap:4 }}>
              Schedule <IcoArrow size={11}/>
            </button>
          </div>
          {td.upcoming.length === 0
            ? <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#c4aa80", fontStyle:"italic" }}>
                No upcoming sessions.</p>
            : td.upcoming.map((s, i) => (
              <div key={i} style={{ padding:"10px 0",
                borderBottom: i < td.upcoming.length-1 ? `1px solid rgba(201,160,90,0.07)` : "none" }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:CREAM,
                  letterSpacing:"0.02em", marginBottom:4 }}>{s.title}</p>
                <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:"#c4aa80", fontStyle:"italic" }}>
                  {s.date}</p>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.08em",
                  color:s.spots<=1?A_ROSE:A_GREEN, border:`1px solid ${s.spots<=1?A_ROSE:A_GREEN}44`,
                  borderRadius:3, padding:"2px 7px", marginTop:6, display:"inline-block" }}>
                  {s.spots} spot{s.spots!==1?"s":""} left</span>
              </div>
            ))
          }
        </Card>

        {/* Reviews */}
        <Card style={{ padding:"22px 24px" }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.14em",
            textTransform:"uppercase", color:MUTED, marginBottom:16 }}>Student Reviews</p>
          {td.reviews.length === 0
            ? <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#c4aa80", fontStyle:"italic" }}>
                Host a session to get reviews.</p>
            : td.reviews.map((r, i) => (
              <div key={i} style={{ marginBottom: i < td.reviews.length-1 ? 14 : 0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:24, height:24, borderRadius:4, background:"rgba(201,160,90,0.1)",
                    border:`1px solid ${BORD}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontFamily:"'Oswald',sans-serif", fontSize:8, color:GOLD }}>
                    {r.from.split(" ").map(w=>w[0]).join("")}
                  </div>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                    color:CREAM, letterSpacing:"0.04em" }}>{r.from}</span>
                  <Stars n={r.stars} size={10}/>
                </div>
                <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:"#c4aa80",
                  fontStyle:"italic", lineHeight:1.6 }}>"{r.text}"</p>
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  );

  /* ══════════════ RENDER ══════════════ */
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:DARK, color:CREAM }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(201,160,90,0.2);border-radius:2px;}
        .nav-btn:hover{background:rgba(201,160,90,0.06)!important;}
        .nav-btn:hover span{color:${CREAM}!important;}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {sidebar}

      <main style={{ marginLeft:sideW, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh",
        transition:"margin-left .22s cubic-bezier(.4,0,.2,1)" }}>

        {/* TOP BAR */}
        <div style={{ padding:"22px 28px 0", borderBottom:`1px solid rgba(201,160,90,0.08)`,
          paddingBottom:16, animation:"fadeUp .4s ease both" }}>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
            marginBottom:16, flexWrap:"wrap", gap:12 }}>
            <div>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.18em",
                textTransform:"uppercase", color:MUTED, marginBottom:4 }}>
                {greeting}, Mishka
              </p>
              <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:24, fontWeight:600,
                color:CREAM, letterSpacing:"0.03em" }}>Dashboard</h1>
            </div>

            {/* Learner / Tutor + language selector */}
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              {/* Toggle */}
              <div style={{ display:"flex", border:`1px solid ${BORD}`, borderRadius:4, overflow:"hidden" }}>
                {["learner","tutor"].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, letterSpacing:"0.08em",
                      textTransform:"uppercase", padding:"7px 18px", border:"none", cursor:"pointer",
                      background: tab===t ? GOLD : "transparent",
                      color: tab===t ? DARK : MUTED, fontWeight: tab===t ? 700 : 400,
                      transition:"all .15s" }}>
                    {t==="learner"?"Learner":"Tutor"}
                  </button>
                ))}
              </div>

              {/* Language pills */}
              <div style={{ display:"flex", gap:6 }}>
                {langs.map(l => {
                  const lData = ALL_LANGS.find(x=>x.code===l.code);
                  return (
                    <button key={l.code} onClick={() => setLcode(l.code)}
                      style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.1em",
                        textTransform:"uppercase", padding:"5px 12px", border:"none", borderRadius:4,
                        cursor:"pointer", background: lcode===l.code ? `${lData?.c||GOLD}22` : "rgba(201,160,90,0.05)",
                        color: lcode===l.code ? lData?.c||GOLD : MUTED,
                        outline: lcode===l.code ? `1px solid ${lData?.c||GOLD}55` : "none",
                        transition:"all .15s" }}>
                      {l.code}
                    </button>
                  );
                })}
                <button onClick={() => setAddModal(true)}
                  style={{ width:28, height:28, borderRadius:4, border:`1px dashed ${BORD}`,
                    background:"transparent", cursor:"pointer", display:"flex",
                    alignItems:"center", justifyContent:"center" }}>
                  <IcoPlus size={13} color={MUTED}/>
                </button>
              </div>
            </div>
          </div>

          {/* Quick links row */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
            {quickLinks.map(q => (
              <button key={q.label} onClick={() => navigate(q.path)}
                style={{ flexShrink:0, fontFamily:"'Oswald',sans-serif", fontSize:11,
                  letterSpacing:"0.1em", textTransform:"uppercase", padding:"10px 20px",
                  borderRadius:5, border:`1px solid ${q.c}44`, background:`${q.c}0a`,
                  color:q.c, cursor:"pointer", transition:"all .15s", display:"flex",
                  alignItems:"center", gap:7, whiteSpace:"nowrap" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=`${q.c}18`; e.currentTarget.style.borderColor=`${q.c}66`; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=`${q.c}08`; e.currentTarget.style.borderColor=`${q.c}33`; }}>
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, padding:"20px 28px 36px", overflowY:"auto",
          animation:"fadeUp .35s ease .05s both" }}>
          <HeroBanner navigate={navigate} onDailyQ={scrollToDQ} />

          {/* ── FEATURED: QUESTION OF THE DAY ── */}
          {tab === "learner" && (
            <div ref={dqRef} style={{ marginBottom:20, border:`1px solid ${isDQ ? "rgba(201,160,90,0.12)" : "rgba(201,160,90,0.28)"}`,
              borderRadius:8, background:CARD, backgroundImage:GRAIN,
              backgroundRepeat:"repeat", backgroundSize:"300px",
              position:"relative", overflow:"hidden" }}>

              {/* Left accent bar */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3,
                background: isDQ ? DIM : GOLD }}/>

              {/* Faint grid pattern top-right */}
              <div style={{ position:"absolute", right:0, top:0, width:180, height:"100%",
                pointerEvents:"none", opacity:0.04 }}>
                {[0,1,2,3,4,5].map(row => [0,1,2,3,4,5,6,7].map(col => (
                  <div key={`${row}-${col}`} style={{ position:"absolute",
                    left: col*24, top: row*24, width:1, height:1,
                    background:GOLD, borderRadius:"50%" }}/>
                )))}
              </div>

              <div style={{ padding:"28px 32px 28px 36px", display:"flex",
                gap:32, alignItems:"flex-start", flexWrap:"wrap" }}>

                {/* Left — label + question */}
                <div style={{ flex:"0 0 auto", maxWidth:260 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ width:36, height:36, borderRadius:6,
                      background: isDQ ? "rgba(125,184,125,0.1)" : "rgba(201,160,90,0.1)",
                      border:`1px solid ${isDQ ? A_GREEN+"44" : GOLD+"44"}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {isDQ
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke={A_GREEN} strokeWidth="2" strokeLinecap="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke={GOLD} strokeWidth="1.6" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4M12 16h.01"/>
                          </svg>
                      }
                    </div>
                    <div>
                      <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
                        letterSpacing:"0.14em", textTransform:"uppercase",
                        color: isDQ ? A_GREEN : GOLD, marginBottom:2 }}>
                        {isDQ ? "Completed" : "Question of the Day"}
                      </p>
                      <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                        letterSpacing:"0.1em", textTransform:"uppercase", color:MUTED }}>
                        {ALL_LANGS.find(l=>l.code===lcode)?.name} · Daily Challenge
                      </p>
                    </div>
                  </div>

                  {!isDQ && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                      background:"rgba(125,184,125,0.08)", border:`1px solid ${A_GREEN}33`,
                      borderRadius:4, padding:"5px 12px" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke={A_GREEN} strokeWidth="2" strokeLinecap="round">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12,
                        letterSpacing:"0.1em", textTransform:"uppercase", color:A_GREEN,
                        fontWeight:600 }}>+25 XP on correct answer</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ width:1, background:"rgba(201,160,90,0.1)",
                  alignSelf:"stretch", flexShrink:0, minHeight:80 }}/>

                {/* Right — the actual question */}
                <div style={{ flex:1, minWidth:280 }}>
                  <DailyQuestion
                    q={ld.dailyQ.q} opts={ld.dailyQ.opts} ans={ld.dailyQ.ans}
                    done={isDQ}
                    onDone={() => { setDoneDQ(d => ({...d,[lcode]:true})); fireToast("+25 XP earned!"); }}
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "learner"
            ? <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                {learnerMain}
                {rightPanel}
              </div>
            : tutorView
          }
        </div>
      </main>

      {addModal && (
        <AddLangModal
          onAdd={addLang}
          onClose={() => setAddModal(false)}
          existing={langs.map(l => l.code)}
        />
      )}

      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:CARD, border:`1px solid rgba(201,160,90,0.25)`, borderRadius:5,
          padding:"9px 20px", fontFamily:"'Oswald',sans-serif", fontSize:11,
          letterSpacing:"0.08em", color:CREAM, zIndex:9999,
          animation:"toastIn .22s ease both" }}>
          {toast}
        </div>
      )}
    </div>
  );
}