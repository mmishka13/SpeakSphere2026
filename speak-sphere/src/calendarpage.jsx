import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── DESIGN TOKENS (match Dashboard exactly) ────────────────────
const DARK    = "#140b04";
const CARD    = "#1a0d05";
const GOLD    = "#c9a05a";
const GOLDLT  = "#e8c07a";
const CREAM   = "#eadcca";
const MUTED   = "#9a7d5a";
const DIM     = "#5a3a22";
const BORD    = "rgba(201,160,90,0.12)";
const BODY    = "#c4aa80";

const A_GREEN  = "#3ec98a";
const A_BLUE   = "#4e9fe8";
const A_ROSE   = "#e05878";
const A_VIOLET = "#9f72e8";
const A_AMBER  = "#e8a830";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; }
  :focus-visible { outline:2px solid #c9a05a; outline-offset:3px; border-radius:4px; }
  .cal-cell:hover   { background:rgba(201,160,90,0.06) !important; border-color:rgba(201,160,90,0.22) !important; }
  .ev-pill:hover    { filter:brightness(1.2); transform:translateX(2px); }
  .agenda-item:hover{ background:rgba(201,160,90,0.06) !important; border-color:rgba(201,160,90,0.2) !important; }
  .sess-card:hover  { border-color:rgba(201,160,90,0.25) !important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.5) !important; }
  .book-btn:hover   { filter:brightness(1.12); transform:scale(1.03); }
  .gcal-btn:hover   { background:rgba(201,160,90,0.18) !important; }
  .tab-btn:hover    { background:rgba(201,160,90,0.07) !important; color:#eadcca !important; }
  .arrow-btn:hover  { background:rgba(201,160,90,0.07) !important; color:#eadcca !important; }
  .upcoming-row:hover p { color:#e8c07a !important; }
  .pop-in   { animation:popIn  .24s cubic-bezier(.34,1.3,.64,1) both; }
  .slide-in { animation:slideIn .2s ease both; }
  @keyframes popIn   { from{opacity:0;transform:scale(.94) translateY(8px)} to{opacity:1;transform:none} }
  @keyframes slideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
`;

const LANGS = [
  { code:"ES", name:"Spanish",  c:"#e07858", g:"rgba(224,120,88,0.15)",  script:"Hola"      },
  { code:"FR", name:"French",   c:"#4e9fe8", g:"rgba(78,159,232,0.15)",  script:"Bonjour"   },
  { code:"JP", name:"Japanese", c:"#e05878", g:"rgba(224,88,120,0.15)",  script:"こんにちは" },
  { code:"KO", name:"Korean",   c:"#3ec98a", g:"rgba(62,201,138,0.15)",  script:"안녕"       },
];

const SUBJECT_COLORS = {
  Spanish:  { c:"#e07858", g:"rgba(224,120,88,0.15)"  },
  French:   { c:"#4e9fe8", g:"rgba(78,159,232,0.15)"  },
  Japanese: { c:"#e05878", g:"rgba(224,88,120,0.15)"  },
  Korean:   { c:"#3ec98a", g:"rgba(62,201,138,0.15)"  },
  Personal: { c:"#9f72e8", g:"rgba(159,114,232,0.15)" },
  GCal:     { c:"#38c4c0", g:"rgba(56,196,192,0.15)"  },
  Reminder: { c:"#e8a830", g:"rgba(232,168,48,0.15)"  },
};

const LEVEL_META = {
  Beginner:     { c:A_GREEN, g:"rgba(62,201,138,0.14)"  },
  Intermediate: { c:GOLD,    g:"rgba(201,160,90,0.14)"  },
  Advanced:     { c:A_ROSE,  g:"rgba(224,88,120,0.14)"  },
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

function EventPill({ ev, onClick }) {
  const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
  return (
    <div onClick={e => { e.stopPropagation(); onClick(ev); }}
      className="ev-pill"
      style={{ background:`${sc.c}14`, borderLeft:`2px solid ${sc.c}`,
        borderRadius:"0 3px 3px 0", padding:"2px 5px", marginBottom:2,
        cursor:"pointer", overflow:"hidden", whiteSpace:"nowrap",
        textOverflow:"ellipsis", transition:"all .15s" }}>
      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:sc.c, letterSpacing:"0.04em" }}>
        {fmt12(ev.start)}{" "}
      </span>
      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:BODY, letterSpacing:"0.02em" }}>
        {ev.title}
      </span>
    </div>
  );
}

function EventModal({ ev, onClose, onBook, onUnbook, isBooked }) {
  if (!ev) return null;
  const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
  const isSession = ev.spots !== undefined || ev._sessId !== undefined;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
      backdropFilter:"blur(10px)", zIndex:999, display:"flex",
      alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div className="pop-in"
        style={{ background:CARD, border:`1px solid ${sc.c}30`, borderRadius:8,
          padding:28, width:"100%", maxWidth:420, position:"relative",
          backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,transparent,${sc.c},transparent)`,
          borderRadius:"8px 8px 0 0" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:3, height:36, borderRadius:2, background:sc.c, flexShrink:0 }}/>
            <div>
              <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:600,
                color:CREAM, letterSpacing:"0.02em", lineHeight:1.2 }}>{ev.title}</h2>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, color:sc.c,
                letterSpacing:"0.12em", textTransform:"uppercase", marginTop:3 }}>{ev.subject}</p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"none", border:`1px solid ${BORD}`, borderRadius:4,
              width:28, height:28, cursor:"pointer", fontSize:16, color:MUTED, flexShrink:0 }}>
            ×
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:`${sc.c}0a`, border:`1px solid ${BORD}`, borderRadius:5, padding:"10px 12px", flex:1 }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, color:MUTED,
                letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:5 }}>DATE & TIME</p>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:CREAM, letterSpacing:"0.02em" }}>
                {ev.start.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY, fontStyle:"italic", marginTop:3 }}>
                {fmt12(ev.start)} – {fmt12(ev.end)}</p>
            </div>
            {ev.tutor && (
              <div style={{ background:`${sc.c}0a`, border:`1px solid ${BORD}`, borderRadius:5, padding:"10px 12px", flex:1 }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, color:MUTED,
                  letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:5 }}>TUTOR</p>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
                  <div style={{ width:24, height:24, borderRadius:4, background:`${sc.c}20`,
                    border:`1px solid ${sc.c}30`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontFamily:"'Oswald',sans-serif", fontSize:9, color:sc.c }}>
                    {ev.tutor.split(" ").map(w=>w[0]).join("")}
                  </div>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:CREAM }}>{ev.tutor}</p>
                </div>
              </div>
            )}
          </div>
          {isSession && (
            <div style={{ background:`${sc.c}0a`, border:`1px solid ${BORD}`, borderRadius:5, padding:"10px 12px" }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, color:MUTED,
                letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:8 }}>AVAILABILITY</p>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ flex:1, height:4, borderRadius:99, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:99,
                    width:`${((ev.max - ev.spots) / ev.max) * 100}%`,
                    background: ev.spots <= 2 ? A_ROSE : A_GREEN }}/>
                </div>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                  color:ev.spots<=2?A_ROSE:A_GREEN, whiteSpace:"nowrap" }}>
                  {ev.spots} spot{ev.spots!==1?"s":""} left
                </span>
              </div>
            </div>
          )}
          {isSession && ev.level && (
            <div style={{ display:"flex", gap:6 }}>
              <span style={{ background:LEVEL_META[ev.level]?.g, color:LEVEL_META[ev.level]?.c,
                fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.08em",
                borderRadius:3, padding:"3px 10px" }}>{ev.level}</span>
              <span style={{ background:`rgba(201,160,90,0.08)`, color:BODY,
                fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.08em",
                borderRadius:3, padding:"3px 10px" }}>{ev.dur} min</span>
            </div>
          )}
          {ev.desc && (
            <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY,
              lineHeight:1.7, fontStyle:"italic" }}>{ev.desc}</p>
          )}
          {isSession && (
            isBooked
              ? <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ background:"rgba(62,201,138,0.08)", border:`1px solid rgba(62,201,138,0.25)`,
                    borderRadius:5, padding:"10px 16px", textAlign:"center" }}>
                    <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12,
                      letterSpacing:"0.1em", color:A_GREEN }}>BOOKED — ADDED TO CALENDAR</span>
                  </div>
                  <button onClick={() => { onUnbook(ev._sessId || ev.id); onClose(); }} className="book-btn"
                    style={{ width:"100%", background:"none", border:`1px solid rgba(224,88,120,0.4)`,
                      borderRadius:5, padding:"9px", fontFamily:"'Oswald',sans-serif",
                      fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase",
                      color:A_ROSE, cursor:"pointer", transition:"all .2s" }}>
                    Cancel Booking
                  </button>
                </div>
              : ev.spots === 0
                ? <div style={{ background:"rgba(224,88,120,0.08)", border:`1px solid rgba(224,88,120,0.25)`,
                    borderRadius:5, padding:"10px 16px", textAlign:"center" }}>
                    <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12,
                      letterSpacing:"0.1em", color:A_ROSE }}>SESSION FULL</span>
                  </div>
                : <button onClick={() => onBook(ev)} className="book-btn"
                    style={{ width:"100%", background:sc.c, border:"none", borderRadius:5,
                      padding:"11px", fontFamily:"'Oswald',sans-serif", fontSize:12,
                      letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600,
                      color:DARK, cursor:"pointer", transition:"all .2s" }}>
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
      <div style={{ display:"flex", alignItems:"center", gap:10,
        background:"rgba(62,201,138,0.07)", border:`1px solid rgba(62,201,138,0.2)`,
        borderRadius:6, padding:"10px 16px", marginBottom:14 }}>
        <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, letterSpacing:"0.1em",
          color:A_GREEN, flex:1 }}>GOOGLE CALENDAR CONNECTED · {count} EVENTS IMPORTED</span>
        <button onClick={onDisconnect}
          style={{ background:"none", border:`1px solid rgba(62,201,138,0.3)`, borderRadius:4,
            padding:"3px 10px", fontFamily:"'Oswald',sans-serif", fontSize:9,
            letterSpacing:"0.1em", color:A_GREEN, cursor:"pointer" }}>
          DISCONNECT
        </button>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, background:CARD,
      border:`1px solid ${BORD}`, borderRadius:6, padding:"12px 16px", marginBottom:14,
      backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
      <svg width={20} height={20} viewBox="0 0 24 24" style={{ flexShrink:0 }}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <div style={{ flex:1 }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:CREAM, letterSpacing:"0.04em" }}>
          Connect Google Calendar</p>
        <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY, fontStyle:"italic", marginTop:2 }}>
          Demo mode — simulates import. Add your Google Client ID to go live.</p>
      </div>
      <button onClick={onConnect} className="gcal-btn"
        style={{ background:"rgba(201,160,90,0.08)", border:`1px solid rgba(201,160,90,0.25)`,
          borderRadius:4, padding:"7px 16px", fontFamily:"'Oswald',sans-serif", fontSize:10,
          letterSpacing:"0.1em", textTransform:"uppercase", color:GOLD,
          cursor:"pointer", whiteSpace:"nowrap", transition:"all .2s" }}>
        Connect
      </button>
    </div>
  );
}

function PersonalCalendar({ year, month, allEvents, onSelectDay, selectedDay, onEventClick, gcalConn, onConnect, onDisconnect, gcalCount }) {
  const firstDow   = new Date(year, month, 1).getDay();
  const daysInMon  = new Date(year, month+1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDow + daysInMon) / 7) * 7;
  const today      = new Date();

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const n = i - firstDow + 1;
    if (n < 1)         return { day: daysInPrev + n, type:"prev" };
    if (n > daysInMon) return { day: n - daysInMon,  type:"next" };
    return               { day: n,                    type:"curr" };
  });

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:"14px 20px 14px 24px" }}>
      <GCalBanner connected={gcalConn} onConnect={onConnect} onDisconnect={onDisconnect} count={gcalCount}/>
      <div style={{ display:"flex", gap:14, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.18em",
          textTransform:"uppercase", color:MUTED }}>Legend</span>
        {Object.entries(SUBJECT_COLORS).map(([subj, sc]) => {
          if (subj === "GCal" && !gcalConn) return null;
          return (
            <div key={subj} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:sc.c }}/>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.06em", color:BODY }}>
                {subj}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign:"center", fontFamily:"'Oswald',sans-serif",
            fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", color:MUTED, padding:"4px 0" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="slide-in" style={{ flex:1, display:"grid",
        gridTemplateColumns:"repeat(7,1fr)", gridTemplateRows:`repeat(${totalCells/7},1fr)`, gap:3 }}>
        {cells.map((cell, i) => {
          const isCurr   = cell.type === "curr";
          const cellDate = isCurr ? new Date(year, month, cell.day) : null;
          const isTod    = isCurr && cellDate && sameDay(cellDate, today);
          const isSel    = isCurr && selectedDay && cellDate && sameDay(cellDate, selectedDay);
          const evs      = isCurr ? allEvents.filter(ev => sameDay(ev.start, cellDate)) : [];
          return (
            <div key={i}
              onClick={() => isCurr && onSelectDay(cellDate)}
              className={isCurr ? "cal-cell" : ""}
              style={{
                background: isSel ? "rgba(201,160,90,0.1)" : isCurr ? CARD : "rgba(255,255,255,0.01)",
                border:`1px solid ${isSel ? "rgba(201,160,90,0.3)" : isCurr ? BORD : "transparent"}`,
                borderRadius:5, padding:"5px 5px 4px",
                cursor: isCurr ? "pointer" : "default",
                transition:"all .15s", overflow:"hidden", minHeight:0,
                backgroundImage: isCurr ? GRAIN : "none",
                backgroundRepeat:"repeat", backgroundSize:"300px",
              }}>
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:2 }}>
                <span style={{
                  fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.02em",
                  color: isTod ? DARK : isCurr ? CREAM : DIM,
                  background: isTod ? GOLD : "transparent",
                  borderRadius:"50%", width:18, height:18,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {cell.day}
                </span>
              </div>
              {evs.slice(0,3).map((ev,ei) => <EventPill key={ei} ev={ev} onClick={onEventClick}/>)}
              {evs.length > 3 && (
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
                  color:MUTED, letterSpacing:"0.06em", paddingLeft:3 }}>+{evs.length-3} more</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaSidebar({ selectedDay, allEvents, onEventClick }) {
  const dayEvs = selectedDay
    ? allEvents.filter(ev => sameDay(ev.start, selectedDay)).sort((a,b) => a.start - b.start)
    : [];
  const upcoming = allEvents
    .filter(ev => ev.start >= (selectedDay || new Date()))
    .sort((a,b) => a.start - b.start)
    .slice(0, 5);

  return (
    <div style={{ width:272, borderLeft:`1px solid ${BORD}`, display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
      <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${BORD}` }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.18em",
          textTransform:"uppercase", color:MUTED, marginBottom:5 }}>Agenda</p>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, color:CREAM, letterSpacing:"0.02em" }}>
          {selectedDay
            ? selectedDay.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})
            : "Select a day"}
        </p>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 14px" }}>
        {!selectedDay ? (
          <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:MUTED,
            fontStyle:"italic", textAlign:"center", marginTop:28 }}>
            Click any day to see its events
          </p>
        ) : dayEvs.length === 0 ? (
          <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:MUTED,
            fontStyle:"italic", textAlign:"center", marginTop:28 }}>
            No events — enjoy the break!
          </p>
        ) : dayEvs.map((ev, i) => {
          const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
          return (
            <div key={i} onClick={() => onEventClick(ev)} className="agenda-item"
              style={{ display:"flex", gap:10, padding:"10px 11px", marginBottom:7,
                background:CARD, border:`1px solid ${BORD}`, borderLeft:`3px solid ${sc.c}`,
                borderRadius:5, cursor:"pointer", transition:"all .15s",
                backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM,
                  letterSpacing:"0.02em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {ev.title}</p>
                <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY, fontStyle:"italic", marginTop:3 }}>
                  {fmt12(ev.start)} – {fmt12(ev.end)}</p>
                {ev.tutor && (
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:10,
                    color:MUTED, letterSpacing:"0.06em", marginTop:2 }}>{ev.tutor}</p>
                )}
              </div>
              <div style={{ width:6, height:6, borderRadius:"50%", background:sc.c, marginTop:6, flexShrink:0 }}/>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop:`1px solid ${BORD}`, padding:"12px 14px 16px" }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.18em",
          textTransform:"uppercase", color:MUTED, marginBottom:10 }}>Upcoming</p>
        {upcoming.map((ev, i) => {
          const sc = SUBJECT_COLORS[ev.subject] || SUBJECT_COLORS.Personal;
          return (
            <div key={i} onClick={() => onEventClick(ev)} className="upcoming-row"
              style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:sc.c, flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:CREAM,
                  letterSpacing:"0.02em", overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap", transition:"color .15s" }}>{ev.title}</p>
                <p style={{ fontFamily:"'Lora',serif", fontSize:10, color:BODY, fontStyle:"italic" }}>
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
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"20px 28px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22, flexWrap:"wrap" }}>
        <div style={{ width:48, height:48, borderRadius:6, background:`${lm.c}14`,
          border:`1px solid ${lm.c}30`, display:"flex", alignItems:"center",
          justifyContent:"center", fontFamily:"Georgia,serif", fontSize:20, color:lm.c }}>
          {lm.script.slice(0,2)}
        </div>
        <div>
          <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, color:CREAM, letterSpacing:"0.03em" }}>
            {lm.name} Sessions</h2>
          <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY, fontStyle:"italic", marginTop:3 }}>
            {sessions.length} sessions available · Browse and book below</p>
        </div>
        <div style={{ marginLeft:"auto", background:CARD, border:`1px solid ${BORD}`,
          borderRadius:5, padding:"8px 14px",
          backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
          <span style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY, fontStyle:"italic" }}>To host a session → </span>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:GOLD, letterSpacing:"0.06em" }}>
            Dashboard → Tutor tab</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <button onClick={() => goMonth(-1)} className="arrow-btn"
          style={{ width:30, height:30, background:CARD, border:`1px solid ${BORD}`,
            borderRadius:4, cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:16,
            color:MUTED, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>‹</button>
        <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM, letterSpacing:"0.06em" }}>
          {MONTHS[month]} {year}</span>
        <button onClick={() => goMonth(1)} className="arrow-btn"
          style={{ width:30, height:30, background:CARD, border:`1px solid ${BORD}`,
            borderRadius:4, cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:16,
            color:MUTED, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>›</button>
      </div>
      {sessions.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0" }}>
          <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:MUTED, fontStyle:"italic" }}>
            No sessions scheduled this month.</p>
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
                style={{ background:CARD, border:`1px solid ${isBooked ? "rgba(62,201,138,0.3)" : BORD}`,
                  borderRadius:6, padding:"18px 20px", cursor:"pointer", transition:"all .2s",
                  position:"relative", overflow:"hidden",
                  backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                  background:`linear-gradient(90deg,transparent,${lm.c}55,transparent)` }}/>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
                  <div style={{ width:40, height:40, borderRadius:5, background:`${lm.c}14`,
                    border:`1px solid ${lm.c}25`, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0, fontFamily:"Georgia,serif", fontSize:16, color:lm.c }}>
                    {lm.script.slice(0,2)}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:15, color:CREAM,
                      letterSpacing:"0.02em", lineHeight:1.25, marginBottom:4 }}>{sess.title}</p>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY, fontStyle:"italic" }}>
                      with {sess.tutor}</p>
                  </div>
                  {isBooked && (
                    <span style={{ background:"rgba(62,201,138,0.1)", border:`1px solid rgba(62,201,138,0.25)`,
                      borderRadius:3, padding:"3px 9px", fontFamily:"'Oswald',sans-serif",
                      fontSize:9, letterSpacing:"0.1em", color:A_GREEN }}>BOOKED</span>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                  <span style={{ background:"rgba(201,160,90,0.08)", color:BODY, fontFamily:"'Oswald',sans-serif",
                    fontSize:9, letterSpacing:"0.08em", borderRadius:3, padding:"3px 9px" }}>
                    {sessDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})} · {sess.time}
                  </span>
                  <span style={{ background:"rgba(201,160,90,0.08)", color:BODY, fontFamily:"'Oswald',sans-serif",
                    fontSize:9, letterSpacing:"0.08em", borderRadius:3, padding:"3px 9px" }}>
                    {sess.dur} min
                  </span>
                  <span style={{ background:lv.g, color:lv.c, fontFamily:"'Oswald',sans-serif",
                    fontSize:9, letterSpacing:"0.08em", borderRadius:3, padding:"3px 9px" }}>
                    {sess.level}
                  </span>
                </div>
                <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY,
                  lineHeight:1.6, fontStyle:"italic", marginBottom:14 }}>{sess.desc}</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ display:"flex", gap:3, flex:1 }}>
                    {Array.from({ length: sess.max }).map((_,i) => (
                      <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                        background: i < (sess.max - sess.spots) ? lm.c : "rgba(255,255,255,0.07)" }}/>
                    ))}
                  </div>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.06em",
                    color: isFull ? A_ROSE : sess.spots <= 2 ? A_AMBER : A_GREEN }}>
                    {isFull ? "FULL" : `${sess.spots} spot${sess.spots!==1?"s":""} left`}
                  </span>
                  {isBooked
                    ? <button onClick={e => { e.stopPropagation(); onUnbook(sess.id); }} className="book-btn"
                        style={{ background:"none", border:`1px solid rgba(224,88,120,0.35)`, borderRadius:4,
                          padding:"5px 12px", fontFamily:"'Oswald',sans-serif", fontSize:10,
                          letterSpacing:"0.08em", color:A_ROSE, cursor:"pointer", transition:"all .2s", flexShrink:0 }}>
                        Cancel
                      </button>
                    : !isFull && (
                      <button onClick={e => { e.stopPropagation(); onBook(sess); }} className="book-btn"
                        style={{ background:lm.c, border:"none", borderRadius:4, padding:"5px 12px",
                          fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.08em",
                          fontWeight:600, color:DARK, cursor:"pointer", transition:"all .2s", flexShrink:0 }}>
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

export default function CalendarPage() {
  const navigate = useNavigate();
  const today    = new Date();
  const [month,     setMonth]     = useState(today.getMonth());
  const [year,      setYear]      = useState(today.getFullYear());
  const [tab,       setTab]       = useState("personal");
  const [selDay,    setSelDay]    = useState(null);
  const [modal,     setModal]     = useState(null);
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
    setBookedEvs(b => ({ ...b, [sess.id]: {
      id:"booked_"+sess.id, title:sess.title, subject:langName,
      start:ev.start, end:ev.end, tutor:sess.tutor, desc:sess.desc, _sessId:sess.id,
    }}));
  }

  function unbook(sessId) {
    setBookedEvs(b => { const n={...b}; delete n[sessId]; return n; });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh",
      background:DARK, color:CREAM, fontFamily:"'Oswald',sans-serif",
      overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* ── TOP BAR: view tabs + month nav ── */}
      <header style={{ background:`${DARK}f0`, backdropFilter:"blur(18px)",
        borderBottom:`1px solid ${BORD}`, padding:"12px 20px",
        display:"flex", alignItems:"center", gap:8, flexShrink:0, flexWrap:"wrap", rowGap:8 }}>

        {/* Page title */}
        <div style={{ marginRight:12 }}>
          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.18em",
            textTransform:"uppercase", color:MUTED, marginBottom:2 }}>SPEAKSPHERE</p>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:600,
            color:CREAM, letterSpacing:"0.03em", lineHeight:1 }}>Schedule</h1>
        </div>

        {/* View tabs */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={() => setTab("personal")} className={tab!=="personal" ? "tab-btn" : ""}
            style={{ display:"flex", alignItems:"center", gap:6,
              background: tab==="personal" ? "rgba(201,160,90,0.12)" : CARD,
              border:`1px solid ${tab==="personal" ? "rgba(201,160,90,0.3)" : BORD}`,
              borderLeft: tab==="personal" ? `2px solid ${GOLD}` : `2px solid transparent`,
              borderRadius:4, padding:"7px 14px", fontFamily:"'Oswald',sans-serif",
              fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase",
              color: tab==="personal" ? GOLDLT : MUTED, cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap" }}>
            My Calendar
          </button>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setTab(l.code)}
              className={tab!==l.code ? "tab-btn" : ""}
              style={{ display:"flex", alignItems:"center", gap:6,
                background: tab===l.code ? `${l.c}14` : CARD,
                border:`1px solid ${tab===l.code ? `${l.c}40` : BORD}`,
                borderLeft: tab===l.code ? `2px solid ${l.c}` : `2px solid transparent`,
                borderRadius:4, padding:"7px 14px", fontFamily:"'Oswald',sans-serif",
                fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase",
                color: tab===l.code ? l.c : MUTED, cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap" }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:12 }}>{l.script.slice(0,3)}</span>
              {" "}{l.name}
            </button>
          ))}
        </div>

        {/* Month nav */}
        {tab === "personal" && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
            <button onClick={() => goMonth(-1)} className="arrow-btn"
              style={{ width:30, height:30, background:CARD, border:`1px solid ${BORD}`,
                borderRadius:4, cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:16,
                color:MUTED, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>‹</button>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, color:CREAM,
              letterSpacing:"0.06em", minWidth:130, textAlign:"center" }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={() => goMonth(1)} className="arrow-btn"
              style={{ width:30, height:30, background:CARD, border:`1px solid ${BORD}`,
                borderRadius:4, cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:16,
                color:MUTED, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>›</button>
            <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
              className="arrow-btn"
              style={{ height:30, padding:"0 14px", background:CARD, border:`1px solid ${BORD}`,
                borderRadius:4, cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:10,
                letterSpacing:"0.1em", textTransform:"uppercase", color:MUTED, transition:"all .15s" }}>
              Today
            </button>
          </div>
        )}
      </header>

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
            <AgendaSidebar selectedDay={selDay} allEvents={allEvs} onEventClick={setModal}/>
          </>
        ) : (
          <SessionsView langCode={tab} year={year} month={month}
            booked={bookedEvs} onBook={book} onUnbook={unbook}
            onCardClick={setModal} goMonth={goMonth}/>
        )}
      </div>

      <EventModal
        ev={modal} onClose={() => setModal(null)}
        onBook={sess => { book(sess); }}
        isBooked={modal ? !!bookedEvs[modal._sessId||modal.id] : false}
        onUnbook={unbook}
      />
    </div>
  );
}