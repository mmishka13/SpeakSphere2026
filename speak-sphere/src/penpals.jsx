import { useState, useRef, useEffect } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const DARK   = "#0d0702";
const CARD   = "#1b0f06";
const CARD2  = "#200f06";
const GOLD   = "#d4a843";
const GOLDLT = "#f0cc55";
const CREAM  = "#f5ede0";
const MUTED  = "#c8aa80";
const DIM    = "#a08050";
const BORD   = "rgba(212,168,67,0.20)";
const BORD2  = "rgba(212,168,67,0.10)";
const BODY   = "#c8aa80";
const A_GREEN  = "#7db87d";
const A_BLUE   = "#6a9ec0";
const A_ROSE   = "#c07070";
const A_AMBER  = "#d4a96a";
const PAPER  = "#1e1208";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(212,168,67,0.18); border-radius:2px; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideR    { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:none} }
  @keyframes popIn     { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
  @keyframes letterDrop{ from{opacity:0;transform:translateY(-6px) rotate(-0.5deg)} to{opacity:1;transform:translateY(0) rotate(0)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes shimmer   { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }

  .pal-card        { transition: border-color .2s, transform .2s, box-shadow .2s; }
  .pal-card:hover  { border-color:rgba(212,168,67,0.3) !important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.5) !important; }
  .pal-row:hover   { background:rgba(212,168,67,0.10) !important; }
  .send-btn:hover  { filter:brightness(1.1); transform:translateY(-1px); }
  .tag-chip        { transition: all .14s; }
  .tag-chip:hover  { opacity:0.8; }
  .view-btn:hover  { border-color:rgba(212,168,67,0.4) !important; color:#f5ede0 !important; }
  .correction-tip  { transition: max-height .3s ease, opacity .3s ease; }

  @media(max-width:767px){
    .pp-layout { flex-direction:column !important; }
    .pp-leftsidebar { width:100% !important; max-height:120px !important; overflow-y:auto !important; border-right:none !important; border-bottom:1px solid rgba(212,168,67,0.20) !important; }
    .pp-main { min-width:0 !important; overflow-x:hidden !important; }
    .pp-discover-grid { grid-template-columns:1fr !important; }
    .pp-topbar { flex-wrap:wrap !important; padding:12px 14px !important; gap:8px !important; }
  }
  @media(min-width:768px) and (max-width:1023px){
    .pp-leftsidebar { width:180px !important; }
    .pp-discover-grid { grid-template-columns:repeat(auto-fill,minmax(260px,1fr)) !important; }
  }
`;

/* ─── LANGUAGE META ─────────────────────────────────────────── */
const LANG_META = {
  ES: { name:"Spanish",  c:"#e07858", flag:"🇪🇸" },
  FR: { name:"French",   c:"#6a9ec0", flag:"🇫🇷" },
  JP: { name:"Japanese", c:"#c07070", flag:"🇯🇵" },
  KO: { name:"Korean",   c:"#7db87d", flag:"🇰🇷" },
  EN: { name:"English",  c:GOLD,      flag:"🇬🇧" },
  ZH: { name:"Chinese",  c:"#c4a87d", flag:"🇨🇳" },
  DE: { name:"German",   c:"#9ab87d", flag:"🇩🇪" },
};

/* ─── FAKE CORRECTIONS ──────────────────────────────────────── */
const CORRECTIONS = {
  ES: [
    { original:"estoy muy feliz", suggestion:"estoy muy contento/a", note:"'Feliz' works too, but 'contento/a' is more natural in casual speech." },
    { original:"yo quiero", suggestion:"quiero", note:"In Spanish the subject pronoun is usually dropped — the verb ending says it all." },
    { original:"muchas gracias por tu mensaje", suggestion:"muchas gracias por tu mensaje", note:"Perfect! Natural and warm." },
  ],
  FR: [
    { original:"je suis très content", suggestion:"je suis ravi(e)", note:"'Ravi' sounds more natural and expressive in written French." },
    { original:"comment tu t'appelles", suggestion:"comment vous appelez-vous", note:"Use 'vous' in formal or first correspondence — switch to 'tu' once they do." },
  ],
  JP: [
    { original:"私は日本語を勉強します", suggestion:"日本語を勉強しています", note:"Use ～ています for ongoing actions — you're currently studying, not starting to study." },
  ],
  KO: [
    { original:"안녕하세요", suggestion:"안녕하세요!", note:"Perfect greeting — formal and warm." },
  ],
};

function getFakeCorrection(lang) {
  const list = CORRECTIONS[lang] || CORRECTIONS.ES;
  return list[Math.floor(Math.random() * list.length)];
}

/* ─── PEN PAL PROFILES ──────────────────────────────────────── */
const PROFILES = [
  {
    id:1, name:"Valentina Cruz", initials:"VC", color:"#e07858",
    country:"Mexico City, MX", flag:"🇲🇽",
    native:"ES", learning:"EN", level:"Intermediate",
    age:19, gender:"she/her",
    bio:"Architecture student obsessed with brutalist buildings, lo-fi music, and making the perfect tamales. Looking for an English pen pal to swap culture and correct each other's writing!",
    interests:["Architecture","Music","Cooking","Photography","Travel"],
    matchPct:94, replies:"Usually replies in 1–2 days", letters:12,
    online:true,
    thread:[
      { from:"them", text:"¡Hola Mishka! Me llamo Valentina. Estoy muy feliz de conocerte — I hope my English is okay! I am studying architecture here in Mexico City. What do you study?", lang:"ES", time:"2 days ago" },
      { from:"me",   text:"Hola Valentina! Your English is great. I study languages and computer science. I love that you're into architecture — have you visited any famous buildings in Mexico City?", lang:"EN", time:"2 days ago", correction:{ original:"I study languages and computer science", suggestion:"I'm studying languages and computer science", note:"Use present continuous for ongoing activities like studies." } },
      { from:"them", text:"Sí! El Palacio de Bellas Artes is incredible — the Art Nouveau facade takes my breath away every time. You should visit someday! ¿Estudias español hace mucho tiempo?", lang:"ES", time:"1 day ago" },
    ],
  },
  {
    id:2, name:"Haruto Nakamura", initials:"HN", color:"#c07070",
    country:"Osaka, JP", flag:"🇯🇵",
    native:"JP", learning:"EN", level:"Beginner",
    age:22, gender:"he/him",
    bio:"Software engineer by day, jazz pianist by night. I want to improve my English to collaborate with international open-source projects. I can teach you Japanese in exchange — deal?",
    interests:["Jazz","Programming","Anime","Cycling","Coffee"],
    matchPct:88, replies:"Very active — replies daily", letters:0,
    online:false,
    thread:[],
  },
  {
    id:3, name:"Léa Fontaine", initials:"LF", color:"#6a9ec0",
    country:"Lyon, FR", flag:"🇫🇷",
    native:"FR", learning:"ES", level:"Intermediate",
    age:20, gender:"she/her",
    bio:"Literature student and amateur filmmaker. I write short stories in French and I'm trying to do the same in Spanish. I want a pen pal who'll gently tear apart my Spanish writing.",
    interests:["Literature","Film","Writing","Café culture","Poetry"],
    matchPct:91, replies:"Replies within a few hours", letters:5,
    online:true,
    thread:[
      { from:"them", text:"Bonjour Mishka! Je suis vraiment contente de te rencontrer. My Spanish is a disaster but I'm trying my best — would you be willing to correct me? Je peux faire pareil pour toi en français!", lang:"FR", time:"5 days ago" },
      { from:"me",   text:"Bonjour Léa! Bien sûr, I'd love to help with your Spanish. And yes please correct my French too! What are you writing about right now?", lang:"FR", time:"4 days ago" },
    ],
  },
  {
    id:4, name:"Min-jun Oh", initials:"MO", color:"#7db87d",
    country:"Seoul, KR", flag:"🇰🇷",
    native:"KO", learning:"ES", level:"Beginner",
    age:24, gender:"he/him",
    bio:"Graphic designer who got obsessed with Latin music and decided to learn Spanish. I watch telenovelas with subtitles and pretend that counts as studying. Looking for someone patient!",
    interests:["Design","K-pop","Latin music","Telenovelas","Skateboarding"],
    matchPct:82, replies:"Replies every few days", letters:0,
    online:true,
    thread:[],
  },
  {
    id:5, name:"Amara Diallo", initials:"AD", color:"#d4a96a",
    country:"Paris, FR", flag:"🇫🇷",
    native:"FR", learning:"JP", level:"Beginner",
    age:21, gender:"she/her",
    bio:"Medical student with a deep love for Japanese culture, Studio Ghibli, and ramen. Learning Japanese feels impossible but I won't give up. Would love a patient JP-native pen pal!",
    interests:["Medicine","Studio Ghibli","Ramen","Dance","Reading"],
    matchPct:78, replies:"Replies a few times a week", letters:0,
    online:false,
    thread:[],
  },
  {
    id:6, name:"Santiago Reyes", initials:"SR", color:"#e07858",
    country:"Buenos Aires, AR", flag:"🇦🇷",
    native:"ES", learning:"EN", level:"Advanced",
    age:26, gender:"he/him",
    bio:"Journalist and aspiring novelist. I write in Rioplatense Spanish — the voseo will confuse you and I apologise in advance. Looking for a native English speaker to help polish my prose.",
    interests:["Journalism","Football","Tango","Literature","Mate"],
    matchPct:86, replies:"Usually replies same day", letters:3,
    online:false,
    thread:[
      { from:"them", text:"Hola! Soy Santiago, periodista de Buenos Aires. Vos hablás español, ¿verdad? I know the voseo is unusual but I promise it becomes natural. What brings you to language learning?", lang:"ES", time:"1 week ago" },
    ],
  },
];

/* ─── HELPERS ───────────────────────────────────────────────── */
function matchColor(pct) {
  if (pct >= 90) return A_GREEN;
  if (pct >= 80) return A_AMBER;
  return MUTED;
}

/* ─── AVATAR ────────────────────────────────────────────────── */
function Avatar({ initials, color, size=38, online=false }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:6,
        background:`${color}20`, border:`1px solid ${color}55`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Oswald',sans-serif", fontSize:size*0.3,
        fontWeight:700, color, letterSpacing:"0.04em" }}>
        {initials}
      </div>
      {online && (
        <div style={{ position:"absolute", bottom:-1, right:-1,
          width:9, height:9, borderRadius:"50%",
          background:A_GREEN, border:`2px solid ${DARK}` }}/>
      )}
    </div>
  );
}

/* ─── INTEREST TAG ──────────────────────────────────────────── */
function Tag({ label, color=DIM }) {
  return (
    <span className="tag-chip" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
      letterSpacing:"0.1em", textTransform:"uppercase",
      color, border:`1px solid ${color}50`, borderRadius:2,
      padding:"3px 9px", background:`${color}10` }}>
      {label}
    </span>
  );
}

/* ─── MATCH RING ────────────────────────────────────────────── */
function MatchRing({ pct, color }) {
  const size=54, stroke=5, r=(size-stroke)/2;
  const circ = 2*Math.PI*r;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - circ*pct/100}
          style={{ transition:"stroke-dashoffset 1s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
          fontWeight:700, color, lineHeight:1 }}>{pct}</span>
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
          color:MUTED, letterSpacing:"0.06em" }}>%</span>
      </div>
    </div>
  );
}

/* ─── LETTER BUBBLE ─────────────────────────────────────────── */
function LetterBubble({ msg, palColor, showCorrection }) {
  const [corrOpen, setCorrOpen] = useState(false);
  const isMe = msg.from === "me";
  return (
    <div style={{ display:"flex", flexDirection:"column",
      alignItems: isMe ? "flex-end" : "flex-start",
      marginBottom:16, animation:"letterDrop .3s ease both" }}>

      <div style={{ maxWidth:"78%",
        background: isMe ? `${GOLD}12` : `${palColor}0f`,
        border:`1px solid ${isMe ? GOLD+"30" : palColor+"28"}`,
        borderRadius: isMe ? "8px 2px 8px 8px" : "2px 8px 8px 8px",
        padding:"13px 16px",
        backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
        position:"relative" }}>

        {/* Wax-seal corner accent */}
        <div style={{ position:"absolute", top:0, [isMe?"right":"left"]:0,
          width:8, height:8,
          borderTop:`1px solid ${isMe?GOLD:palColor}50`,
          [isMe?"borderRight":"borderLeft"]:`1px solid ${isMe?GOLD:palColor}50` }}/>

        <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:BODY,
          lineHeight:1.8, fontStyle:"italic" }}>{msg.text}</p>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8,
          justifyContent: isMe ? "flex-end" : "flex-start" }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
            color:DIM, letterSpacing:"0.06em" }}>
            {LANG_META[msg.lang]?.name || msg.lang} · {msg.time}
          </span>
          {isMe && msg.correction && (
            <button onClick={() => setCorrOpen(o=>!o)}
              style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                letterSpacing:"0.08em", color: corrOpen ? A_AMBER : MUTED,
                background:"transparent", border:`1px solid ${corrOpen ? A_AMBER+"50" : BORD2}`,
                borderRadius:2, padding:"2px 8px", cursor:"pointer",
                transition:"all .15s" }}>
              {corrOpen ? "hide tip" : "✦ tip"}
            </button>
          )}
        </div>
      </div>

      {/* Correction hint */}
      {isMe && msg.correction && corrOpen && (
        <div style={{ maxWidth:"78%", marginTop:6,
          background:`${A_AMBER}0c`, border:`1px solid ${A_AMBER}35`,
          borderLeft:`2px solid ${A_AMBER}`, borderRadius:"0 4px 4px 0",
          padding:"10px 14px", animation:"fadeIn .2s ease both" }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
              stroke={A_AMBER} strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, marginTop:2 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <div>
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                color:A_AMBER, letterSpacing:"0.1em", marginBottom:4 }}>WRITING TIP</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:BODY,
                lineHeight:1.6, fontStyle:"italic" }}>
                "{msg.correction.original}" →{" "}
                <span style={{ color:A_GREEN }}>"{msg.correction.suggestion}"</span>
              </p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:MUTED,
                lineHeight:1.5, marginTop:4 }}>{msg.correction.note}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════════════════════════ */
export default function PenPalsPage() {
  const [view,        setView]        = useState("discover"); // discover | thread
  const [selected,    setSelected]    = useState(null);       // profile id
  const [profiles,    setProfiles]    = useState(PROFILES);
  const [letterText,  setLetterText]  = useState("");
  const [writeLang,   setWriteLang]   = useState("ES");
  const [filter,      setFilter]      = useState("ALL");
  const [sending,     setSending]     = useState(false);
  const [sentFlash,   setSentFlash]   = useState(false);
  const threadRef = useRef(null);

  const activePals = profiles.filter(p => p.thread.length > 0);
  const selectedPal = profiles.find(p => p.id === selected);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [selected, profiles]);

  function openThread(id) {
    setSelected(id);
    setView("thread");
  }

  function sendLetter() {
    if (!letterText.trim() || !selectedPal) return;
    setSending(true);
    const correction = getFakeCorrection(writeLang);
    setTimeout(() => {
      setProfiles(ps => ps.map(p =>
        p.id === selected ? {
          ...p,
          thread: [...p.thread, {
            from:"me", text:letterText, lang:writeLang,
            time:"just now", correction,
          }],
          letters: p.letters + 1,
        } : p
      ));
      setLetterText(""); setSending(false);
      setSentFlash(true); setTimeout(() => setSentFlash(false), 2000);

      // Fake reply after 3s
      setTimeout(() => {
        const replies = {
          1: "¡Qué bonito mensaje! Me alegra mucho recibir tu carta. Sigo practicando mi inglés — ¿puedes corregirme si cometo errores? 😊",
          2: "Thank you for writing! My English is not perfect but I try hard. Nice to meet you, Mishka!",
          3: "Oh comme c'est gentil! Tu écris très bien, je suis impressionnée. Voici ma réponse en espagnol — sois gentille avec moi!",
          4: "안녕하세요 Mishka! 스페인어 연습 중이에요. Estoy practicando español — ¿está bien?",
          5: "Bonjour! Merci pour ta lettre, elle m'a fait sourire. Le japonais est si difficile mais je continue!",
          6: "¡Che, qué buena onda! Me alegró leer tu mensaje. ¿Vos también estás aprendiendo sobre el Río de la Plata?",
        };
        setProfiles(ps => ps.map(p =>
          p.id === selected ? {
            ...p,
            thread: [...p.thread, {
              from:"them",
              text: replies[selected] || "Thank you for your letter! I really enjoyed reading it.",
              lang: p.native, time:"just now",
            }],
          } : p
        ));
      }, 3200);
    }, 800);
  }

  const displayProfiles = filter === "ALL"
    ? profiles
    : profiles.filter(p => p.native === filter || p.learning === filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh",
      background:DARK, color:CREAM, overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* ══ TOPBAR ══ */}
      <header className="pp-topbar" style={{ borderBottom:`1px solid ${BORD}`, padding:"13px 24px",
        background:CARD2, flexShrink:0, display:"flex", alignItems:"center", gap:16 }}>
        <div>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
            letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase" }}>
            Speaksphere / Pen Pals
          </span>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:34, fontWeight:700,
            color:CREAM, letterSpacing:"0.04em", lineHeight:1, marginTop:2 }}>
            Pen Pals
          </h1>
        </div>

        {/* View toggle */}
        <div style={{ marginLeft:24, display:"flex", gap:0, border:`1px solid ${BORD}`,
          borderRadius:4, overflow:"hidden" }}>
          {[["discover","Discover"],["thread","Correspondence"]].map(([v,label]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding:"7px 18px", border:"none", cursor:"pointer",
                background: view===v ? `rgba(212,168,67,0.20)` : "transparent",
                borderRight: v==="discover" ? `1px solid ${BORD}` : "none",
                fontFamily:"'Oswald',sans-serif", fontSize:13,
                letterSpacing:"0.08em", textTransform:"uppercase",
                color: view===v ? GOLD : MUTED, transition:"all .15s" }}>
              {label}
              {v==="thread" && activePals.length > 0 && (
                <span style={{ marginLeft:6, background:GOLD, color:DARK,
                  borderRadius:"50%", width:17, height:17, fontSize:10,
                  fontFamily:"'Share Tech Mono',monospace",
                  display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  {activePals.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Language filter (discover view) */}
        {view === "discover" && (
          <div style={{ display:"flex", gap:4 }}>
            {["ALL","ES","FR","JP","KO"].map(f => {
              const lm = LANG_META[f];
              return (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding:"6px 14px", borderRadius:3,
                    border:`1px solid ${filter===f ? (lm?.c || GOLD)+"55" : BORD2}`,
                    background: filter===f ? `${lm?.c || GOLD}15` : "transparent",
                    fontFamily:"'Oswald',sans-serif", fontSize:12,
                    letterSpacing:"0.08em", textTransform:"uppercase",
                    color: filter===f ? (lm?.c || GOLD) : MUTED,
                    cursor:"pointer", transition:"all .15s" }}>
                  {f}
                </button>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div style={{ marginLeft:"auto", display:"flex", gap:20 }}>
          {[["Active Pals", activePals.length],["Letters Sent", profiles.reduce((a,p)=>a+p.letters,0)]].map(([l,v]) => (
            <div key={l} style={{ textAlign:"right" }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:22,
                fontWeight:700, color:GOLD, lineHeight:1 }}>{v}</p>
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                color:MUTED, letterSpacing:"0.1em", textTransform:"uppercase" }}>{l}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="pp-layout" style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── LEFT SIDEBAR: active pals ── */}
        <div className="pp-leftsidebar" style={{ width:220, borderRight:`1px solid ${BORD}`, background:CARD2,
          display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

          <div style={{ padding:"12px 14px 8px", borderBottom:`1px solid ${BORD}` }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
              letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase" }}>
              Active Correspondence
            </span>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
            {activePals.length === 0 ? (
              <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:DIM,
                fontStyle:"italic", padding:"16px 14px", lineHeight:1.6 }}>
                Send your first letter to start a correspondence.
              </p>
            ) : activePals.map(p => {
              const lastMsg = p.thread[p.thread.length-1];
              const isActive = selected === p.id && view === "thread";
              return (
                <div key={p.id} className="pal-row"
                  onClick={() => openThread(p.id)}
                  style={{ padding:"10px 14px", cursor:"pointer",
                    borderLeft:`2px solid ${isActive ? p.color : "transparent"}`,
                    background: isActive ? `${p.color}10` : "transparent",
                    transition:"all .15s", borderBottom:`1px solid ${BORD2}` }}>
                  <div style={{ display:"flex", gap:9, alignItems:"center" }}>
                    <Avatar initials={p.initials} color={p.color} size={30} online={p.online}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:14,
                        color: isActive ? p.color : CREAM, letterSpacing:"0.02em",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {p.name}
                      </p>
                      <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:MUTED,
                        fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis",
                        whiteSpace:"nowrap", lineHeight:1.4 }}>
                        {lastMsg?.text.slice(0,32)}…
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* My profile mini card */}
          <div style={{ margin:"10px 10px", padding:"12px",
            border:`1px solid ${BORD}`, borderRadius:5,
            background:"rgba(212,168,67,0.03)" }}>
            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
              color:DIM, letterSpacing:"0.12em", textTransform:"uppercase",
              marginBottom:8 }}>Your Profile</p>
            <div style={{ display:"flex", gap:9, alignItems:"center" }}>
              <Avatar initials="MM" color={GOLD} size={34} online/>
              <div>
                <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:14,
                  color:GOLD, letterSpacing:"0.02em" }}>Mishka M.</p>
                <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                  color:MUTED }}>EN native · ES learner</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        {view === "discover" ? (

          /* ══ DISCOVER GRID ══ */
          <div className="pp-main" style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:BORD }}/>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                color:DIM, letterSpacing:"0.16em", textTransform:"uppercase" }}>
                {displayProfiles.length} learners looking for pen pals
              </span>
              <div style={{ flex:1, height:1, background:BORD }}/>
            </div>

            <div className="pp-discover-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",
              gap:16 }}>
              {displayProfiles.map((p, i) => {
                const mc = matchColor(p.matchPct);
                const nlm = LANG_META[p.native];
                const llm = LANG_META[p.learning];
                const hasThread = p.thread.length > 0;
                return (
                  <div key={p.id} className="pal-card"
                    style={{ background:CARD, border:`1px solid ${hasThread ? p.color+"35" : BORD}`,
                      borderRadius:6, padding:"18px 18px 16px", cursor:"default",
                      backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
                      animation:`fadeUp .24s ease ${Math.min(i,5)*0.05}s both`,
                      position:"relative", overflow:"hidden" }}>

                    {/* Top accent line */}
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                      background:`linear-gradient(90deg,${p.color},transparent)` }}/>

                    {/* Header */}
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
                      <Avatar initials={p.initials} color={p.color} size={44} online={p.online}/>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <h3 style={{ fontFamily:"'Oswald',sans-serif", fontSize:19,
                            color:CREAM, letterSpacing:"0.03em" }}>{p.name}</h3>
                          <MatchRing pct={p.matchPct} color={mc}/>
                        </div>
                        <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                          color:MUTED, letterSpacing:"0.08em", marginTop:2 }}>
                          {p.flag} {p.country} · {p.gender}
                        </p>
                        {/* Language chips */}
                        <div style={{ display:"flex", gap:5, marginTop:6 }}>
                          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                            letterSpacing:"0.08em", color:nlm?.c,
                            border:`1px solid ${nlm?.c}40`, borderRadius:2, padding:"2px 8px",
                            background:`${nlm?.c}10` }}>
                            {nlm?.flag} {nlm?.name} native
                          </span>
                          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                            letterSpacing:"0.08em", color:llm?.c,
                            border:`1px solid ${llm?.c}40`, borderRadius:2, padding:"2px 8px",
                            background:`${llm?.c}10` }}>
                            learning {llm?.flag} {llm?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p style={{ fontFamily:"'Lora',serif", fontSize:15, color:BODY,
                      lineHeight:1.7, fontStyle:"italic", marginBottom:12,
                      borderLeft:`2px solid ${p.color}30`, paddingLeft:10 }}>
                      {p.bio}
                    </p>

                    {/* Interests */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                      {p.interests.map(t => <Tag key={t} label={t} color={p.color}/>)}
                    </div>

                    {/* Footer */}
                    <div style={{ display:"flex", alignItems:"center",
                      justifyContent:"space-between", paddingTop:10,
                      borderTop:`1px solid ${BORD2}` }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                        color:DIM, letterSpacing:"0.06em" }}>{p.replies}</span>

                      {hasThread ? (
                        <button onClick={() => openThread(p.id)} className="view-btn"
                          style={{ padding:"8px 18px", borderRadius:3, cursor:"pointer",
                            border:`1px solid ${p.color}50`, background:`${p.color}15`,
                            fontFamily:"'Oswald',sans-serif", fontSize:12,
                            letterSpacing:"0.1em", textTransform:"uppercase",
                            color:p.color, transition:"all .15s" }}>
                          View Letters ({p.thread.length})
                        </button>
                      ) : (
                        <button onClick={() => openThread(p.id)} className="view-btn"
                          style={{ padding:"8px 18px", borderRadius:3, cursor:"pointer",
                            border:`1px solid ${BORD}`, background:"transparent",
                            fontFamily:"'Oswald',sans-serif", fontSize:12,
                            letterSpacing:"0.1em", textTransform:"uppercase",
                            color:MUTED, transition:"all .15s" }}>
                          Send First Letter →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          /* ══ CORRESPONDENCE VIEW ══ */
          <div className="pp-main" style={{ flex:1, display:"flex", overflow:"hidden" }}>

            {/* Pal selector if none selected */}
            {!selectedPal ? (
              <div style={{ flex:1, display:"flex", alignItems:"center",
                justifyContent:"center", flexDirection:"column", gap:12 }}>
                <svg width={40} height={40} viewBox="0 0 24 24" fill="none"
                  stroke={DIM} strokeWidth="1.2" strokeLinecap="round">
                  <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"/>
                </svg>
                <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:DIM,
                  fontStyle:"italic" }}>Select a pen pal from the sidebar</p>
                <button onClick={() => setView("discover")}
                  style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                    letterSpacing:"0.1em", color:GOLD, background:"transparent",
                    border:`1px solid ${GOLD}40`, borderRadius:3,
                    padding:"6px 16px", cursor:"pointer" }}>
                  Browse Pen Pals →
                </button>
              </div>
            ) : (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

                {/* Thread topbar */}
                <div style={{ padding:"12px 22px", borderBottom:`1px solid ${BORD}`,
                  background:CARD2, display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
                  <Avatar initials={selectedPal.initials} color={selectedPal.color}
                    size={36} online={selectedPal.online}/>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontFamily:"'Oswald',sans-serif", fontSize:17,
                      color:CREAM, letterSpacing:"0.03em" }}>{selectedPal.name}</h3>
                    <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:selectedPal.color, letterSpacing:"0.08em" }}>
                      {selectedPal.flag} {selectedPal.country} · {LANG_META[selectedPal.native]?.name} native
                      {selectedPal.online && <span style={{ color:A_GREEN, marginLeft:8 }}>● online</span>}
                    </p>
                  </div>

                  {/* Level + match */}
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      letterSpacing:"0.08em", color:MUTED, border:`1px solid ${BORD}`,
                      borderRadius:2, padding:"3px 9px" }}>{selectedPal.level}</span>
                    <MatchRing pct={selectedPal.matchPct} color={matchColor(selectedPal.matchPct)}/>
                  </div>

                  <button onClick={() => { setView("discover"); }}
                    style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      letterSpacing:"0.1em", color:MUTED, background:"transparent",
                      border:`1px solid ${BORD}`, borderRadius:3,
                      padding:"5px 14px", cursor:"pointer" }}>
                    ← Back
                  </button>
                </div>

                {/* Letters area */}
                <div ref={threadRef} style={{ flex:1, overflowY:"auto",
                  padding:"22px 28px 10px" }}>

                  {selectedPal.thread.length === 0 ? (
                    <div style={{ display:"flex", flexDirection:"column",
                      alignItems:"center", justifyContent:"center",
                      height:"100%", gap:12, opacity:0.7 }}>
                      <div style={{ width:60, height:60, borderRadius:8,
                        border:`1px solid ${selectedPal.color}30`,
                        background:`${selectedPal.color}0a`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
                          stroke={selectedPal.color} strokeWidth="1.2" strokeLinecap="round">
                          <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"/>
                        </svg>
                      </div>
                      <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:DIM,
                        fontStyle:"italic", textAlign:"center", maxWidth:260, lineHeight:1.6 }}>
                        No letters yet. Be the first to write to {selectedPal.name.split(" ")[0]}!
                      </p>
                    </div>
                  ) : (
                    selectedPal.thread.map((msg, i) => (
                      <LetterBubble key={i} msg={msg}
                        palColor={selectedPal.color} showCorrection/>
                    ))
                  )}

                  {sending && (
                    <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
                      <div style={{ background:`${GOLD}10`, border:`1px solid ${GOLD}25`,
                        borderRadius:"8px 2px 8px 8px", padding:"12px 16px",
                        display:"flex", gap:5, alignItems:"center" }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{ width:5, height:5, borderRadius:"50%",
                            background:GOLD, animation:`pulse 1s ${i*0.2}s infinite` }}/>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Compose area */}
                <div style={{ borderTop:`1px solid ${BORD}`, padding:"14px 22px",
                  background:CARD2, flexShrink:0 }}>

                  {sentFlash && (
                    <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:8,
                      animation:"fadeIn .2s ease both" }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
                        stroke={A_GREEN} strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                        color:A_GREEN, letterSpacing:"0.1em" }}>
                        LETTER SENT — awaiting reply
                      </span>
                    </div>
                  )}

                  <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                    <div style={{ flex:1, position:"relative" }}>
                      {/* Corner HUD accents */}
                      <div style={{ position:"absolute", top:0, left:0, width:8, height:8,
                        borderTop:`1px solid ${selectedPal.color}40`,
                        borderLeft:`1px solid ${selectedPal.color}40`, pointerEvents:"none" }}/>
                      <textarea value={letterText}
                        onChange={e => setLetterText(e.target.value)}
                        onKeyDown={e => { if(e.key==="Enter" && e.metaKey) sendLetter(); }}
                        placeholder={`Write your letter in ${LANG_META[writeLang]?.name || writeLang}… (⌘+Enter to send)`}
                        rows={3}
                        style={{ width:"100%", background:CARD,
                          border:`1px solid ${letterText ? selectedPal.color+"30" : BORD}`,
                          borderRadius:4, padding:"11px 14px",
                          fontFamily:"'Lora',serif", fontSize:14, color:CREAM,
                          resize:"none", outline:"none", lineHeight:1.7,
                          transition:"border-color .2s" }}/>
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {/* Language toggle */}
                      <div style={{ display:"flex", gap:3 }}>
                        {["EN","ES","FR","JP","KO"].map(l => (
                          <button key={l} onClick={() => setWriteLang(l)}
                            style={{ width:30, height:22, borderRadius:2, cursor:"pointer",
                              border:`1px solid ${writeLang===l ? (LANG_META[l]?.c||GOLD)+"60" : BORD2}`,
                              background: writeLang===l ? `${LANG_META[l]?.c||GOLD}18` : "transparent",
                              fontFamily:"'Share Tech Mono',monospace", fontSize:7,
                              letterSpacing:"0.06em",
                              color: writeLang===l ? (LANG_META[l]?.c||GOLD) : DIM,
                              transition:"all .12s" }}>{l}</button>
                        ))}
                      </div>

                      <button onClick={sendLetter}
                        disabled={!letterText.trim() || sending}
                        className="send-btn"
                        style={{ padding:"10px 20px", borderRadius:4, border:"none",
                          background: letterText.trim() && !sending ? selectedPal.color : DIM,
                          fontFamily:"'Oswald',sans-serif", fontSize:11,
                          letterSpacing:"0.1em", textTransform:"uppercase",
                          color:CREAM, fontWeight:700, cursor: letterText.trim()?"pointer":"default",
                          transition:"all .2s", opacity: letterText.trim() ? 1 : 0.45 }}>
                        Send →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── RIGHT: Profile panel ── */}
            {selectedPal && (
              <div style={{ width:240, borderLeft:`1px solid ${BORD}`, background:CARD2,
                overflowY:"auto", flexShrink:0, padding:"18px 16px",
                animation:"slideR .25s ease both" }}>

                {/* Large avatar */}
                <div style={{ display:"flex", flexDirection:"column",
                  alignItems:"center", gap:10, marginBottom:18,
                  paddingBottom:16, borderBottom:`1px solid ${BORD}` }}>
                  <Avatar initials={selectedPal.initials} color={selectedPal.color}
                    size={64} online={selectedPal.online}/>
                  <div style={{ textAlign:"center" }}>
                    <h3 style={{ fontFamily:"'Oswald',sans-serif", fontSize:16,
                      color:CREAM, letterSpacing:"0.04em" }}>{selectedPal.name}</h3>
                    <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                      color:selectedPal.color, letterSpacing:"0.08em", marginTop:3 }}>
                      {selectedPal.flag} {selectedPal.country}
                    </p>
                  </div>
                  <MatchRing pct={selectedPal.matchPct}
                    color={matchColor(selectedPal.matchPct)}/>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                    color:matchColor(selectedPal.matchPct), letterSpacing:"0.1em" }}>
                    {selectedPal.matchPct}% MATCH
                  </span>
                </div>

                {/* Bio */}
                <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY,
                  lineHeight:1.7, fontStyle:"italic", marginBottom:14,
                  borderLeft:`2px solid ${selectedPal.color}30`, paddingLeft:10 }}>
                  {selectedPal.bio}
                </p>

                {/* Languages */}
                <div style={{ marginBottom:14 }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                    color:MUTED, letterSpacing:"0.12em", textTransform:"uppercase",
                    display:"block", marginBottom:7 }}>Languages</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                        color:DIM, letterSpacing:"0.06em", minWidth:40 }}>native</span>
                      <Tag label={`${LANG_META[selectedPal.native]?.flag} ${LANG_META[selectedPal.native]?.name}`}
                        color={LANG_META[selectedPal.native]?.c}/>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                        color:DIM, letterSpacing:"0.06em", minWidth:40 }}>learning</span>
                      <Tag label={`${LANG_META[selectedPal.learning]?.flag} ${LANG_META[selectedPal.learning]?.name}`}
                        color={LANG_META[selectedPal.learning]?.c}/>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div style={{ marginBottom:14 }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                    color:MUTED, letterSpacing:"0.12em", textTransform:"uppercase",
                    display:"block", marginBottom:7 }}>Interests</span>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {selectedPal.interests.map(t => (
                      <Tag key={t} label={t} color={selectedPal.color}/>
                    ))}
                  </div>
                </div>

                {/* Reply habits */}
                <div style={{ padding:"10px 12px", background:`${selectedPal.color}08`,
                  border:`1px solid ${selectedPal.color}25`, borderRadius:4 }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                    color:selectedPal.color, letterSpacing:"0.1em",
                    textTransform:"uppercase", display:"block", marginBottom:4 }}>
                    Response Habits
                  </span>
                  <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY,
                    fontStyle:"italic", lineHeight:1.5 }}>{selectedPal.replies}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}