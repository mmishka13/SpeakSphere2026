import { useState } from "react";

// ─── TOKENS (must come first — used by all components below) ──
const T = {
  bg0:"#0f0b07", bg1:"#19110a", bg2:"#231708", bg3:"#2e1f0e",
  t1:"#f2dfc4", t2:"#9d7d5a", t3:"#5a3f28",
  gold:"#e09840",
  goldGlow:"rgba(224,152,64,0.18)", goldRing:"rgba(224,152,64,0.28)",
  green:"#3ec98a",  greenG:"rgba(62,201,138,0.14)",
  blue:"#4e9fe8",   blueG:"rgba(78,159,232,0.14)",
  rose:"#e05878",   roseG:"rgba(224,88,120,0.14)",
  violet:"#9f72e8", violetG:"rgba(159,114,232,0.14)",
  teal:"#38c4c0",   tealG:"rgba(56,196,192,0.14)",
  amber:"#e8a830",  amberG:"rgba(232,168,48,0.14)",
  border:"rgba(224,152,64,0.08)",
  borderMd:"rgba(224,152,64,0.16)",
  shadow:"0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.35)",
  shadowLg:"0 8px 40px rgba(0,0,0,0.55)",
};

// ─── STYLE OBJECTS (must come before components that use them) ──
const S = {
  topbar:{
    background:`${T.bg0}f0`, backdropFilter:"blur(18px)",
    borderBottom:`1px solid ${T.border}`, padding:"14px 24px",
    display:"flex", alignItems:"center", gap:8, flexShrink:0, flexWrap:"wrap", rowGap:8,
  },
  tabBtn:{
    display:"flex", alignItems:"center", gap:6, background:T.bg2,
    border:`1px solid ${T.border}`, borderRadius:10, padding:"7px 13px",
    fontSize:12, fontWeight:600, color:T.t2, cursor:"pointer", transition:"all .2s",
    whiteSpace:"nowrap",
  },
  navArrow:{
    width:32, height:32, background:T.bg2, border:`1px solid ${T.border}`,
    borderRadius:9, cursor:"pointer", fontSize:18, color:T.t2,
    display:"flex", alignItems:"center", justifyContent:"center", transition:"all .18s", flexShrink:0,
  },
};

// ─── CSS (must come before components) ─────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; }
  :focus-visible { outline:2px solid ${T.gold}; outline-offset:3px; border-radius:8px; }
  .cal-cell:hover   { background:${T.bg2} !important; border-color:${T.borderMd} !important; }
  .ev-pill:hover    { filter:brightness(1.18); transform:translateX(2px); }
  .agenda-item:hover{ background:${T.bg3} !important; }
  .sess-card:hover  { border-color:${T.borderMd} !important; transform:translateY(-2px);
                      box-shadow:0 8px 32px rgba(0,0,0,0.5) !important; }
  .book-btn:hover   { filter:brightness(1.1); transform:scale(1.04); }
  .gcal-btn:hover   { background:${T.goldRing} !important; }
  .tab-btn:hover    { background:${T.bg3} !important; color:${T.t1} !important; }
  .arrow-btn:hover  { background:${T.bg3} !important; color:${T.t1} !important; }
  .upcoming-row:hover p { color:${T.gold} !important; }
  .pop-in { animation:popIn .24s cubic-bezier(.34,1.3,.64,1) both; }
  .slide-in { animation:slideIn .2s ease both; }
  @keyframes popIn    { from{opacity:0;transform:scale(.93) translateY(8px)} to{opacity:1;transform:none} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
`;

// ─── DATA ───────────────────────────────────────────────────────
const LANGS = [
  { code:"ES", name:"Spanish",  c:"#e07858", g:"rgba(224,120,88,0.15)",  script:"Hola"       },
  { code:"FR", name:"French",   c:"#4e9fe8", g:"rgba(78,159,232,0.15)",  script:"Bonjour"    },
  { code:"JP", name:"Japanese", c:"#e05878", g:"rgba(224,88,120,0.15)",  script:"こんにちは"  },
  { code:"KO", name:"Korean",   c:"#3ec98a", g:"rgba(62,201,138,0.15)", script:"안녕"         },
];

const SUBJECT_COLORS = {
  Spanish:  { c:"#e07858", g:"rgba(224,120,88,0.18)"  },
  French:   { c:"#4e9fe8", g:"rgba(78,159,232,0.18)"  },
  Japanese: { c:"#e05878", g:"rgba(224,88,120,0.18)"  },
  Korean:   { c:"#3ec98a", g:"rgba(62,201,138,0.18)"  },
  Personal: { c:"#9f72e8", g:"rgba(159,114,232,0.18)" },
  GCal:     { c:"#38c4c0", g:"rgba(56,196,192,0.18)"  },
  Reminder: { c:"#e8a830", g:"rgba(232,168,48,0.18)"  },
};

const LEVEL_META = {
  Beginner:     { c:T.green,  g:T.greenG },
  Intermediate: { c:T.gold,   g:T.amberG },
  Advanced:     { c:T.rose,   g:T.roseG  },
};

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DOW    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function buildPersonalEvents(year, month) {
  const d = (day, h, m=0) => new Date(year, month, day, h, m);
  return [
    { id:"e1",  subject:"Spanish",  title:"Spanish Conversation",  start:d(3,16),  end:d(3,17),    tutor:"Maria G.",  desc:"Practice daily conversation topics"       },
    { id:"e2",  subject:"Spanish",  title:"Grammar Office Hours",  start:d(5,18),  end:d(5,19),    tutor:"Carlos R.", desc:"Irregular preterite deep dive"             },
    { id:"e3",  subject:"French",   title:"French Basics",         start:d(5,14),  end:d(5,15),    tutor:"Claire D.", desc:"Intro to French pronunciation"             },
    { id:"e4",  subject:"Spanish",  title:"Pronunciation Lab",     start:d(8,15),  end:d(8,16),    tutor:"Sofia L.",  desc:"Rolling R's and vowel sounds"             },
    { id:"e5",  subject:"Korean",   title:"Korean Study Group",    start:d(10,17), end:d(10,18),   tutor:"Jin P.",    desc:"Hangul reading practice"                  },
    { id:"e6",  subject:"Spanish",  title:"Spanish Session",       start:d(11,16), end:d(11,17),   tutor:"Maria G.",  desc:"Ser vs Estar review"                      },
    { id:"e7",  subject:"Japanese", title:"Japanese Intro",        start:d(12,13), end:d(12,14),   tutor:"Yuki T.",   desc:"Hiragana chart overview"                  },
    { id:"e8",  subject:"Personal", title:"Doctor Appt",           start:d(14,10), end:d(14,11),   tutor:null,        desc:"Annual checkup"                           },
    { id:"e9",  subject:"French",   title:"French Immersion",      start:d(15,15), end:d(15,17),   tutor:"Pierre M.", desc:"Listening & shadowing"                    },
    { id:"e10", subject:"Spanish",  title:"Spanish Conversation",  start:d(17,16), end:d(17,17),   tutor:"Maria G.",  desc:"Travel vocabulary"                        },
    { id:"e11", subject:"Reminder", title:"Study Hall",            start:d(18,19), end:d(18,21),   tutor:null,        desc:"Self-study: vocab flashcards"             },
    { id:"e12", subject:"Korean",   title:"Korean Grammar",        start:d(20,14), end:d(20,15),   tutor:"Jin P.",    desc:"Particle practice"                        },
    { id:"e13", subject:"Spanish",  title:"Spanish Session",       start:d(22,16), end:d(22,17),   tutor:"Carlos R.", desc:"Subjunctive mood intro"                   },
    { id:"e14", subject:"French",   title:"French Conversation",   start:d(24,15), end:d(24,16),   tutor:"Claire D.", desc:"Everyday French phrases"                  },
    { id:"e15", subject:"Personal", title:"Birthday Party",        start:d(25,18), end:d(25,22),   tutor:null,        desc:"Miguel's birthday"                        },
    { id:"e16", subject:"Japanese", title:"Japanese Session",      start:d(26,13), end:d(26,14),   tutor:"Yuki T.",   desc:"Basic greetings"                          },
    { id:"e17", subject:"Spanish",  title:"Spanish Immersion",     start:d(28,17), end:d(28,19),   tutor:"Sofia L.",  desc:"Full conversation, no notes"              },
    { id:"e18", subject:"Reminder", title:"Weekly Review",         start:d(30,20), end:d(30,21),   tutor:null,        desc:"Log progress, set next week goals"        },
  ];
}

function buildGCalEvents(year, month) {
  const d = (day, h, m=0) => new Date(year, month, day, h, m);
  return [
    { id:"gc1", subject:"GCal", title:"CS Homework Due",   start:d(6,23),  end:d(6,23),  tutor:null, desc:"From Google Calendar" },
    { id:"gc2", subject:"GCal", title:"Team Project Call", start:d(9,14),  end:d(9,15),  tutor:null, desc:"From Google Calendar" },
    { id:"gc3", subject:"GCal", title:"FBLA Meeting",      start:d(13,16), end:d(13,17), tutor:null, desc:"From Google Calendar" },
    { id:"gc4", subject:"GCal", title:"SAT Prep",          start:d(19,9),  end:d(19,12), tutor:null, desc:"From Google Calendar" },
    { id:"gc5", subject:"GCal", title:"College Tour",      start:d(22,8),  end:d(22,18), tutor:null, desc:"From Google Calendar" },
    { id:"gc6", subject:"GCal", title:"AP Exam",           start:d(27,8),  end:d(27,12), tutor:null, desc:"From Google Calendar" },
  ];
}

const SESSIONS = {
  ES: [
    { id:"s1", title:"Beginner Spanish Chat",     tutor:"Maria G.",  level:"Beginner",     day:9,  time:"4:00 PM", dur:60,  spots:3, max:6,  desc:"Casual conversation for absolute beginners. No pressure!" },
    { id:"s2", title:"Grammar Office Hours",      tutor:"Carlos R.", level:"Intermediate", day:11, time:"6:00 PM", dur:60,  spots:3, max:8,  desc:"Open Q&A on grammar topics. Bring your questions." },
    { id:"s3", title:"Pronunciation Workshop",    tutor:"Sofia L.",  level:"Beginner",     day:13, time:"3:00 PM", dur:45,  spots:5, max:10, desc:"Focus on rolling R's, vowel clarity, and accent reduction." },
    { id:"s4", title:"Advanced Conversation",     tutor:"Diego V.",  level:"Advanced",     day:16, time:"5:00 PM", dur:90,  spots:2, max:6,  desc:"In-depth discussion of culture, news, and literature." },
    { id:"s5", title:"Subjunctive Deep Dive",     tutor:"Carlos R.", level:"Intermediate", day:18, time:"7:00 PM", dur:60,  spots:4, max:8,  desc:"Finally master the subjunctive mood with practice sentences." },
    { id:"s6", title:"Spanish Movie Club",        tutor:"Maria G.",  level:"Intermediate", day:21, time:"6:00 PM", dur:120, spots:6, max:12, desc:"Watch & discuss a Spanish film. This week: Roma." },
    { id:"s7", title:"Vocabulary Blitz",          tutor:"Ana L.",    level:"Beginner",     day:23, time:"4:00 PM", dur:45,  spots:7, max:10, desc:"Top 500 Spanish words with memory techniques." },
    { id:"s8", title:"Business Spanish",          tutor:"Diego V.",  level:"Advanced",     day:27, time:"5:30 PM", dur:60,  spots:1, max:6,  desc:"Formal vocabulary, email writing, presentation phrases." },
  ],
  FR: [
    { id:"f1", title:"French for Beginners",      tutor:"Claire D.", level:"Beginner",     day:7,  time:"3:00 PM", dur:60,  spots:4, max:8,  desc:"Start your French journey from zero." },
    { id:"f2", title:"Intermediate Conversation", tutor:"Pierre M.", level:"Intermediate", day:14, time:"5:00 PM", dur:60,  spots:2, max:6,  desc:"Everyday French conversations at natural pace." },
    { id:"f3", title:"French Pronunciation",      tutor:"Claire D.", level:"Beginner",     day:20, time:"4:00 PM", dur:45,  spots:6, max:10, desc:"Nasal vowels, silent letters, liaison." },
  ],
  JP: [
    { id:"j1", title:"Hiragana & Katakana",       tutor:"Yuki T.",   level:"Beginner",     day:8,  time:"2:00 PM", dur:60,  spots:5, max:10, desc:"Master both syllabaries in one focused session." },
    { id:"j2", title:"JLPT N5 Prep",              tutor:"Kenji M.",  level:"Beginner",     day:17, time:"4:00 PM", dur:90,  spots:3, max:8,  desc:"Grammar and vocab for the N5 certification." },
  ],
  KO: [
    { id:"k1", title:"Hangul Reading",            tutor:"Jin P.",    level:"Beginner",     day:10, time:"3:00 PM", dur:60,  spots:4, max:8,  desc:"Read and write Korean script fluently." },
    { id:"k2", title:"K-Drama Vocabulary",        tutor:"Soo Y.",    level:"Intermediate", day:22, time:"6:00 PM", dur:60,  spots:6, max:12, desc:"Learn conversational Korean through K-Drama clips." },
  ],
};

// ─── HELPERS ────────────────────────────────────────────────────
function toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  return new Date(v);
}
function fmt12(date) {
  const d = toDate(date); if (!d) return "";
  let h = d.getHours(), m = d.getMinutes(), ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2,"0")} ${ampm}` : `${h} ${ampm}`;
}
function sameDay(a, b) {
  const da = toDate(a), db = toDate(b);
  if (!da || !db) return false;
  return da.getFullYear()===db.getFullYear() && da.getMonth()===db.getMonth() && da.getDate()===db.getDate();
}
function sessionToEvent(sess, year, month) {
  const parts = sess.time.replace(" PM","").replace(" AM","").split(":");
  const isPM  = sess.time.includes("PM") && parseInt(parts[0]) !== 12;
  const h     = isPM ? parseInt(parts[0]) + 12 : parseInt(parts[0]);
  const start = new Date(year, month, sess.day, h, parseInt(parts[1]||0));
  const end   = new Date(start.getTime() + sess.dur * 60000);
  return { ...sess, start, end };
}

// ─── SMALL COMPONENTS ───────────────────────────────────────────
function EventPill({ ev, onClick }) {
  const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
  return (
    <div onClick={e => { e.stopPropagation(); onClick(ev); }}
      className="ev-pill"
      style={{ background:sc.g, borderLeft:`2.5px solid ${sc.c}`, borderRadius:"0 5px 5px 0",
        padding:"2px 6px", marginBottom:2, cursor:"pointer", overflow:"hidden",
        whiteSpace:"nowrap", textOverflow:"ellipsis", transition:"all .15s" }}>
      <span style={{ fontSize:10, fontWeight:700, color:sc.c }}>{fmt12(ev.start)} </span>
      <span style={{ fontSize:10, fontWeight:600, color:T.t2 }}>{ev.title}</span>
    </div>
  );
}

function EventModal({ ev, onClose, onBook, onUnbook, isBooked }) {
  if (!ev) return null;
  const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
  const isSession = ev.spots !== undefined || ev._sessId !== undefined;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      backdropFilter:"blur(10px)", zIndex:999, display:"flex",
      alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div className="pop-in"
        style={{ background:T.bg1, border:`1px solid ${sc.c}30`, borderRadius:20,
          padding:28, width:"100%", maxWidth:420, boxShadow:T.shadowLg, position:"relative" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
          background:`linear-gradient(90deg,transparent,${sc.c},transparent)`,
          borderRadius:"20px 20px 0 0" }}/>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:sc.c, flexShrink:0, marginTop:3 }}/>
            <div>
              <h2 style={{ fontSize:18, fontWeight:800, color:T.t1, lineHeight:1.2 }}>{ev.title}</h2>
              <p style={{ fontSize:11, color:T.t2, marginTop:3 }}>{ev.subject}</p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:9,
              width:30, height:30, cursor:"pointer", fontSize:16, color:T.t2, flexShrink:0 }}>×</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:T.bg2, borderRadius:10, padding:"8px 12px", flex:1 }}>
              <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.1em", marginBottom:3 }}>DATE & TIME</p>
              <p style={{ fontSize:12.5, fontWeight:700, color:T.t1 }}>
                {ev.start.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
              </p>
              <p style={{ fontSize:11.5, color:T.t2, marginTop:2 }}>{fmt12(ev.start)} – {fmt12(ev.end)}</p>
            </div>
            {ev.tutor && (
              <div style={{ background:T.bg2, borderRadius:10, padding:"8px 12px", flex:1 }}>
                <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.1em", marginBottom:3 }}>TUTOR</p>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:sc.g,
                    border:`1px solid ${sc.c}30`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:9, fontWeight:800, color:sc.c }}>
                    {ev.tutor.split(" ").map(w=>w[0]).join("")}
                  </div>
                  <p style={{ fontSize:12.5, fontWeight:700, color:T.t1 }}>{ev.tutor}</p>
                </div>
              </div>
            )}
          </div>

          {isSession && (
            <div style={{ background:T.bg2, borderRadius:10, padding:"8px 12px" }}>
              <p style={{ fontSize:9.5, fontWeight:700, color:T.t3, letterSpacing:"0.1em", marginBottom:6 }}>AVAILABILITY</p>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <div style={{ flex:1, height:6, borderRadius:99, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:99,
                    width:`${((ev.max - ev.spots) / ev.max) * 100}%`,
                    background: ev.spots <= 2 ? T.rose : T.green }}/>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:ev.spots<=2?T.rose:T.green, whiteSpace:"nowrap" }}>
                  {ev.spots} spot{ev.spots!==1?"s":""} left
                </span>
              </div>
            </div>
          )}

          {isSession && ev.level && (
            <div style={{ display:"flex", gap:6 }}>
              <span style={{ background:LEVEL_META[ev.level]?.g, color:LEVEL_META[ev.level]?.c,
                fontSize:10, fontWeight:700, borderRadius:99, padding:"3px 11px" }}>{ev.level}</span>
              <span style={{ background:T.bg2, color:T.t2, fontSize:10, fontWeight:600,
                borderRadius:99, padding:"3px 11px" }}>{ev.dur} min</span>
            </div>
          )}

          {ev.desc && <p style={{ fontSize:12.5, color:T.t2, lineHeight:1.6 }}>{ev.desc}</p>}

          {isSession && (
            isBooked
              ? <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ background:T.greenG, border:`1px solid ${T.green}33`, borderRadius:11,
                    padding:"10px 16px", textAlign:"center" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.green }}>✓ Booked — added to your calendar</span>
                  </div>
                  <button onClick={() => { onUnbook(ev._sessId || ev.id); onClose(); }} className="book-btn"
                    style={{ width:"100%", background:"none", border:`1px solid ${T.rose}55`, borderRadius:11,
                      padding:"9px", fontSize:12, fontWeight:700, color:T.rose,
                      cursor:"pointer", transition:"all .2s" }}>
                    Cancel Booking
                  </button>
                </div>
              : ev.spots === 0
                ? <div style={{ background:T.roseG, border:`1px solid ${T.rose}33`, borderRadius:11,
                    padding:"10px 16px", textAlign:"center" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.rose }}>Session Full</span>
                  </div>
                : <button onClick={() => onBook(ev)} className="book-btn"
                    style={{ width:"100%", background:sc.c, border:"none", borderRadius:11,
                      padding:"11px", fontSize:13, fontWeight:800, color:"#fff",
                      cursor:"pointer", boxShadow:`0 4px 18px ${sc.c}44`, transition:"all .2s" }}>
                    Book This Session
                  </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GCalBanner({ connected, onConnect, onDisconnect, count }) {
  if (connected) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, background:T.greenG,
        border:`1px solid ${T.green}33`, borderRadius:12, padding:"10px 16px", marginBottom:14 }}>
        <span style={{ fontSize:14 }}>✓</span>
        <span style={{ fontSize:12.5, fontWeight:700, color:T.green, flex:1 }}>
          Google Calendar connected · {count} events imported
        </span>
        <button onClick={onDisconnect}
          style={{ background:"none", border:`1px solid ${T.green}44`, borderRadius:8,
            padding:"3px 10px", fontSize:11, fontWeight:700, color:T.green, cursor:"pointer" }}>
          Disconnect
        </button>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, background:T.bg2,
      border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 16px", marginBottom:14 }}>
      <svg width={20} height={20} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:12.5, fontWeight:700, color:T.t1 }}>Connect Google Calendar</p>
        <p style={{ fontSize:11, color:T.t2, marginTop:1 }}>Demo mode — simulates import. Add your Google Client ID to go live.</p>
      </div>
      <button onClick={onConnect} className="gcal-btn"
        style={{ background:T.goldGlow, border:`1px solid ${T.goldRing}`, borderRadius:10,
          padding:"7px 14px", fontSize:12, fontWeight:700, color:T.gold,
          cursor:"pointer", whiteSpace:"nowrap", transition:"all .2s" }}>
        Connect
      </button>
    </div>
  );
}

// ─── PERSONAL CALENDAR VIEW ─────────────────────────────────────
function PersonalCalendar({ year, month, allEvents, onSelectDay, selectedDay, onEventClick, gcalConn, onConnect, onDisconnect, gcalCount }) {
  const firstDow   = new Date(year, month, 1).getDay();
  const daysInMon  = new Date(year, month+1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDow + daysInMon) / 7) * 7;
  const today      = new Date();

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const n = i - firstDow + 1;
    if (n < 1)          return { day: daysInPrev + n,    type:"prev" };
    if (n > daysInMon)  return { day: n - daysInMon,     type:"next" };
    return               { day: n,                        type:"curr" };
  });

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:"14px 20px 14px 24px" }}>
      <GCalBanner connected={gcalConn} onConnect={onConnect} onDisconnect={onDisconnect} count={gcalCount}/>

      {/* Legend */}
      <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:10, fontWeight:700, color:T.t3, letterSpacing:"0.09em" }}>LEGEND</span>
        {Object.entries(SUBJECT_COLORS).map(([subj, sc]) => {
          if (subj === "GCal" && !gcalConn) return null;
          return (
            <div key={subj} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:sc.c }}/>
              <span style={{ fontSize:10, fontWeight:600, color:T.t2 }}>{subj}</span>
            </div>
          );
        })}
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700,
            color:T.t3, letterSpacing:"0.09em", padding:"3px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="slide-in" style={{ flex:1, display:"grid",
        gridTemplateColumns:"repeat(7,1fr)",
        gridTemplateRows:`repeat(${totalCells/7},1fr)`, gap:3 }}>
        {cells.map((cell, i) => {
          const isCurr = cell.type === "curr";
          const cellDate = isCurr ? new Date(year, month, cell.day) : null;
          const isTod  = isCurr && cellDate && sameDay(cellDate, today);
          const isSel  = isCurr && selectedDay && cellDate && sameDay(cellDate, selectedDay);
          const evs    = isCurr ? allEvents.filter(ev => sameDay(ev.start, cellDate)) : [];

          return (
            <div key={i}
              onClick={() => isCurr && onSelectDay(cellDate)}
              className={isCurr ? "cal-cell" : ""}
              style={{
                background: isSel ? T.goldGlow : isCurr ? T.bg1 : "rgba(255,255,255,0.01)",
                border: `1px solid ${isSel ? T.goldRing : isCurr ? T.border : "transparent"}`,
                borderRadius:9, padding:"5px 5px 4px",
                cursor: isCurr ? "pointer" : "default",
                transition:"all .15s", overflow:"hidden", minHeight:0,
              }}>
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:2 }}>
                <span style={{
                  fontSize:10.5, fontWeight: isTod ? 800 : isCurr ? 600 : 500,
                  color: isTod ? "#fff" : isCurr ? T.t1 : T.t3,
                  background: isTod ? T.gold : "transparent",
                  borderRadius:"50%", width:19, height:19,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {cell.day}
                </span>
              </div>
              {evs.slice(0, 3).map((ev, ei) => (
                <EventPill key={ei} ev={ev} onClick={onEventClick}/>
              ))}
              {evs.length > 3 && (
                <span style={{ fontSize:9, color:T.t3, fontWeight:700, paddingLeft:4 }}>+{evs.length-3} more</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AGENDA SIDEBAR ─────────────────────────────────────────────
function AgendaSidebar({ selectedDay, allEvents, onEventClick }) {
  const dayEvs = selectedDay
    ? allEvents.filter(ev => sameDay(ev.start, selectedDay)).sort((a,b) => a.start - b.start)
    : [];
  const upcoming = allEvents
    .filter(ev => ev.start >= (selectedDay || new Date()))
    .sort((a,b) => a.start - b.start)
    .slice(0, 5);

  return (
    <div style={{ width:272, borderLeft:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
      <div style={{ padding:"18px 16px 12px", borderBottom:`1px solid ${T.border}` }}>
        <p style={{ fontSize:10, fontWeight:700, color:T.t3, letterSpacing:"0.1em", marginBottom:4 }}>AGENDA</p>
        <p style={{ fontSize:14, fontWeight:800, color:T.t1 }}>
          {selectedDay
            ? selectedDay.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})
            : "Select a day"}
        </p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"10px 14px" }}>
        {!selectedDay ? (
          <p style={{ fontSize:12, color:T.t3, fontStyle:"italic", textAlign:"center", marginTop:28 }}>
            Click any day to see its events
          </p>
        ) : dayEvs.length === 0 ? (
          <p style={{ fontSize:12, color:T.t3, fontStyle:"italic", textAlign:"center", marginTop:28 }}>
            No events — enjoy the break!
          </p>
        ) : dayEvs.map((ev, i) => {
          const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
          return (
            <div key={i} onClick={() => onEventClick(ev)} className="agenda-item"
              style={{ display:"flex", gap:10, padding:"9px 10px", marginBottom:7,
                background:T.bg2, border:`1px solid ${T.border}`,
                borderLeft:`3px solid ${sc.c}`, borderRadius:11,
                cursor:"pointer", transition:"all .15s" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12.5, fontWeight:700, color:T.t1,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</p>
                <p style={{ fontSize:11, color:T.t2, marginTop:2 }}>{fmt12(ev.start)} – {fmt12(ev.end)}</p>
                {ev.tutor && <p style={{ fontSize:10.5, color:T.t3, marginTop:1 }}>{ev.tutor}</p>}
              </div>
              <div style={{ width:7, height:7, borderRadius:"50%", background:sc.c, marginTop:5, flexShrink:0 }}/>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop:`1px solid ${T.border}`, padding:"10px 14px 14px" }}>
        <p style={{ fontSize:10, fontWeight:700, color:T.t3, letterSpacing:"0.1em", marginBottom:9 }}>UPCOMING</p>
        {upcoming.map((ev, i) => {
          const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
          return (
            <div key={i} onClick={() => onEventClick(ev)}
              className="upcoming-row"
              style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7, cursor:"pointer" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:sc.c, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:11.5, fontWeight:700, color:T.t1,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                  transition:"color .15s" }}>{ev.title}</p>
                <p style={{ fontSize:10, color:T.t3 }}>
                  {ev.start.toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {fmt12(ev.start)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SESSIONS VIEW ──────────────────────────────────────────────
function SessionsView({ langCode, year, month, booked, onBook, onUnbook, onCardClick, goMonth }) {
  const lm       = LANGS.find(l => l.code === langCode) || LANGS[0];
  const sessions = SESSIONS[langCode] || [];

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 24px 40px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
        <div style={{ width:44, height:44, borderRadius:14, background:lm.g,
          border:`1px solid ${lm.c}30`, display:"flex", alignItems:"center",
          justifyContent:"center", fontFamily:"Georgia,serif", fontSize:20, color:lm.c }}>
          {lm.script.slice(0,2)}
        </div>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.t1 }}>{lm.name} Sessions</h2>
          <p style={{ fontSize:12, color:T.t2, marginTop:2 }}>
            {sessions.length} sessions available · Browse and book below
          </p>
        </div>
        <div style={{ marginLeft:"auto", background:T.bg2, border:`1px solid ${T.border}`,
          borderRadius:11, padding:"8px 14px", fontSize:11, fontWeight:600, color:T.t2 }}>
          {"💡 To host a session → "}
          <span style={{ color:T.gold, fontWeight:700 }}>Dashboard → Tutor tab</span>
        </div>
      </div>

      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <button onClick={() => goMonth(-1)} style={S.navArrow} className="arrow-btn">‹</button>
        <span style={{ fontSize:14, fontWeight:700, color:T.t1 }}>{MONTHS[month]} {year}</span>
        <button onClick={() => goMonth(1)} style={S.navArrow} className="arrow-btn">›</button>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <p style={{ fontSize:30, marginBottom:12 }}>🌐</p>
          <p style={{ fontSize:14, color:T.t2 }}>No sessions scheduled this month.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
          {sessions.map(sess => {
            const lv       = LEVEL_META[sess.level] || LEVEL_META.Beginner;
            const isBooked = !!booked[sess.id];
            const isFull   = sess.spots === 0;
            const sessDate = new Date(year, month, sess.day);
            const ev       = sessionToEvent(sess, year, month);

            return (
              <div key={sess.id} className="sess-card"
                onClick={() => onCardClick({ ...sess, start:ev.start, end:ev.end, subject:lm.name })}
                style={{ background:T.bg1, border:`1px solid ${isBooked ? T.green+"44" : T.border}`,
                  borderRadius:16, padding:"18px 20px", cursor:"pointer",
                  transition:"all .2s", position:"relative", overflow:"hidden", boxShadow:T.shadow }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                  background:`linear-gradient(90deg,transparent,${lm.c}66,transparent)` }}/>

                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:lm.g,
                    border:`1px solid ${lm.c}25`, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0, fontSize:16 }}>🎓</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:T.t1, lineHeight:1.25, marginBottom:3 }}>{sess.title}</p>
                    <p style={{ fontSize:11, color:T.t2 }}>with {sess.tutor}</p>
                  </div>
                  {isBooked && (
                    <span style={{ background:T.greenG, border:`1px solid ${T.green}33`,
                      borderRadius:8, padding:"3px 9px", fontSize:10, fontWeight:700, color:T.green }}>
                      ✓ Booked
                    </span>
                  )}
                </div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                  <span style={{ background:T.bg2, color:T.t2, fontSize:10, fontWeight:600, borderRadius:99, padding:"3px 10px" }}>
                    {sessDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {sess.time}
                  </span>
                  <span style={{ background:T.bg2, color:T.t2, fontSize:10, fontWeight:600, borderRadius:99, padding:"3px 10px" }}>
                    {sess.dur} min
                  </span>
                  <span style={{ background:lv.g, color:lv.c, fontSize:10, fontWeight:700, borderRadius:99, padding:"3px 10px" }}>
                    {sess.level}
                  </span>
                </div>

                <p style={{ fontSize:12, color:T.t2, lineHeight:1.5, marginBottom:12 }}>{sess.desc}</p>

                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ display:"flex", gap:3, flex:1 }}>
                    {Array.from({ length: sess.max }).map((_, i) => (
                      <div key={i} style={{ width:7, height:7, borderRadius:"50%",
                        background: i < (sess.max - sess.spots) ? lm.c : "rgba(255,255,255,0.07)" }}/>
                    ))}
                  </div>
                  <span style={{ fontSize:10.5, fontWeight:700,
                    color: isFull ? T.rose : sess.spots <= 2 ? T.amber : T.green }}>
                    {isFull ? "Full" : `${sess.spots} spot${sess.spots!==1?"s":""} left`}
                  </span>
                  {isBooked
                    ? <button onClick={e => { e.stopPropagation(); onUnbook(sess.id); }}
                        className="book-btn"
                        style={{ background:"none", border:`1px solid ${T.rose}55`, borderRadius:9, padding:"6px 13px",
                          fontSize:11, fontWeight:700, color:T.rose, cursor:"pointer",
                          transition:"all .2s", flexShrink:0, whiteSpace:"nowrap" }}>
                        Cancel
                      </button>
                    : !isFull && (
                      <button onClick={e => { e.stopPropagation(); onBook(sess); }}
                        className="book-btn"
                        style={{ background:lm.c, border:"none", borderRadius:9, padding:"6px 13px",
                          fontSize:11, fontWeight:800, color:"#fff", cursor:"pointer",
                          boxShadow:`0 3px 12px ${lm.c}44`, transition:"all .2s", flexShrink:0 }}>
                        Book
                      </button>
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────
export default function CalendarPage() {
  const today = new Date();
  const [month,    setMonth]    = useState(today.getMonth());
  const [year,     setYear]     = useState(today.getFullYear());
  const [tab,      setTab]      = useState("personal");
  const [selDay,   setSelDay]   = useState(null);
  const [modal,    setModal]    = useState(null);
  const [bookedEvs, setBookedEvs] = useState({});
  const [gcalConn,  setGcalConn]  = useState(false);

  const personalEvs   = buildPersonalEvents(year, month);
  const gcalEvsList   = gcalConn ? buildGCalEvents(year, month) : [];
  const bookedEvsList = Object.values(bookedEvs);
  const allEvs        = [...personalEvs, ...gcalEvsList, ...bookedEvsList];

  function goMonth(dir) {
    setMonth(m => {
      const nm = m + dir;
      if (nm > 11) { setYear(y => y+1); return 0; }
      if (nm < 0)  { setYear(y => y-1); return 11; }
      return nm;
    });
    setSelDay(null);
  }

  function book(sess) {
    const ev = sessionToEvent(sess, year, month);
    const langName = LANGS.find(l => (SESSIONS[l.code]||[]).some(s=>s.id===sess.id))?.name || "Spanish";
    const calEv = {
      id:"booked_"+sess.id, title:sess.title, subject:langName,
      start:ev.start, end:ev.end, tutor:sess.tutor, desc:sess.desc, _sessId:sess.id,
    };
    setBookedEvs(b => ({ ...b, [sess.id]: calEv }));
  }

  function unbook(sessId) {
    setBookedEvs(b => { const n={...b}; delete n[sessId]; return n; });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh",
      background:T.bg0, color:T.t1, fontFamily:"'Sora','Plus Jakarta Sans',sans-serif",
      overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* TOP BAR */}
      <header style={S.topbar}>
        <div style={{ marginRight:16 }}>
          <p style={{ fontSize:10, fontWeight:600, color:T.t3, letterSpacing:"0.1em", marginBottom:2 }}>SPEAKSPHERE</p>
          <h1 style={{ fontSize:21, fontWeight:800, color:T.t1, letterSpacing:"-0.025em", lineHeight:1 }}>Schedule</h1>
        </div>

        {/* View tabs */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={() => setTab("personal")}
            style={{ ...S.tabBtn, ...(tab==="personal" ? { background:T.goldGlow, color:T.gold, border:`1px solid ${T.goldRing}` } : {}) }}
            className={tab!=="personal" ? "tab-btn" : ""}>
            🗓 My Calendar
          </button>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setTab(l.code)}
              style={{ ...S.tabBtn, ...(tab===l.code ? { background:l.g, color:l.c, border:`1px solid ${l.c}40` } : {}) }}
              className={tab!==l.code ? "tab-btn" : ""}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:13 }}>{l.script.slice(0,3)}</span>
              {" "}{l.name}
            </button>
          ))}
        </div>

        {/* Month nav (personal only) */}
        {tab === "personal" && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
            <button onClick={() => goMonth(-1)} style={S.navArrow} className="arrow-btn">‹</button>
            <span style={{ fontSize:14, fontWeight:800, color:T.t1, minWidth:150, textAlign:"center" }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={() => goMonth(1)} style={S.navArrow} className="arrow-btn">›</button>
            <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
              style={{ ...S.navArrow, width:"auto", padding:"0 12px", fontSize:11, fontWeight:700 }}
              className="arrow-btn">
              Today
            </button>
          </div>
        )}
      </header>

      {/* BODY */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {tab === "personal" ? (
          <>
            <PersonalCalendar
              year={year} month={month} allEvents={allEvs}
              onSelectDay={setSelDay} selectedDay={selDay}
              onEventClick={setModal}
              gcalConn={gcalConn}
              onConnect={() => setGcalConn(true)}
              onDisconnect={() => setGcalConn(false)}
              gcalCount={buildGCalEvents(year, month).length}
            />
            <AgendaSidebar
              selectedDay={selDay} allEvents={allEvs}
              onEventClick={setModal}
            />
          </>
        ) : (
          <SessionsView
            langCode={tab} year={year} month={month}
            booked={bookedEvs} onBook={book} onUnbook={unbook}
            onCardClick={setModal} goMonth={goMonth}
          />
        )}
      </div>

      <EventModal
        ev={modal}
        onClose={() => setModal(null)}
        onBook={sess => { book(sess); }}
        isBooked={modal ? !!bookedEvs[modal._sessId||modal.id] : false}
        onUnbook={unbook}
      />
    </div>
  );
}