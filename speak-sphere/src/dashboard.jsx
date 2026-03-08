import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS  —  "Dark Ember with Depth"
   Base: very dark warm brown, not pure black
   Cards: layered with micro-gradients so they feel 3-D
   Accent: saturated amber-gold that actually glows
═══════════════════════════════════════════════════════════════ */
const T = {
  // Surfaces — 4 distinct depth layers
  bg0:      "#0f0b07",   // void — page background
  bg1:      "#19110a",   // base card surface
  bg2:      "#231708",   // raised element
  bg3:      "#2e1f0e",   // hover / active

  // Text
  t1:       "#f2dfc4",   // primary — warm cream
  t2:       "#9d7d5a",   // secondary
  t3:       "#5a3f28",   // disabled / faint

  // Gold accent — rich, not washed out
  gold:     "#e09840",
  goldDim:  "#c07828",
  goldGlow: "rgba(224,152,64,0.18)",
  goldRing: "rgba(224,152,64,0.30)",

  // Semantic
  green:    "#3ec98a",   greenG: "rgba(62,201,138,0.14)",
  blue:     "#4e9fe8",   blueG:  "rgba(78,159,232,0.14)",
  rose:     "#e05878",   roseG:  "rgba(224,88,120,0.14)",
  violet:   "#9f72e8",   violetG:"rgba(159,114,232,0.14)",

  // Structure
  border:   "rgba(224,152,64,0.08)",
  borderMd: "rgba(224,152,64,0.16)",
  borderHi: "rgba(224,152,64,0.30)",

  // Shadows — warm, not grey
  shadow:   "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.35)",
  shadowLg: "0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)",
};

/* ── Language palette ──────────────────────────────────────── */
const LANGS = [
  { code:"ES", name:"Spanish",  native:"Español",   script:"Hola",      c:"#e07858", g:"rgba(224,120,88,0.15)"  },
  { code:"FR", name:"French",   native:"Français",  script:"Bonjour",   c:"#4e9fe8", g:"rgba(78,159,232,0.15)"  },
  { code:"JP", name:"Japanese", native:"日本語",     script:"こんにちは", c:"#e05878", g:"rgba(224,88,120,0.15)"  },
  { code:"KO", name:"Korean",   native:"한국어",     script:"안녕",       c:"#3ec98a", g:"rgba(62,201,138,0.15)"  },
  { code:"DE", name:"German",   native:"Deutsch",   script:"Hallo",     c:"#9f72e8", g:"rgba(159,114,232,0.15)" },
  { code:"HI", name:"Hindi",    native:"हिंदी",     script:"नमस्ते",   c:"#e09840", g:"rgba(224,152,64,0.15)"  },
];

const LEARNER_LVL = [
  { n:1, title:"Novice",         xp:0,     emoji:"🌱" },
  { n:2, title:"Apprentice",     xp:500,   emoji:"📚" },
  { n:3, title:"Journeyman",     xp:1200,  emoji:"✏️" },
  { n:4, title:"Scholar",        xp:2500,  emoji:"🎓" },
  { n:5, title:"Linguist",       xp:5000,  emoji:"🌍" },
  { n:6, title:"Polyglot",       xp:9000,  emoji:"⭐" },
  { n:7, title:"Grand Linguist", xp:15000, emoji:"👑" },
];
const TUTOR_LVL = [
  { n:1, title:"Apprentice Tutor", sessions:0,   emoji:"🌱", tip:"Host your first session!" },
  { n:2, title:"Guide",            sessions:5,   emoji:"🧭", tip:"Students are finding you."  },
  { n:3, title:"Mentor",           sessions:20,  emoji:"💡", tip:"Building real impact."      },
  { n:4, title:"Master",           sessions:60,  emoji:"🏅", tip:"Deep student trust."        },
  { n:5, title:"Grand Master",     sessions:150, emoji:"👑", tip:"Elite educator."            },
];

const USER = {
  name:"Alex Rivera", initials:"AR",
  languages:[
    { code:"ES",
      learner:{ xp:1840, level:3, streak:12, best:21, week:[3,5,2,4,6,3,1],
        skills:{ vocab:68, grammar:54, reading:72, speaking:45 },
        dailyQ:{ q:"Past tense of 'ir' (to go)?", opts:["iba","fui","voy","fue"], ans:1, done:false },
        sessions:[
          { title:"Conversation Practice", with:"Maria G.",  date:"Mar 6", stars:5 },
          { title:"Grammar Deep-Dive",     with:"Carlos R.", date:"Mar 4", stars:4 },
          { title:"Pronunciation Lab",     with:"Sofia L.",  date:"Mar 1", stars:5 },
        ],
        resources:[
          { type:"Video",  title:"Ser vs Estar",           diff:"Intermediate", time:"12 min" },
          { type:"Quiz",   title:"Irregular Preterite",    diff:"Intermediate", time:"8 min"  },
          { type:"Lesson", title:"Subjunctive Mood Intro", diff:"Advanced",     time:"20 min" },
        ],
      },
      tutor:{ level:2, hosted:14, rating:4.7, students:38, hours:21,
        upcoming:[
          { title:"Beginner Spanish Chat", date:"Mar 9",  time:"4:00 PM", n:3, max:6 },
          { title:"Grammar Office Hours",  date:"Mar 11", time:"6:00 PM", n:5, max:8 },
        ],
        reviews:[
          { from:"Jamie L.", stars:5, text:"Super patient and explains things clearly!" },
          { from:"Priya M.", stars:5, text:"Best tutor on the platform."               },
          { from:"Tom B.",   stars:4, text:"Great session, very helpful."              },
        ],
        badges:["First Session","5 Sessions","Top Rated","10 Students","Night Owl"],
      },
    },
    { code:"FR",
      learner:{ xp:430, level:1, streak:3, best:7, week:[0,1,0,2,1,0,1],
        skills:{ vocab:35, grammar:28, reading:40, speaking:20 },
        dailyQ:{ q:"'I am going to the store'?",
          opts:["Je vais au magasin","Je suis au magasin","J'allais au magasin","Je vais à magasin"], ans:0, done:false },
        sessions:[{ title:"French Basics", with:"Claire D.", date:"Mar 5", stars:5 }],
        resources:[
          { type:"Lesson", title:"French Pronunciation", diff:"Beginner", time:"15 min" },
          { type:"Video",  title:"Common Phrases",       diff:"Beginner", time:"10 min" },
        ],
      },
      tutor:{ level:1, hosted:0, rating:0, students:0, hours:0, upcoming:[], reviews:[], badges:[] },
    },
  ],
};

const NAV = [
  { id:"dashboard",    label:"Dashboard",     icon:DashIcon  },
  { id:"calendar",     label:"Schedule",      icon:CalIcon   },
  { id:"resources",    label:"Resources",     icon:BookIcon  },
  { id:"ai-tutor",     label:"AI Tutor",      icon:BotIcon   },
  { id:"pronunciation",label:"Pronunciation", icon:MicIcon   },
  { id:"pen-pals",     label:"Pen Pals",      icon:MailIcon  },
  { id:"community",    label:"Community",     icon:ChatIcon  },
];

const QUICK = [
  { label:"Book Session",   icon:"📅", c:T.blue,   g:T.blueG   },
  { label:"AI Tutor Chat",  icon:"🤖", c:T.gold,   g:T.goldGlow},
  { label:"Pronunciation",  icon:"🎤", c:T.rose,   g:T.roseG   },
  { label:"Resources",      icon:"📚", c:T.green,  g:T.greenG  },
  { label:"Pen Pals",       icon:"✉️", c:T.violet, g:T.violetG },
  { label:"Community",      icon:"💬", c:T.blue,   g:T.blueG   },
];

/* ── SVG icon components ────────────────────────────────────── */
function Ico({ d, size=16, color="currentColor", stroke=true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke?"none":"currentColor"}
      stroke={stroke?color:"none"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
function DashIcon({ size, color }) { return <Ico size={size} color={color} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/> }
function CalIcon({ size, color })  { return <Ico size={size} color={color} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/> }
function BookIcon({ size, color }) { return <Ico size={size} color={color} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/> }
function BotIcon({ size, color })  { return <Ico size={size} color={color} d="M12 8V4H8M12 4h4M2 14c0-4 2-6 6-6h8c4 0 6 2 6 6v2a6 6 0 01-6 6H8a6 6 0 01-6-6v-2zM9 17v1M15 17v1M9 12h.01M15 12h.01"/> }
function MicIcon({ size, color })  { return <Ico size={size} color={color} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/> }
function MailIcon({ size, color }) { return <Ico size={size} color={color} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/> }
function ChatIcon({ size, color }) { return <Ico size={size} color={color} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/> }

/* ── Animated counter ────────────────────────────────────────── */
function AnimNum({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s, id;
    const run = ts => { if (!s) s=ts; const p=Math.min((ts-s)/900,1); setV(Math.round(p*to)); if(p<1) id=requestAnimationFrame(run); };
    id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{v.toLocaleString()}</>;
}

/* ── Progress bar with glow ──────────────────────────────────── */
function GlowBar({ pct, color, h=7 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t=setTimeout(()=>setW(pct),120); return ()=>clearTimeout(t); }, [pct]);
  return (
    <div style={{ height:h, borderRadius:99, background:"rgba(255,255,255,0.04)", overflow:"visible", position:"relative" }}>
      <div style={{ height:"100%", width:`${w}%`, borderRadius:99, background:color,
        boxShadow:`0 0 10px ${color}88, 0 0 2px ${color}`,
        transition:"width 1.1s cubic-bezier(.4,0,.2,1)", position:"relative", overflow:"hidden" }}>
        <div className="bar-shim"/>
      </div>
    </div>
  );
}

/* ── Skill ring with glow ────────────────────────────────────── */
function GlowRing({ label, pct, color, size=70 }) {
  const r=(size-14)/2, circ=2*Math.PI*r;
  const [d, setD] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setD(pct),200); return()=>clearTimeout(t); },[pct]);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)", display:"block", overflow:"visible" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-circ*d/100}
            style={{ transition:"stroke-dashoffset 1.1s ease", filter:`drop-shadow(0 0 6px ${color})` }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:13, fontWeight:800, color:T.t1 }}>{pct}%</div>
      </div>
      <span style={{ fontSize:9, fontWeight:700, color:T.t2, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</span>
    </div>
  );
}

/* ── Week bar chart ──────────────────────────────────────────── */
const DAYLABELS = ["S","M","T","W","T","F","S"];
function WeekBars({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display:"flex", gap:5, alignItems:"flex-end" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div title={`${v} sessions`} style={{
            width:"100%", height:Math.max(3,(v/max)*46), borderRadius:4,
            background: v ? color : "rgba(255,255,255,0.04)",
            boxShadow: v ? `0 0 8px ${color}66` : "none",
            opacity: v ? 0.3+(v/max)*0.7 : 1,
            transition:"height .7s ease",
          }}/>
          <span style={{ fontSize:9, fontWeight:600, color:T.t3 }}>{DAYLABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Stars ───────────────────────────────────────────────────── */
function Stars({ n, size=12 }) {
  return <span>{[1,2,3,4,5].map(i=>(
    <span key={i} style={{ fontSize:size, color:i<=n?T.gold:T.t3, lineHeight:1 }}>★</span>
  ))}</span>;
}

/* ── Pill badge ───────────────────────────────────────────────── */
function Pill({ label, color, bg }) {
  return (
    <span style={{ background:bg||"rgba(255,255,255,0.07)", color, fontSize:10, fontWeight:700,
      borderRadius:99, padding:"3px 10px", letterSpacing:"0.06em", display:"inline-block" }}>
      {label}
    </span>
  );
}

/* ── Generic card ─────────────────────────────────────────────── */
function Card({ children, style={}, accent }) {
  return (
    <div style={{
      background: `linear-gradient(160deg, ${T.bg1}, ${T.bg1}ee)`,
      border: `1px solid ${accent ? accent+"28" : T.border}`,
      borderRadius:16, padding:"20px 22px",
      boxShadow: accent
        ? `${T.shadow}, inset 0 1px 0 ${accent}18`
        : `${T.shadow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
      position:"relative", overflow:"hidden",
      ...style,
    }}>
      {accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg, transparent, ${accent}88, transparent)`,
        borderRadius:"16px 16px 0 0" }}/>}
      {children}
    </div>
  );
}

/* ── Daily question ───────────────────────────────────────────── */
function DailyQ({ data, lm, onDone }) {
  const [picked, setPicked] = useState(null);
  const [shown,  setShown]  = useState(data.done);

  if (data.done || shown) return (
    <Card accent={T.green} style={{ textAlign:"center" }}>
      <div style={{ fontSize:28, marginBottom:8, filter:`drop-shadow(0 0 10px ${T.green})` }}>🎉</div>
      <p style={{ fontSize:14, fontWeight:800, color:T.green }}>Daily Question Complete!</p>
      <p style={{ fontSize:11, color:T.t2, marginTop:4 }}>+25 XP earned · Come back tomorrow</p>
    </Card>
  );

  const pick = i => {
    if (shown) return;
    setPicked(i); setShown(true);
    setTimeout(()=>onDone(i===data.ans), 1400);
  };

  return (
    <Card accent={lm.c}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ background:lm.g, color:lm.c, fontSize:10, fontWeight:700,
          borderRadius:99, padding:"3px 11px", letterSpacing:"0.08em" }}>
          DAILY · {lm.name.toUpperCase()}
        </span>
        <span style={{ marginLeft:"auto", background:T.goldGlow, color:T.gold,
          fontSize:10, fontWeight:700, borderRadius:99, padding:"3px 11px" }}>+25 XP</span>
      </div>
      <p style={{ fontSize:15, fontWeight:700, color:T.t1, marginBottom:14, lineHeight:1.55 }}>{data.q}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {data.opts.map((opt, i) => {
          const isAns=i===data.ans, isWrong=shown&&i===picked&&!isAns;
          let border=T.border, bg=T.bg2, color=T.t2, fw=500;
          if (!shown && i===picked) { border=lm.c+"88"; bg=lm.g; color=T.t1; fw=600; }
          if (shown && isAns)   { border=T.green+"66"; bg=T.greenG; color=T.green; fw=700; }
          if (shown && isWrong) { border=T.rose +"66"; bg=T.roseG;  color=T.rose;  fw=600; }
          if (shown && !isAns && i!==picked) { color=T.t3; }
          return (
            <button key={i} onClick={()=>pick(i)} disabled={shown}
              className={!shown?"dq-btn":""}
              style={{ display:"flex", alignItems:"center", gap:10, background:bg,
                border:`1.5px solid ${border}`, borderRadius:11, padding:"10px 13px",
                cursor:shown?"default":"pointer", transition:"all .2s", textAlign:"left", width:"100%",
                boxShadow:shown&&isAns?`0 0 12px ${T.green}33`:shown&&isWrong?`0 0 8px ${T.rose}33`:"none" }}>
              <span style={{ width:22, height:22, borderRadius:7, flexShrink:0, display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff",
                background:shown&&isAns?T.green:shown&&isWrong?T.rose:shown?T.t3:lm.c,
                transition:"background .2s",
                boxShadow:shown&&isAns?`0 0 8px ${T.green}`:shown&&isWrong?`0 0 8px ${T.rose}`:"none" }}>
                {shown&&isAns?"✓":shown&&isWrong?"✗":String.fromCharCode(65+i)}
              </span>
              <span style={{ fontSize:13, fontWeight:fw, color, flex:1, transition:"color .2s" }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Add language modal ───────────────────────────────────────── */
function AddLangModal({ enrolled, onAdd, onClose }) {
  const avail = LANGS.filter(l=>!enrolled.includes(l.code));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(10px)",
      zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div className="pop-in" style={{ background:T.bg1, border:`1px solid ${T.borderMd}`,
        borderRadius:20, padding:28, width:"100%", maxWidth:400, boxShadow:T.shadowLg }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.t1 }}>Add a Language</h2>
          <button onClick={onClose} style={{ background:T.bg2, border:`1px solid ${T.border}`,
            borderRadius:9, width:32, height:32, cursor:"pointer", fontSize:17, color:T.t2 }}>×</button>
        </div>
        {avail.length===0
          ? <p style={{ fontSize:13, color:T.t2 }}>You're enrolled in all available languages!</p>
          : <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {avail.map(l=>(
                <button key={l.code} className="lang-add-btn"
                  onClick={()=>{ onAdd(l); onClose(); }}
                  style={{ background:l.g, border:`1.5px solid ${l.c}30`, borderRadius:14,
                    padding:"18px 14px", cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:20, color:l.c, marginBottom:7 }}>{l.script}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:T.t1 }}>{l.name}</div>
                  <div style={{ fontSize:11, color:T.t2, marginTop:2 }}>{l.native}</div>
                </button>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [page,    setPage]    = useState("dashboard");
  const [lcode,   setLcode]   = useState("ES");
  const [tab,     setTab]     = useState("learner");
  const [lmenu,   setLmenu]   = useState(false);
  const [addMod,  setAddMod]  = useState(false);
  const [langs,   setLangs]   = useState(USER.languages);
  const [doneDQ,  setDoneDQ]  = useState({});
  const [toast,   setToast]   = useState(null);

  const lang  = langs.find(l=>l.code===lcode)||langs[0];
  const lm    = LANGS.find(l=>l.code===lcode)||LANGS[0];
  const ld    = lang.learner;
  const td    = lang.tutor;
  const lLvl  = LEARNER_LVL.find(l=>l.n===ld.level)||LEARNER_LVL[0];
  const tLvl  = TUTOR_LVL.find(l=>l.n===td.level)||TUTOR_LVL[0];
  const lNext = LEARNER_LVL.find(l=>l.n===ld.level+1);
  const tNext = TUTOR_LVL.find(l=>l.n===td.level+1);
  const lPct  = lNext?Math.min(((ld.xp-lLvl.xp)/(lNext.xp-lLvl.xp))*100,100):100;
  const tPct  = tNext?Math.min((td.hosted/tNext.sessions)*100,100):100;
  const isDone = doneDQ[lcode]||ld.dailyQ.done;

  const fireToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2600); };

  // Hardcoded user — change these to match your name
  const displayName     = "Mishka Mittal";
  const displayInitials = "MM";
  const displayLevel    = "Journeyman";
  const displayLang     = "ES";

  const addLang = l => {
    setLangs(prev=>[...prev,{
      code:l.code,
      learner:{ xp:0,level:1,streak:0,best:0,week:[0,0,0,0,0,0,0],
        skills:{vocab:0,grammar:0,reading:0,speaking:0},
        dailyQ:{q:`How do you say 'hello' in ${l.name}?`,
          opts:["Hello","Goodbye","Please","Thank you"],ans:0,done:false},
        sessions:[],resources:[]},
      tutor:{level:1,hosted:0,rating:0,students:0,hours:0,upcoming:[],reviews:[],badges:[]},
    }]);
    setLcode(l.code);
  };

  const BADGE_ICON = {"First Session":"🎯","5 Sessions":"⚡","Top Rated":"🏆","10 Students":"👥","Night Owl":"🌙"};
  const RES = { Video:{icon:"🎬",c:T.blue,g:T.blueG}, Quiz:{icon:"✏️",c:T.rose,g:T.roseG}, Lesson:{icon:"📖",c:T.gold,g:T.goldGlow} };
  const DIFF = { Beginner:{c:T.green,g:T.greenG}, Intermediate:{c:T.gold,g:T.goldGlow}, Advanced:{c:T.rose,g:T.roseG} };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg0,
      color:T.t1, fontFamily:"'Sora','Plus Jakarta Sans',sans-serif" }}>
      <style>{CSS}</style>

      {/* ══ SIDEBAR ═════════════════════════════════════════ */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoBubble}>
            <svg width={18} height={18} viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="10.5" stroke={T.gold} strokeWidth="1.5"/>
              <ellipse cx="13" cy="13" rx="4.8" ry="10.5" stroke={T.gold} strokeWidth="1" opacity=".55"/>
              <line x1="2.5" y1="13" x2="23.5" y2="13" stroke={T.gold} strokeWidth="1" opacity=".45"/>
              <line x1="13" y1="2.5" x2="13" y2="23.5" stroke={T.gold} strokeWidth="1" opacity=".3"/>
            </svg>
          </div>
          <span style={{ fontSize:16, fontWeight:800, color:T.t1, letterSpacing:"-0.01em" }}>SpeakSphere</span>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"8px 10px", display:"flex", flexDirection:"column", gap:1 }}>
          {NAV.map(item=>{
            const Icon = item.icon;
            const active = page===item.id;
            return (
              <button key={item.id} onClick={()=>{
                const routes = {dashboard:'/dashboard',calendar:'/calendar',resources:'/resources','ai-tutor':'/ai-tutor',pronunciation:'/pronunciation','pen-pals':'/pen-pals',community:'/community'};
                if(routes[item.id] && item.id!=='dashboard') navigate(routes[item.id]);
                else setPage(item.id);
              }}
                className={!active?"nav-btn":""}
                style={{ ...S.navBtn, ...(active?{
                  background:T.goldGlow,
                  borderLeft:`2px solid ${T.gold}`,
                  color:T.gold,
                }:{}) }}>
                <Icon size={15} color={active?T.gold:T.t2}/>
                <span style={{ fontSize:12.5, fontWeight:active?700:500, color:active?T.gold:T.t2 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div style={S.sideUser}>
          <div style={{ ...S.avatar, background:`linear-gradient(135deg,${lm.c}cc,${lm.c}55)`,
            boxShadow:`0 0 12px ${lm.c}44` }}>
            {displayInitials}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:12.5, fontWeight:700, color:T.t1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{displayName}</p>
            <p style={{ fontSize:10.5, color:T.t2, marginTop:1 }}>{lLvl.emoji} {lLvl.title}</p>
          </div>
          <button style={{ background:"none", border:"none", fontSize:14, cursor:"pointer", color:T.t3, padding:4, flexShrink:0 }}>⚙️</button>
        </div>
      </aside>

      {/* ══ MAIN ════════════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", marginLeft:224, minWidth:0 }}>

        {/* ── TOPBAR ── */}
        <header style={S.topbar}>
          <div>
            {(() => {
              const h = new Date().getHours();
              const greet = h < 12 ? "GOOD MORNING" : h < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";
              const first = displayName.split(" ")[0];
              return <p style={{ fontSize:10.5, fontWeight:600, color:T.t3, letterSpacing:"0.1em", marginBottom:3 }}>{greet}, {first.toUpperCase()} 👋</p>;
            })()}
            <h1 style={{ fontSize:22, fontWeight:800, color:T.t1, letterSpacing:"-0.025em", lineHeight:1 }}>Dashboard</h1>
          </div>

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {toast && <span key={toast} className="toast-in" style={S.toast}>{toast}</span>}

            {/* Learner / Tutor toggle */}
            <div style={S.seg}>
              {["learner","tutor"].map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  style={{ ...S.segBtn, ...(tab===t?{
                    background:lm.c, color:"#fff", fontWeight:700,
                    boxShadow:`0 2px 12px ${lm.c}55`
                  }:{}) }}>
                  {t==="learner"?"📖 Learner":"🎓 Tutor"}
                </button>
              ))}
            </div>

            {/* Language picker */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>setLmenu(x=>!x)}
                style={{ display:"flex", alignItems:"center", gap:8, background:lm.g,
                  border:`1px solid ${lm.c}35`, borderRadius:12, padding:"7px 13px",
                  cursor:"pointer", transition:"all .2s" }}>
                <span style={{ fontFamily:"Georgia,serif", fontSize:15, color:lm.c, lineHeight:1 }}>{lm.script.slice(0,4)}</span>
                <span style={{ fontSize:12.5, fontWeight:700, color:lm.c }}>{lm.name}</span>
                <span style={{ fontSize:9, color:lm.c, opacity:.6 }}>{lmenu?"▲":"▼"}</span>
              </button>

              {lmenu && (
                <div className="pop-in" style={S.lmenu}>
                  {langs.map(l=>{
                    const m=LANGS.find(x=>x.code===l.code)||LANGS[0];
                    const sel=l.code===lcode;
                    return (
                      <button key={l.code} onClick={()=>{setLcode(l.code);setLmenu(false);}}
                        className="lopt" style={{ ...S.lopt, ...(sel?{background:m.g}:{}) }}>
                        <span style={{ fontFamily:"Georgia,serif", fontSize:14, color:m.c, width:26, textAlign:"center" }}>{m.script.slice(0,3)}</span>
                        <span style={{ fontSize:12.5, fontWeight:sel?700:500, color:T.t1, flex:1 }}>{m.name}</span>
                        {sel&&<span style={{ color:T.green, fontSize:12 }}>✓</span>}
                      </button>
                    );
                  })}
                  <hr style={{ border:`none`, borderTop:`1px solid ${T.border}`, margin:"4px 6px" }}/>
                  <button onClick={()=>{setAddMod(true);setLmenu(false);}} className="lopt" style={S.lopt}>
                    <span style={{ fontSize:14, width:26, textAlign:"center", color:T.gold }}>＋</span>
                    <span style={{ fontSize:12.5, fontWeight:700, color:T.gold }}>Add Language</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"22px 26px 70px" }}>

          {/* QUICK ACTIONS */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {QUICK.map(q=>(
              <button key={q.label} className="qpill"
                style={{ display:"flex", alignItems:"center", gap:7, background:q.g,
                  border:`1px solid ${q.c}25`, borderRadius:99, padding:"8px 15px",
                  cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap" }}>
                <span style={{ fontSize:13 }}>{q.icon}</span>
                <span style={{ fontSize:11.5, fontWeight:700, color:q.c }}>{q.label}</span>
              </button>
            ))}
          </div>

          {/* ── HERO STATS ROW ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:13, marginBottom:20, alignItems:"stretch" }}>

            {/* Level — spans wide, has a decorative glow orb */}
            <Card accent={lm.c} style={{ position:"relative", overflow:"hidden" }}>
              {/* ambient glow orb */}
              <div style={{ position:"absolute", top:-60, right:-60, width:160, height:160,
                borderRadius:"50%", background:lm.c, opacity:.05, pointerEvents:"none", filter:"blur(30px)" }}/>
              <div style={{ position:"relative" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <div style={{ width:46, height:46, borderRadius:14, background:lm.g, border:`1px solid ${lm.c}30`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0,
                    boxShadow:`inset 0 1px 0 ${lm.c}20` }}>
                    {tab==="learner"?lLvl.emoji:tLvl.emoji}
                  </div>
                  <div>
                    <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.12em",
                      textTransform:"uppercase", marginBottom:3 }}>
                      {tab==="learner"?"LEARNER LEVEL":"TUTOR LEVEL"}
                    </p>
                    <p style={{ fontSize:20, fontWeight:800, color:T.t1, lineHeight:1.1 }}>
                      {tab==="learner"?lLvl.title:tLvl.title}
                    </p>
                  </div>
                  <div style={{ marginLeft:"auto" }}>
                    <Pill label={lm.name} color={lm.c} bg={lm.g}/>
                  </div>
                </div>
                {tab==="learner" ? <>
                  <GlowBar pct={lPct} color={lm.c}/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:T.t2 }}><AnimNum to={ld.xp}/> XP</span>
                    <span style={{ fontSize:11, color:T.t3 }}>{lNext?`${(lNext.xp-ld.xp).toLocaleString()} XP to ${lNext.title}`:"Max Level 👑"}</span>
                  </div>
                </> : <>
                  <GlowBar pct={tPct} color={lm.c}/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:T.t2 }}>{td.hosted} sessions hosted</span>
                    <span style={{ fontSize:11, color:T.t3 }}>{tNext?`${tNext.sessions-td.hosted} to ${tNext.title}`:"Grand Master 👑"}</span>
                  </div>
                  <p style={{ fontSize:11, color:T.t3, marginTop:8, fontStyle:"italic" }}>{tLvl.tip}</p>
                </>}
              </div>
            </Card>

            {/* Streak — tall badge */}
            <Card style={{ minWidth:130, textAlign:"center", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <div style={{ position:"absolute", bottom:-30, left:"50%", transform:"translateX(-50%)",
                width:110, height:110, borderRadius:"50%", background:"rgba(240,120,40,0.06)", filter:"blur(20px)", pointerEvents:"none" }}/>
              <div style={{ position:"relative" }}>
                <div style={{ fontSize:32, lineHeight:1, marginBottom:5,
                  filter:`drop-shadow(0 0 14px rgba(240,120,40,0.7))` }}>🔥</div>
                <p style={{ fontSize:48, fontWeight:800, color:T.t1, lineHeight:1, letterSpacing:"-0.04em" }}>{ld.streak}</p>
                <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, textTransform:"uppercase", letterSpacing:"0.12em", marginTop:4 }}>Day Streak</p>
                <div style={{ marginTop:10, background:T.bg2, borderRadius:7, padding:"3px 9px", display:"inline-block" }}>
                  <span style={{ fontSize:10.5, color:T.t2, fontWeight:600 }}>Best {ld.best}</span>
                </div>
              </div>
            </Card>

            {/* Week */}
            <Card style={{ minWidth:155 }}>
              <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.12em",
                textTransform:"uppercase", marginBottom:13 }}>THIS WEEK</p>
              <WeekBars data={ld.week} color={lm.c}/>
              <p style={{ fontSize:10.5, color:T.t2, marginTop:10, fontWeight:600 }}>
                {ld.week.reduce((a,b)=>a+b,0)} sessions
              </p>
            </Card>

            {/* Placement / Tutor micro-stats */}
            {tab==="learner" ? (
              <Card style={{ minWidth:138 }}>
                <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>PLACEMENT</p>
                <p style={{ fontSize:16, fontWeight:800, color:lm.c, lineHeight:1.25, marginBottom:10,
                   }}>
                  {["Beginner","Elementary","Intermediate","Upper-Inter.","Advanced"][ld.level-1]}
                </p>
                <p style={{ fontSize:10.5, color:T.t2, fontWeight:600, marginBottom:3 }}>{ld.sessions.length} sessions</p>
                <p style={{ fontSize:10.5, color:T.t2, fontWeight:600 }}>{Math.round(Object.values(ld.skills).reduce((a,b)=>a+b)/4)}% avg</p>
              </Card>
            ) : (
              <Card style={{ minWidth:138 }}>
                <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>TUTOR STATS</p>
                {[
                  {label:"Students",val:td.students,c:T.blue},
                  {label:"Hrs Taught",val:td.hours,c:T.green},
                  {label:"Avg Rating",val:td.rating>0?`${td.rating}★`:"—",c:T.gold},
                ].map(s=>(
                  <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                    background:T.bg2, borderRadius:8, padding:"6px 10px", marginBottom:6 }}>
                    <span style={{ fontSize:10.5, fontWeight:600, color:T.t2 }}>{s.label}</span>
                    <span style={{ fontSize:14, fontWeight:800, color:s.c }}>{s.val}</span>
                  </div>
                ))}
              </Card>
            )}
          </div>

          {/* ── MAIN 2-COL GRID ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>

            {/* LEFT */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* ─ LEARNER ─ */}
              {tab==="learner" && (<>

                {/* Skill breakdown */}
                <Card accent={lm.c}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                    <p style={S.ct}>Skill Breakdown</p>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-around", paddingBottom:18,
                    borderBottom:`1px solid ${T.border}` }}>
                    <GlowRing label="Vocab"    pct={ld.skills.vocab}    color={lm.c}/>
                    <GlowRing label="Grammar"  pct={ld.skills.grammar}  color={T.blue}/>
                    <GlowRing label="Reading"  pct={ld.skills.reading}  color={T.green}/>
                    <GlowRing label="Speaking" pct={ld.skills.speaking} color={T.rose}/>
                  </div>
                  <div style={{ paddingTop:16, display:"flex", flexDirection:"column", gap:12 }}>
                    {[
                      {skill:"Vocabulary",pct:ld.skills.vocab,   c:lm.c},
                      {skill:"Grammar",   pct:ld.skills.grammar, c:T.blue},
                      {skill:"Reading",   pct:ld.skills.reading, c:T.green},
                      {skill:"Speaking",  pct:ld.skills.speaking,c:T.rose},
                    ].map(({skill,pct,c})=>(
                      <div key={skill}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:11.5, fontWeight:600, color:T.t2 }}>{skill}</span>
                          <span style={{ fontSize:11.5, fontWeight:800, color:c }}>{pct}%</span>
                        </div>
                        <GlowBar pct={pct} color={c}/>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent sessions */}
                <Card>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <p style={S.ct}>Recent Sessions</p>
                    <a href="#" style={S.link}>View all →</a>
                  </div>
                  {ld.sessions.length===0
                    ? <p style={S.empty}>No sessions yet — book your first!</p>
                    : ld.sessions.map((sess,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0",
                      borderBottom:i<ld.sessions.length-1?`1px solid ${T.border}`:"none" }}>
                      <div style={{ width:38, height:38, borderRadius:11, background:lm.g, border:`1px solid ${lm.c}25`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>📅</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, fontWeight:700, color:T.t1 }}>{sess.title}</p>
                        <p style={{ fontSize:11, fontWeight:500, color:T.t2, marginTop:2 }}>with {sess.with} · {sess.date}</p>
                      </div>
                      <Stars n={sess.stars}/>
                    </div>
                  ))}
                </Card>

              </>)}

              {/* ─ TUTOR ─ */}
              {tab==="tutor" && (<>

                <Card>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <p style={S.ct}>Upcoming Sessions</p>
                    <a href="#" style={S.link}>Manage →</a>
                  </div>
                  {td.upcoming.length===0
                    ? <div style={{ textAlign:"center", padding:"20px 0" }}>
                        <p style={{ ...S.empty, marginBottom:14 }}>No sessions scheduled yet.</p>
                        <button style={S.btn}>＋ Create First Session</button>
                      </div>
                    : <>
                        {td.upcoming.map((sess,i)=>(
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0",
                            borderBottom:i<td.upcoming.length-1?`1px solid ${T.border}`:"none" }}>
                            <div style={{ width:38, height:38, borderRadius:11, background:lm.g,
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🎓</div>
                            <div style={{ flex:1 }}>
                              <p style={{ fontSize:13, fontWeight:700, color:T.t1 }}>{sess.title}</p>
                              <p style={{ fontSize:11, color:T.t2, marginTop:2 }}>{sess.date} · {sess.time}</p>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <p style={{ fontSize:13, fontWeight:800, color:lm.c }}>{sess.n}/{sess.max}</p>
                              <p style={{ fontSize:9.5, color:T.t3 }}>enrolled</p>
                            </div>
                          </div>
                        ))}
                        <button style={{ ...S.btn, marginTop:14 }}>＋ New Session</button>
                      </>
                  }
                </Card>

                <Card>
                  <p style={{ ...S.ct, marginBottom:16 }}>Student Reviews</p>
                  {td.reviews.length===0
                    ? <p style={S.empty}>Reviews appear after your first session.</p>
                    : td.reviews.map((rev,i)=>(
                    <div key={i} style={{ padding:"12px 0", borderBottom:i<td.reviews.length-1?`1px solid ${T.border}`:"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:lm.g,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:10, fontWeight:800, color:lm.c, flexShrink:0,
                          border:`1px solid ${lm.c}25` }}>
                          {rev.from.split(" ").map(w=>w[0]).join("")}
                        </div>
                        <span style={{ fontSize:12.5, fontWeight:700, color:T.t1 }}>{rev.from}</span>
                        <div style={{ marginLeft:"auto" }}><Stars n={rev.stars} size={11}/></div>
                      </div>
                      <p style={{ fontSize:12, color:T.t2, fontStyle:"italic", paddingLeft:38, lineHeight:1.55 }}>"{rev.text}"</p>
                    </div>
                  ))}
                </Card>

                {/* Tutor roadmap */}
                <Card>
                  <p style={{ ...S.ct, marginBottom:20 }}>Tutor Road Map</p>
                  {TUTOR_LVL.map((lvl,i)=>{
                    const done=td.level>lvl.n, curr=td.level===lvl.n;
                    return (
                      <div key={lvl.n} style={{ display:"flex", gap:14 }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                          <div style={{ width:32, height:32, borderRadius:9,
                            background:curr?lm.c:done?T.greenG:T.bg2,
                            border:`1.5px solid ${curr?lm.c:done?T.green+"44":T.border}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:curr?16:12,
                            boxShadow:curr?`0 0 14px ${lm.c}55`:"none",
                            transition:"all .25s" }}>
                            {done&&!curr?"✓":lvl.emoji}
                          </div>
                          {i<TUTOR_LVL.length-1&&(
                            <div style={{ width:2, height:26, background:done?T.green+"33":T.border, borderRadius:1, margin:"4px 0" }}/>
                          )}
                        </div>
                        <div style={{ paddingTop:4, marginBottom:i<TUTOR_LVL.length-1?0:0, paddingBottom:i<TUTOR_LVL.length-1?4:0 }}>
                          <p style={{ fontSize:12.5, fontWeight:curr?800:600,
                            color:curr?lm.c:done?T.green:T.t2, lineHeight:1.2 }}>{lvl.title}</p>
                          <p style={{ fontSize:11, color:T.t3, marginTop:2, marginBottom:8 }}>{lvl.sessions} sessions · {lvl.tip}</p>
                        </div>
                      </div>
                    );
                  })}
                </Card>

                <Card>
                  <p style={{ ...S.ct, marginBottom:14 }}>Badges</p>
                  {td.badges.length===0
                    ? <div style={{ textAlign:"center", padding:"14px 0" }}>
                        <p style={{ fontSize:26 }}>🏆</p>
                        <p style={{ ...S.empty, marginTop:8 }}>Earn badges by teaching!</p>
                      </div>
                    : <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                        {td.badges.map(b=>(
                          <div key={b} style={{ background:T.goldGlow, border:`1px solid ${T.gold}22`,
                            borderRadius:11, padding:"10px 12px", display:"flex",
                            flexDirection:"column", alignItems:"center", gap:4, minWidth:62 }}>
                            <span style={{ fontSize:18 }}>{BADGE_ICON[b]||"🏅"}</span>
                            <span style={{ fontSize:9, fontWeight:700, color:T.t2 }}>{b}</span>
                          </div>
                        ))}
                      </div>
                  }
                </Card>

              </>)}
            </div>

            {/* RIGHT */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              <DailyQ key={lcode} data={{...ld.dailyQ,done:isDone}} lm={lm}
                onDone={correct=>{
                  setDoneDQ(d=>({...d,[lcode]:true}));
                  fireToast(correct?"✓ Correct! +25 XP 🎉":"Keep going! +5 XP");
                }}/>

              {tab==="learner" && (
                <Card>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <p style={S.ct}>Suggested For You</p>
                    <a href="#" style={S.link}>See all →</a>
                  </div>
                  {ld.resources.length===0
                    ? <p style={S.empty}>Complete sessions for suggestions.</p>
                    : ld.resources.map((res,i)=>{
                        const rm=RES[res.type]||RES.Lesson;
                        const dm=DIFF[res.diff]||DIFF.Intermediate;
                        return (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0",
                            borderBottom:i<ld.resources.length-1?`1px solid ${T.border}`:"none" }}>
                            <div style={{ width:38, height:38, borderRadius:11, background:rm.g,
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{rm.icon}</div>
                            <div style={{ flex:1 }}>
                              <p style={{ fontSize:12.5, fontWeight:700, color:T.t1, marginBottom:4 }}>{res.title}</p>
                              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                <Pill label={res.diff} color={dm.c} bg={dm.g}/>
                                <span style={{ fontSize:10, color:T.t3, fontWeight:600 }}>{res.time}</span>
                              </div>
                            </div>
                            <button style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8,
                              width:28, height:28, cursor:"pointer", fontSize:12, color:T.t2, flexShrink:0 }}>→</button>
                          </div>
                        );
                      })
                  }
                </Card>
              )}

              {tab==="tutor" && td.rating>0 && (
                <Card style={{ textAlign:"center" }}>
                  <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>YOUR RATING</p>
                  <p style={{ fontSize:56, fontWeight:800, color:T.gold, letterSpacing:"-0.04em", lineHeight:1 }}>{td.rating}</p>
                  <div style={{ marginTop:6 }}><Stars n={Math.round(td.rating)} size={18}/></div>
                  <p style={{ fontSize:11, color:T.t2, marginTop:10 }}>{td.reviews.length} reviews · {td.students} students</p>
                </Card>
              )}

            </div>
          </div>
        </div>
      </div>

      {addMod && <AddLangModal enrolled={langs.map(l=>l.code)} onAdd={addLang} onClose={()=>setAddMod(false)}/>}
    </div>
  );
}

/* ── Styles ────────────────────────────────────────────────── */
const S = {
  sidebar:{ width:224, flexShrink:0, background:`linear-gradient(180deg,${T.bg0} 0%,#130e08 100%)`,
    borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column",
    position:"fixed", top:0, left:0, bottom:0, zIndex:50,
    boxShadow:`1px 0 0 ${T.border}, 4px 0 20px rgba(0,0,0,0.25)` },
  logoRow:{ display:"flex", alignItems:"center", gap:10, padding:"20px 16px 14px",
    borderBottom:`1px solid ${T.border}`, flexShrink:0 },
  logoBubble:{ width:34, height:34, borderRadius:11, background:T.goldGlow,
    border:`1px solid ${T.goldRing}`, display:"flex", alignItems:"center",
    justifyContent:"center", flexShrink:0, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.05)` },
  navBtn:{ display:"flex", alignItems:"center", gap:9, padding:"9px 12px",
    borderRadius:10, border:"none", borderLeft:"2px solid transparent",
    background:"none", cursor:"pointer", transition:"all .18s", width:"100%", textAlign:"left" },
  sideUser:{ display:"flex", alignItems:"center", gap:10, padding:"12px 13px",
    margin:"6px 10px 12px", borderRadius:14, background:T.bg2,
    border:`1px solid ${T.border}`, flexShrink:0 },
  avatar:{ width:34, height:34, borderRadius:10, display:"flex", alignItems:"center",
    justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", flexShrink:0 },
  topbar:{ position:"sticky", top:0, zIndex:40, background:`${T.bg0}ee`,
    backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.border}`,
    padding:"14px 26px", display:"flex", alignItems:"center", gap:12, flexShrink:0 },
  seg:{ display:"flex", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:11, padding:3, gap:2 },
  segBtn:{ fontSize:12, fontWeight:600, color:T.t2, background:"none", border:"none",
    borderRadius:8, padding:"6px 13px", cursor:"pointer", transition:"all .22s" },
  toast:{ fontSize:12, fontWeight:700, color:T.green, background:T.greenG,
    border:`1px solid ${T.green}33`, borderRadius:99, padding:"5px 13px", whiteSpace:"nowrap" },
  lmenu:{ position:"absolute", top:"calc(100% + 8px)", right:0, background:T.bg1,
    border:`1px solid ${T.borderMd}`, borderRadius:14, padding:8, minWidth:210,
    boxShadow:T.shadowLg, zIndex:200 },
  lopt:{ display:"flex", alignItems:"center", gap:9, width:"100%", background:"none",
    border:"none", borderRadius:9, padding:"8px 10px", cursor:"pointer",
    transition:"background .15s", textAlign:"left" },
  ct:{ fontSize:14.5, fontWeight:800, color:T.t1 },
  link:{ fontSize:11.5, fontWeight:700, color:T.gold, textDecoration:"none", opacity:.75 },
  empty:{ fontSize:12, fontWeight:500, color:T.t3, fontStyle:"italic", textAlign:"center" },
  btn:{ display:"inline-flex", alignItems:"center", gap:7, fontSize:12, fontWeight:700,
    color:"#fff", background:T.gold, border:"none", borderRadius:10, padding:"9px 16px",
    cursor:"pointer", boxShadow:`0 4px 18px ${T.gold}44, 0 1px 0 rgba(255,255,255,0.15) inset` },
};

/* ── Global CSS ────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; }
  :focus-visible { outline:2px solid ${T.gold}; outline-offset:3px; border-radius:8px; }
  button:disabled { opacity:.38; cursor:not-allowed; }

  .bar-shim {
    position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15) 50%,transparent);
    background-size:200% 100%;
    animation:shimBar 2.4s linear infinite;
  }
  .nav-btn:hover   { background:${T.bg2} !important; border-left-color:${T.gold}44 !important; }
  .lopt:hover      { background:${T.bg2} !important; }
  .dq-btn:hover    { transform:translateX(4px); filter:brightness(1.08); }
  .qpill:hover     { transform:translateY(-2px); filter:brightness(1.12); box-shadow:0 6px 22px rgba(0,0,0,0.4); }
  .lang-add-btn:hover { transform:translateY(-3px); filter:brightness(1.1); box-shadow:0 8px 28px rgba(0,0,0,0.45); }
  button:active:not(:disabled) { opacity:.82; }

  .pop-in   { animation:popIn  .24s cubic-bezier(.34,1.3,.64,1) both; }
  .toast-in { animation:toastI .28s ease both, toastO .28s 2.3s ease forwards; }

  @keyframes popIn   { from{opacity:0;transform:scale(.93) translateY(7px)} to{opacity:1;transform:none} }
  @keyframes shimBar { from{background-position:-200% center} to{background-position:200% center} }
  @keyframes toastI  { from{opacity:0;transform:scale(.84)} to{opacity:1;transform:none} }
  @keyframes toastO  { to{opacity:0;transform:translateY(-4px)} }
`;