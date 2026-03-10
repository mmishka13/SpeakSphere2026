import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DARK   = "#0d0702";
const CARD   = "#1b0f06";
const CARD2  = "#200f06";
const GOLD   = "#d4a843";
const GOLDLT = "#f0cc55";
const CREAM  = "#f5ede0";
const MUTED  = "#c8aa80";
const DIM    = "#a08050";
const BORD   = "rgba(212,168,67,0.20)";
const BORD2  = "rgba(212,168,67,0.06)";
const BODY   = "#c8aa80";
const A_GREEN  = "#7db87d";
const A_BLUE   = "#6a9ec0";
const A_ROSE   = "#c07070";
const A_AMBER  = "#d4a96a";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;1,400;1,600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(212,168,67,0.2); border-radius:2px; }
  .hud-cell { transition:background .12s, border-color .12s; }
  .hud-cell:hover { background:rgba(212,168,67,0.05) !important; border-color:rgba(212,168,67,0.2) !important; }
  .ev-chip:hover { filter:brightness(1.25); transform:translateX(1px); }
  .tab-btn:hover { color:#f5ede0 !important; border-color:rgba(212,168,67,0.25) !important; }
  .arrow-btn:hover { color:#f5ede0 !important; border-color:rgba(212,168,67,0.25) !important; background:rgba(212,168,67,0.06) !important; }
  .agenda-row:hover { background:rgba(212,168,67,0.05) !important; }
  .sess-card:hover { border-color:rgba(212,168,67,0.22) !important; transform:translateY(-1px); }
  .book-btn:hover { filter:brightness(1.1); transform:scale(1.02); }
  .pop-in { animation:popIn .2s cubic-bezier(.34,1.3,.64,1) both; }
  .fade-in { animation:fadeIn .18s ease both; }
  @keyframes popIn  { from{opacity:0;transform:scale(.95) translateY(6px)} to{opacity:1;transform:none} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  @media(max-width:768px){
    .cal-layout { flex-direction:column !important; }
    .cal-sidebar { width:100% !important; max-height:280px !important; border-left:none !important; border-top:1px solid rgba(212,168,67,0.20) !important; overflow-y:auto !important; }
    .cal-sessions-grid { grid-template-columns:1fr !important; }
    .cal-topbar { flex-wrap:wrap !important; gap:8px !important; padding:14px 16px !important; }
    .cal-main { padding:14px !important; }
  }
  @media(min-width:768px) and (max-width:1023px){
    .cal-sidebar { width:260px !important; }
  }
`;

const LANGS = [
  { code:"ES", name:"Spanish",  c:"#e07858", g:"rgba(224,120,88,0.13)",  script:"Hola"      },
  { code:"FR", name:"French",   c:"#6a9ec0", g:"rgba(106,158,192,0.13)", script:"Bonjour"   },
  { code:"JP", name:"Japanese", c:"#c07070", g:"rgba(192,112,112,0.13)", script:"こんにちは" },
  { code:"KO", name:"Korean",   c:"#7db87d", g:"rgba(125,184,125,0.13)", script:"안녕"       },
];

const SUBJECT_COLORS = {
  Spanish:  { c:"#e07858", g:"rgba(224,120,88,0.13)"   },
  French:   { c:"#6a9ec0", g:"rgba(106,158,192,0.13)"  },
  Japanese: { c:"#c07070", g:"rgba(192,112,112,0.13)"  },
  Korean:   { c:"#7db87d", g:"rgba(125,184,125,0.13)"  },
  Personal: { c:"#b8956e", g:"rgba(184,149,110,0.13)"  },
  Reminder: { c:"#d4a96a", g:"rgba(212,169,106,0.13)"  },
};

const LEVEL_META = {
  Beginner:     { c:A_GREEN, g:"rgba(125,184,125,0.12)" },
  Intermediate: { c:GOLD,    g:"rgba(212,168,67,0.20)"  },
  Advanced:     { c:A_ROSE,  g:"rgba(192,112,112,0.12)" },
};

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DOW = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function buildPersonalEvents(year, month) {
  const d = (day, h, m=0) => new Date(year, month, day, h, m);
  return [
    { id:"e1",  subject:"Spanish",  title:"Spanish Conversation", start:d(3,16),  end:d(3,17),  tutor:"Maria G.",  desc:"Practice daily conversation topics"   },
    { id:"e2",  subject:"Spanish",  title:"Grammar Office Hours", start:d(5,18),  end:d(5,19),  tutor:"Carlos R.", desc:"Irregular preterite deep dive"         },
    { id:"e3",  subject:"French",   title:"French Basics",        start:d(5,14),  end:d(5,15),  tutor:"Claire D.", desc:"Intro to French pronunciation"         },
    { id:"e4",  subject:"Spanish",  title:"Pronunciation Lab",    start:d(8,15),  end:d(8,16),  tutor:"Sofia L.",  desc:"Rolling R's and vowel sounds"          },
    { id:"e5",  subject:"Korean",   title:"Korean Study Group",   start:d(10,17), end:d(10,18), tutor:"Jin P.",    desc:"Hangul reading practice"               },
    { id:"e6",  subject:"Spanish",  title:"Spanish Session",      start:d(11,16), end:d(11,17), tutor:"Maria G.",  desc:"Ser vs Estar review"                   },
    { id:"e7",  subject:"Japanese", title:"Japanese Intro",       start:d(12,13), end:d(12,14), tutor:"Yuki T.",   desc:"Hiragana chart overview"               },
    { id:"e8",  subject:"Personal", title:"Doctor Appt",          start:d(14,10), end:d(14,11), tutor:null,        desc:"Annual checkup"                        },
    { id:"e9",  subject:"French",   title:"French Immersion",     start:d(15,15), end:d(15,17), tutor:"Pierre M.", desc:"Listening & shadowing"                 },
    { id:"e10", subject:"Spanish",  title:"Spanish Conversation", start:d(17,16), end:d(17,17), tutor:"Maria G.",  desc:"Travel vocabulary"                     },
    { id:"e11", subject:"Reminder", title:"Study Hall",           start:d(18,19), end:d(18,21), tutor:null,        desc:"Self-study: vocab flashcards"          },
    { id:"e12", subject:"Korean",   title:"Korean Grammar",       start:d(20,14), end:d(20,15), tutor:"Jin P.",    desc:"Particle practice"                     },
    { id:"e13", subject:"Spanish",  title:"Spanish Session",      start:d(22,16), end:d(22,17), tutor:"Carlos R.", desc:"Subjunctive mood intro"                },
    { id:"e14", subject:"French",   title:"French Conversation",  start:d(24,15), end:d(24,16), tutor:"Claire D.", desc:"Everyday French phrases"               },
    { id:"e15", subject:"Personal", title:"Birthday Party",       start:d(25,18), end:d(25,22), tutor:null,        desc:"Miguel's birthday"                     },
    { id:"e16", subject:"Japanese", title:"Japanese Session",     start:d(26,13), end:d(26,14), tutor:"Yuki T.",   desc:"Basic greetings"                       },
    { id:"e17", subject:"Spanish",  title:"Spanish Immersion",   start:d(28,17), end:d(28,19), tutor:"Sofia L.",  desc:"Full conversation, no notes"           },
    { id:"e18", subject:"Reminder", title:"Weekly Review",        start:d(30,20), end:d(30,21), tutor:null,        desc:"Log progress, set next week goals"     },
  ];
}

const SESSIONS = {
  ES: [
    { id:"s1", type:"individual", title:"Beginner Spanish Chat",  tutor:"Maria G.",  level:"Beginner",     day:9,  time:"4:00 PM", dur:60,  spots:1, max:1,  desc:"One-on-one casual conversation for absolute beginners." },
    { id:"s2", type:"individual", title:"Grammar Office Hours",   tutor:"Carlos R.", level:"Intermediate", day:11, time:"6:00 PM", dur:60,  spots:1, max:1,  desc:"Personalised Q&A on grammar topics." },
    { id:"s4", type:"individual", title:"Advanced Conversation",  tutor:"Diego V.",  level:"Advanced",     day:16, time:"5:00 PM", dur:90,  spots:1, max:1,  desc:"In-depth discussion of culture, news, literature." },
    { id:"s8", type:"individual", title:"Business Spanish",       tutor:"Diego V.",  level:"Advanced",     day:27, time:"5:30 PM", dur:60,  spots:1, max:1,  desc:"Formal vocab, email writing, presentation phrases." },
    { id:"s3", type:"group",      title:"Pronunciation Workshop", tutor:"Sofia L.",  level:"Beginner",     day:13, time:"3:00 PM", dur:45,  spots:5, max:10, desc:"Rolling R's, vowel clarity, accent reduction." },
    { id:"s5", type:"group",      title:"Subjunctive Deep Dive",  tutor:"Carlos R.", level:"Intermediate", day:18, time:"7:00 PM", dur:60,  spots:4, max:8,  desc:"Master the subjunctive mood with practice sentences." },
    { id:"s6", type:"group",      title:"Spanish Movie Club",     tutor:"Maria G.",  level:"Intermediate", day:21, time:"6:00 PM", dur:120, spots:6, max:12, desc:"Watch & discuss a Spanish film. This week: Roma." },
    { id:"s7", type:"group",      title:"Vocabulary Blitz",       tutor:"Ana L.",    level:"Beginner",     day:23, time:"4:00 PM", dur:45,  spots:7, max:10, desc:"Top 500 Spanish words with memory techniques." },
  ],
  FR: [
    { id:"f1", type:"individual", title:"French for Beginners", tutor:"Claire D.", level:"Beginner",     day:7,  time:"3:00 PM", dur:60, spots:1, max:1,  desc:"Personalised French intro from zero." },
    { id:"f2", type:"individual", title:"1-on-1 Conversation",  tutor:"Pierre M.", level:"Intermediate", day:14, time:"5:00 PM", dur:60, spots:1, max:1,  desc:"Focused conversation practice at your pace." },
    { id:"f3", type:"group",      title:"French Pronunciation", tutor:"Claire D.", level:"Beginner",     day:20, time:"4:00 PM", dur:45, spots:6, max:10, desc:"Nasal vowels, silent letters, liaison." },
  ],
  JP: [
    { id:"j1", type:"group",      title:"Hiragana & Katakana", tutor:"Yuki T.",  level:"Beginner", day:8,  time:"2:00 PM", dur:60, spots:5, max:10, desc:"Master both syllabaries in one session." },
    { id:"j2", type:"individual", title:"JLPT N5 Prep",        tutor:"Kenji M.", level:"Beginner", day:17, time:"4:00 PM", dur:90, spots:1, max:1,  desc:"Personalised grammar and vocab for N5." },
  ],
  KO: [
    { id:"k1", type:"individual", title:"Hangul Reading",     tutor:"Jin P.", level:"Beginner",     day:10, time:"3:00 PM", dur:60, spots:1, max:1,  desc:"One-on-one Korean script coaching." },
    { id:"k2", type:"group",      title:"K-Drama Vocabulary", tutor:"Soo Y.", level:"Intermediate", day:22, time:"6:00 PM", dur:60, spots:6, max:12, desc:"Learn Korean through K-Drama clips." },
  ],
};

function toDate(v) { if (!v) return null; if (v instanceof Date) return v; return new Date(v); }
function fmt12(date) {
  const d = toDate(date); if (!d) return "";
  let h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2,"0")} ${ap}` : `${h} ${ap}`;
}
function sameDay(a,b) {
  const da=toDate(a),db=toDate(b);
  if(!da||!db) return false;
  return da.getFullYear()===db.getFullYear()&&da.getMonth()===db.getMonth()&&da.getDate()===db.getDate();
}
function sessionToEvent(sess, year, month) {
  const parts = sess.time.replace(" PM","").replace(" AM","").split(":");
  const isPM  = sess.time.includes("PM") && parseInt(parts[0])!==12;
  const h     = isPM ? parseInt(parts[0])+12 : parseInt(parts[0]);
  const start = new Date(year, month, sess.day, h, parseInt(parts[1]||0));
  const end   = new Date(start.getTime()+sess.dur*60000);
  return { ...sess, start, end };
}

function HudLabel({ children, color=MUTED }) {
  return (
    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
      letterSpacing:"0.14em", textTransform:"uppercase", color }}>
      {children}
    </span>
  );
}

function EventChip({ ev, onClick }) {
  const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
  return (
    <div onClick={e => { e.stopPropagation(); onClick(ev); }}
      className="ev-chip"
      style={{ borderLeft:`2px solid ${sc.c}`, background:`${sc.c}12`,
        padding:"1px 4px", marginBottom:1, cursor:"pointer",
        overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
        transition:"all .12s", borderRadius:"0 2px 2px 0" }}>
      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
        color:sc.c, marginRight:3 }}>{fmt12(ev.start)}</span>
      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
        color:BODY, letterSpacing:"0.02em" }}>{ev.title}</span>
    </div>
  );
}

function EventModal({ ev, onClose, onBook, onUnbook, isBooked }) {
  if (!ev) return null;
  const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
  const isSession = ev.spots !== undefined || ev._sessId !== undefined;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      backdropFilter:"blur(12px)", zIndex:999, display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div className="pop-in"
        style={{ background:CARD, border:`1px solid ${sc.c}25`, borderRadius:6,
          padding:24, width:"100%", maxWidth:400, position:"relative",
          backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ position:"absolute", top:0, left:0, width:16, height:16,
          borderTop:`1px solid ${sc.c}`, borderLeft:`1px solid ${sc.c}` }}/>
        <div style={{ position:"absolute", top:0, right:0, width:16, height:16,
          borderTop:`1px solid ${sc.c}`, borderRight:`1px solid ${sc.c}` }}/>
        <div style={{ position:"absolute", bottom:0, left:0, width:16, height:16,
          borderBottom:`1px solid ${sc.c}`, borderLeft:`1px solid ${sc.c}` }}/>
        <div style={{ position:"absolute", bottom:0, right:0, width:16, height:16,
          borderBottom:`1px solid ${sc.c}`, borderRight:`1px solid ${sc.c}` }}/>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <HudLabel color={sc.c}>{ev.subject}</HudLabel>
            <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, color:CREAM,
              letterSpacing:"0.03em", marginTop:4, lineHeight:1.2 }}>{ev.title}</h2>
          </div>
          <button onClick={onClose}
            style={{ background:"none", border:`1px solid ${BORD}`, borderRadius:3,
              width:24, height:24, cursor:"pointer", color:MUTED, fontSize:14,
              display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
          <div style={{ background:`${sc.c}08`, border:`1px solid ${BORD}`, borderRadius:4, padding:"8px 10px" }}>
            <HudLabel>Date</HudLabel>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:CREAM,
              letterSpacing:"0.02em", marginTop:3 }}>
              {ev.start.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</p>
            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
              color:BODY, marginTop:2 }}>{fmt12(ev.start)} → {fmt12(ev.end)}</p>
          </div>
          {ev.tutor && (
            <div style={{ background:`${sc.c}08`, border:`1px solid ${BORD}`, borderRadius:4, padding:"8px 10px" }}>
              <HudLabel>Tutor</HudLabel>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:CREAM,
                letterSpacing:"0.02em", marginTop:3 }}>{ev.tutor}</p>
            </div>
          )}
        </div>

        {isSession && (
          <div style={{ background:`${sc.c}08`, border:`1px solid ${BORD}`,
            borderRadius:4, padding:"8px 10px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <HudLabel>Availability</HudLabel>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                color:ev.spots<=2?A_ROSE:A_GREEN }}>{ev.spots}/{ev.max} spots</span>
            </div>
            <div style={{ height:3, borderRadius:1, background:"rgba(255,255,255,0.06)" }}>
              <div style={{ height:"100%", borderRadius:1, transition:"width .4s",
                width:`${((ev.max-ev.spots)/ev.max)*100}%`,
                background:ev.spots<=2?A_ROSE:A_GREEN }}/>
            </div>
          </div>
        )}

        {isSession && ev.level && (
          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
            <span style={{ background:LEVEL_META[ev.level]?.g, color:LEVEL_META[ev.level]?.c,
              fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:"0.1em",
              borderRadius:2, padding:"2px 8px" }}>{ev.level.toUpperCase()}</span>
            <span style={{ background:`rgba(212,168,67,0.14)`, color:BODY,
              fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:"0.1em",
              borderRadius:2, padding:"2px 8px" }}>{ev.dur}MIN</span>
          </div>
        )}

        {ev.desc && (
          <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY,
            lineHeight:1.7, fontStyle:"italic", marginBottom:14,
            borderLeft:`2px solid ${sc.c}30`, paddingLeft:10 }}>{ev.desc}</p>
        )}

        {isSession && (
          isBooked
            ? <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ background:"rgba(168,133,90,0.07)", border:`1px solid rgba(62,201,138,0.2)`,
                  borderRadius:4, padding:"8px 12px", textAlign:"center" }}>
                  <HudLabel color={A_GREEN}>BOOKED — ON YOUR CALENDAR</HudLabel>
                </div>
                <button onClick={() => { onUnbook(ev._sessId||ev.id); onClose(); }} className="book-btn"
                  style={{ width:"100%", background:"none", border:`1px solid rgba(224,88,120,0.3)`,
                    borderRadius:4, padding:"8px", fontFamily:"'Share Tech Mono',monospace",
                    fontSize:10, letterSpacing:"0.1em", color:A_ROSE, cursor:"pointer", transition:"all .2s" }}>
                  CANCEL_BOOKING
                </button>
              </div>
            : ev.spots === 0
              ? <div style={{ background:"rgba(138,100,64,0.07)", border:`1px solid rgba(224,88,120,0.2)`,
                  borderRadius:4, padding:"8px 12px", textAlign:"center" }}>
                  <HudLabel color={A_ROSE}>SESSION_FULL</HudLabel>
                </div>
              : <button onClick={() => onBook(ev)} className="book-btn"
                  style={{ width:"100%", background:sc.c, border:"none", borderRadius:4,
                    padding:"10px", fontFamily:"'Share Tech Mono',monospace",
                    fontSize:11, letterSpacing:"0.12em", color:CREAM,
                    cursor:"pointer", transition:"all .2s", fontWeight:700 }}>
                  BOOK_SESSION →
                </button>
        )}
      </div>
    </div>
  );
}

function PersonalCalendar({ year, month, allEvents, onSelectDay, selectedDay, onEventClick }) {
  const firstDow   = new Date(year, month, 1).getDay();
  const daysInMon  = new Date(year, month+1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDow + daysInMon) / 7) * 7;
  const today      = new Date();

  const cells = Array.from({ length:totalCells }, (_, i) => {
    const n = i - firstDow + 1;
    if (n < 1)         return { day:daysInPrev+n, type:"prev" };
    if (n > daysInMon) return { day:n-daysInMon,  type:"next" };
    return               { day:n,                  type:"curr" };
  });

  return (
    <div className="cal-main" style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:"14px 20px" }}>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13,
          letterSpacing:"0.14em", textTransform:"uppercase", color:MUTED }}>Legend</span>
        {Object.entries(SUBJECT_COLORS).map(([subj, sc]) => (
          <div key={subj} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:sc.c, flexShrink:0 }}/>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:15,
              letterSpacing:"0.06em", color:BODY }}>{subj}</span>
          </div>
        ))}
      </div>

      {/* DOW headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:3 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign:"center", padding:"2px 0", borderBottom:`1px solid ${BORD2}` }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12,
              letterSpacing:"0.14em", color:DIM }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="fade-in" style={{ flex:1, display:"grid",
        gridTemplateColumns:"repeat(7,1fr)",
        gridTemplateRows:`repeat(${totalCells/7},1fr)`, gap:3 }}>
        {cells.map((cell, i) => {
          const isCurr   = cell.type === "curr";
          const cellDate = isCurr ? new Date(year, month, cell.day) : null;
          const isTod    = isCurr && cellDate && sameDay(cellDate, today);
          const isSel    = isCurr && selectedDay && cellDate && sameDay(cellDate, selectedDay);
          const evs      = isCurr ? allEvents.filter(ev => sameDay(ev.start, cellDate)) : [];
          return (
            <div key={i} onClick={() => isCurr && onSelectDay(cellDate)}
              className={isCurr ? "hud-cell" : ""}
              style={{ background: isSel?"rgba(212,168,67,0.14)":isCurr?CARD:"rgba(255,255,255,0.01)",
                border:`1px solid ${isSel?"rgba(212,168,67,0.25)":isCurr?BORD2:"transparent"}`,
                borderRadius:3, padding:"8px 8px 6px",
                cursor:isCurr?"pointer":"default",
                overflow:"hidden", minHeight:90, position:"relative" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                <span style={{ fontFamily:isTod?"'Share Tech Mono',monospace":"'Oswald',sans-serif",
                  fontSize:15, color:isTod?DARK:isCurr?CREAM:DIM,
                  background:isTod?GOLD:"transparent", borderRadius:isTod?2:0,
                  padding:isTod?"0 4px":0, lineHeight:"16px" }}>
                  {cell.day}
                </span>
                {evs.length > 0 && isCurr && (
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                    color:GOLD, opacity:0.6 }}>{evs.length}</span>
                )}
              </div>
              {evs.slice(0,2).map((ev,ei) => <EventChip key={ei} ev={ev} onClick={onEventClick}/>)}
              {evs.length > 2 && (
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:7.5,
                  color:MUTED, paddingLeft:2 }}>+{evs.length-2}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaPanel({ selectedDay, allEvents, onEventClick }) {
  const dayEvs = selectedDay
    ? allEvents.filter(ev => sameDay(ev.start, selectedDay)).sort((a,b) => a.start-b.start)
    : [];
  const upcoming = allEvents
    .filter(ev => ev.start >= (selectedDay || new Date()))
    .sort((a,b) => a.start-b.start)
    .slice(0, 6);

  return (
    <div className="cal-sidebar" style={{ width:340, borderLeft:`1px solid ${BORD}`, display:"flex",
      flexDirection:"column", overflow:"hidden", flexShrink:0, background:CARD2 }}>
      <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${BORD}` }}>
        <HudLabel>Agenda</HudLabel>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:24, color:CREAM,
          letterSpacing:"0.03em", marginTop:5, lineHeight:1.2 }}>
          {selectedDay
            ? selectedDay.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})
            : "Select a day"}
        </p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
        {!selectedDay ? (
          <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:MUTED,
            fontStyle:"italic", textAlign:"center", marginTop:20, lineHeight:1.6 }}>
            Click any day<br/>to see events
          </p>
        ) : dayEvs.length === 0 ? (
          <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:MUTED,
            fontStyle:"italic", textAlign:"center", marginTop:20 }}>
            No events — enjoy the break.
          </p>
        ) : dayEvs.map((ev, i) => {
          const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
          return (
            <div key={i} onClick={() => onEventClick(ev)} className="agenda-row"
              style={{ display:"flex", gap:10, padding:"9px 10px", marginBottom:5,
                background:`${sc.c}08`, border:`1px solid ${sc.c}18`,
                borderLeft:`3px solid ${sc.c}`, borderRadius:"0 4px 4px 0",
                cursor:"pointer", transition:"all .12s" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM,
                  letterSpacing:"0.02em", overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap", lineHeight:1.3 }}>{ev.title}</p>
                <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                  color:MUTED, marginTop:3 }}>{fmt12(ev.start)} → {fmt12(ev.end)}</p>
                {ev.tutor && (
                  <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY,
                    fontStyle:"italic", marginTop:2 }}>{ev.tutor}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop:`1px solid ${BORD}`, padding:"10px 12px 14px" }}>
        <div style={{ marginBottom:9 }}><HudLabel>Upcoming</HudLabel></div>
        {upcoming.map((ev, i) => {
          const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
          return (
            <div key={i} onClick={() => onEventClick(ev)} className="agenda-row"
              style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7,
                cursor:"pointer", padding:"5px 6px", borderRadius:4, transition:"all .12s" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:sc.c, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM,
                  letterSpacing:"0.02em", overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap" }}>{ev.title}</p>
                <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:MUTED }}>
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

function SessionsView({ langCode, year, month, booked, onBook, onUnbook, onCardClick, goMonth }) {
  const lm       = LANGS.find(l => l.code === langCode) || LANGS[0];
  const sessions = SESSIONS[langCode] || [];
  const individual = sessions.filter(s => s.type === "individual");
  const group      = sessions.filter(s => s.type === "group");

  function SessCard({ sess }) {
    const lv       = LEVEL_META[sess.level] || LEVEL_META.Beginner;
    const isBooked = !!booked[sess.id];
    const isFull   = sess.spots === 0;
    const isIndiv  = sess.type === "individual";
    const sessDate = new Date(year, month, sess.day);
    const ev       = sessionToEvent(sess, year, month);
    return (
      <div className="sess-card"
        onClick={() => onCardClick({ ...sess, start:ev.start, end:ev.end, subject:lm.name })}
        style={{ background:CARD, border:`1px solid ${isBooked?"rgba(168,133,90,0.3)":BORD}`,
          borderRadius:5, padding:"10px 12px", cursor:"pointer", transition:"all .18s",
          position:"relative", overflow:"hidden",
          backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
        <div style={{ position:"absolute", top:0, left:0, width:9, height:9,
          borderTop:`1px solid ${lm.c}70`, borderLeft:`1px solid ${lm.c}70` }}/>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6, marginBottom:3 }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:15, color:CREAM,
            letterSpacing:"0.02em", lineHeight:1.2, flex:1 }}>{sess.title}</p>
          {isBooked && (
            <span style={{ background:"rgba(168,133,90,0.12)", border:`1px solid rgba(168,133,90,0.3)`,
              borderRadius:2, padding:"2px 6px", fontFamily:"'Share Tech Mono',monospace",
              fontSize:8, letterSpacing:"0.1em", color:A_GREEN, flexShrink:0, marginTop:2 }}>BOOKED</span>
          )}
        </div>
        <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY,
          fontStyle:"italic", marginBottom:7 }}>with {sess.tutor}</p>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:7 }}>
          <span style={{ background:"rgba(212,168,67,0.14)", color:BODY,
            fontFamily:"'Share Tech Mono',monospace", fontSize:9, borderRadius:2, padding:"2px 6px" }}>
            {sessDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {sess.time}
          </span>
          <span style={{ background:"rgba(212,168,67,0.14)", color:BODY,
            fontFamily:"'Share Tech Mono',monospace", fontSize:9, borderRadius:2, padding:"2px 6px" }}>
            {sess.dur}MIN
          </span>
          <span style={{ background:lv.g, color:lv.c,
            fontFamily:"'Share Tech Mono',monospace", fontSize:9, borderRadius:2, padding:"2px 6px" }}>
            {sess.level.toUpperCase()}
          </span>
        </div>
        <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY,
          lineHeight:1.5, fontStyle:"italic", marginBottom:9 }}>{sess.desc}</p>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {isIndiv ? (
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
              color:isFull?A_ROSE:A_GREEN, flex:1 }}>
              {isFull ? "FULLY BOOKED" : "1 SPOT AVAILABLE"}
            </span>
          ) : (
            <>
              <div style={{ display:"flex", gap:2, flex:1 }}>
                {Array.from({ length:Math.min(sess.max,12) }).map((_,i) => (
                  <div key={i} style={{ width:5, height:5, borderRadius:1,
                    background: i<(sess.max-sess.spots)?lm.c:"rgba(255,255,255,0.07)" }}/>
                ))}
              </div>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                color:isFull?A_ROSE:sess.spots<=2?A_AMBER:A_GREEN }}>
                {isFull?"FULL":`${sess.spots}/${sess.max}`}
              </span>
            </>
          )}
          {isBooked
            ? <button onClick={e=>{e.stopPropagation();onUnbook(sess.id);}} className="book-btn"
                style={{ background:"none", border:`1px solid ${A_ROSE}44`, borderRadius:3,
                  padding:"4px 10px", fontFamily:"'Share Tech Mono',monospace",
                  fontSize:8.5, color:A_ROSE, cursor:"pointer", transition:"all .2s", flexShrink:0 }}>
                CANCEL
              </button>
            : !isFull && (
              <button onClick={e=>{e.stopPropagation();onBook(sess);}} className="book-btn"
                style={{ background:lm.c, border:"none", borderRadius:3, padding:"4px 10px",
                  fontFamily:"'Share Tech Mono',monospace", fontSize:8.5, fontWeight:700,
                  color:CREAM, cursor:"pointer", transition:"all .2s", flexShrink:0 }}>
                BOOK →
              </button>
            )
          }
        </div>
      </div>
    );
  }

  function Column({ title, items }) {
    return (
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:12,
          paddingBottom:10, borderBottom:`2px solid ${lm.c}30` }}>
          <h3 style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:700,
            letterSpacing:"0.06em", textTransform:"uppercase", color:lm.c, lineHeight:1 }}>
            {title}
          </h3>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
            color:DIM, letterSpacing:"0.1em" }}>
            {items.length} SESSION{items.length!==1?"S":""}
          </span>
        </div>
        {items.length === 0
          ? <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:DIM,
              fontStyle:"italic", padding:"16px 0" }}>None this month.</p>
          : <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {items.map(sess => <SessCard key={sess.id} sess={sess}/>)}
            </div>
        }
      </div>
    );
  }

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 20px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ width:36, height:36, borderRadius:4, background:`${lm.c}14`,
          border:`1px solid ${lm.c}25`, display:"flex", alignItems:"center",
          justifyContent:"center", fontFamily:"Georgia,serif", fontSize:16, color:lm.c }}>
          {lm.script.slice(0,2)}
        </div>
        <div>
          <HudLabel color={lm.c}>{lm.name} · Sessions</HudLabel>
          <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, color:CREAM,
            letterSpacing:"0.03em", marginTop:2 }}>{sessions.length} Available This Month</h2>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <button onClick={() => goMonth(-1)} className="arrow-btn"
            style={{ width:24, height:24, background:CARD, border:`1px solid ${BORD}`,
              borderRadius:3, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace",
              fontSize:13, color:MUTED, display:"flex", alignItems:"center",
              justifyContent:"center", transition:"all .15s" }}>‹</button>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:CREAM,
            letterSpacing:"0.08em", minWidth:110, textAlign:"center" }}>
            {MONTHS[month].toUpperCase()} {year}
          </span>
          <button onClick={() => goMonth(1)} className="arrow-btn"
            style={{ width:24, height:24, background:CARD, border:`1px solid ${BORD}`,
              borderRadius:3, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace",
              fontSize:13, color:MUTED, display:"flex", alignItems:"center",
              justifyContent:"center", transition:"all .15s" }}>›</button>
        </div>
      </div>
      <div className="cal-sessions-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <Column title="Individual" items={individual}/>
        <Column title="Group"      items={group}/>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const today    = new Date();
  const [month,     setMonth]     = useState(today.getMonth());
  const [year,      setYear]      = useState(today.getFullYear());
  const [tab,       setTab]       = useState("personal");
  const [selDay,    setSelDay]    = useState(null);
  const [modal,     setModal]     = useState(null);
  const [bookedEvs, setBookedEvs] = useState({});

  const personalEvs = buildPersonalEvents(year, month);
  const allEvs      = [...personalEvs, ...Object.values(bookedEvs)];

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
    const langName = LANGS.find(l => (SESSIONS[l.code]||[]).some(s=>s.id===sess.id))?.name||"Spanish";
    setBookedEvs(b => ({ ...b, [sess.id]:{
      id:"booked_"+sess.id, title:sess.title, subject:langName,
      start:ev.start, end:ev.end, tutor:sess.tutor, desc:sess.desc, _sessId:sess.id,
    }}));
  }
  function unbook(sessId) {
    setBookedEvs(b => { const n={...b}; delete n[sessId]; return n; });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%",
      background:DARK, color:CREAM, fontFamily:"'Oswald',sans-serif", overflow:"hidden" }}>
      <style>{CSS}</style>

      <header style={{ borderBottom:`1px solid ${BORD}`, padding:"18px 28px",
        display:"flex", alignItems:"center", gap:10, flexShrink:0,
        flexWrap:"wrap", rowGap:10, background:CARD2 }}>
        <div style={{ marginRight:14 }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
            letterSpacing:"0.14em", textTransform:"uppercase", color:MUTED }}>
            Speaksphere / Schedule
          </span>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:34, fontWeight:700,
            color:CREAM, letterSpacing:"0.04em", lineHeight:1, marginTop:4 }}>Calendar</h1>
        </div>

        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[{id:"personal",label:"My Calendar",c:GOLD}, ...LANGS.map(l=>({id:l.code,label:l.name,c:l.c,script:l.script}))].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={tab!==t.id?"tab-btn":""}
              style={{ display:"flex", alignItems:"center", gap:7,
                background: tab===t.id?`${t.c}14`:"transparent",
                border:`1px solid ${tab===t.id?`${t.c}40`:BORD2}`,
                borderBottom: tab===t.id?`1px solid ${t.c}`:`1px solid ${BORD2}`,
                borderRadius:"4px 4px 0 0", padding:"8px 16px",
                fontFamily:"'Oswald',sans-serif", fontSize:15,
                letterSpacing:"0.08em", textTransform:"uppercase",
                color: tab===t.id?t.c:MUTED, cursor:"pointer", transition:"all .15s" }}>
              {t.script && <span style={{ fontFamily:"Georgia,serif", fontSize:14 }}>{t.script.slice(0,3)}</span>}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "personal" && (
          <div className="cal-topbar" style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
            <button onClick={() => goMonth(-1)} className="arrow-btn"
              style={{ width:32, height:32, background:"transparent", border:`1px solid ${BORD}`,
                borderRadius:4, cursor:"pointer", color:MUTED, fontSize:18,
                display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>‹</button>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, color:CREAM,
              letterSpacing:"0.06em", minWidth:160, textAlign:"center", fontWeight:600 }}>
              {MONTHS[month].toUpperCase()} {year}
            </span>
            <button onClick={() => goMonth(1)} className="arrow-btn"
              style={{ width:32, height:32, background:"transparent", border:`1px solid ${BORD}`,
                borderRadius:4, cursor:"pointer", color:MUTED, fontSize:18,
                display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>›</button>
            <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
              className="arrow-btn"
              style={{ height:32, padding:"0 14px", background:"transparent", border:`1px solid ${BORD}`,
                borderRadius:4, cursor:"pointer", fontFamily:"'Share Tech Mono',monospace",
                fontSize:12, letterSpacing:"0.12em", color:MUTED, transition:"all .15s" }}>
              TODAY
            </button>
          </div>
        )}
      </header>

      <div className="cal-layout" style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {tab === "personal" ? (
          <>
            <PersonalCalendar
              year={year} month={month} allEvents={allEvs}
              onSelectDay={setSelDay} selectedDay={selDay}
              onEventClick={setModal}/>
            <AgendaPanel selectedDay={selDay} allEvents={allEvs} onEventClick={setModal}/>
          </>
        ) : (
          <SessionsView langCode={tab} year={year} month={month}
            booked={bookedEvs} onBook={book} onUnbook={unbook}
            onCardClick={setModal} goMonth={goMonth}/>
        )}
      </div>

      <EventModal ev={modal} onClose={() => setModal(null)}
        onBook={sess => book(sess)}
        isBooked={modal ? !!bookedEvs[modal._sessId||modal.id] : false}
        onUnbook={unbook}/>
    </div>
  );
}