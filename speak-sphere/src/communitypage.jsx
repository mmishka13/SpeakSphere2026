import { useState } from "react";

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
const BORD2  = "rgba(212,168,67,0.06)";
const BODY   = "#c8aa80";
const A_GREEN  = "#7db87d";
const A_BLUE   = "#6a9ec0";
const A_ROSE   = "#c07070";
const A_AMBER  = "#d4a96a";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(212,168,67,0.2); border-radius:2px; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes popIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .post-card:hover   { border-color:rgba(212,168,67,0.28) !important; box-shadow:0 4px 28px rgba(0,0,0,0.45) !important; }
  .like-btn:hover    { background:rgba(212,168,67,0.1) !important; border-color:rgba(212,168,67,0.35) !important; }
  .like-btn:hover span { color:#f5ede0 !important; }
  .stamp-tab         { transition:all .16s; cursor:pointer; }
  .stamp-tab:hover   { opacity:0.8 !important; }
  .user-row:hover    { background:rgba(212,168,67,0.05) !important; }
  .tag-btn:hover     { opacity:0.75; }
  .submit-btn:hover  { filter:brightness(1.1); transform:translateY(-1px); }
  @media(max-width:768px){
    .comm-layout { flex-direction:column !important; }
    .comm-sidebar { display:none !important; }
    .comm-feed { min-width:0 !important; }
    .comm-masthead-date { grid-template-columns:1fr !important; text-align:center !important; gap:4px !important; }
    .comm-composer { padding:14px 16px !important; }
    .comm-post { padding:14px 16px !important; }
  }
  @media(min-width:768px) and (max-width:1023px){
    .comm-sidebar { width:220px !important; }
  }
`;

const LANGS = {
  ES: { name:"Spanish",  c:"#e07858", stamp:"ESP", script:"Hola"   },
  FR: { name:"French",   c:"#6a9ec0", stamp:"FRA", script:"Salut"  },
  JP: { name:"Japanese", c:"#c07070", stamp:"JPN", script:"やあ"    },
  KO: { name:"Korean",   c:"#7db87d", stamp:"KOR", script:"안녕"    },
};
const TYPE_META = {
  tip:        { label:"TIP",       c:A_GREEN, bg:"rgba(125,184,125,0.1)"  },
  discussion: { label:"DISCUSS",   c:A_BLUE,  bg:"rgba(106,158,192,0.1)"  },
  question:   { label:"QUESTION",  c:A_AMBER, bg:"rgba(212,169,106,0.1)"  },
  milestone:  { label:"MILESTONE", c:GOLD,    bg:"rgba(212,168,67,0.1)"   },
  resource:   { label:"RESOURCE",  c:A_ROSE,  bg:"rgba(192,112,112,0.1)"  },
};

const SEED_POSTS = [
  { id:1,  author:"Carlos M.",  initials:"CM", authorColor:"#e07858", lang:"ES", level:"Intermediate", time:"2m ago",
    text:"Just had a breakthrough with the subjunctive! The key for me was stopping trying to translate it literally from English — it's more of a mood than a tense. Once I stopped fighting it, everything clicked. Anyone else had this moment?",
    likes:24, comments:8,  liked:false, type:"discussion", badge:"Top Contributor" },
  { id:2,  author:"Yuki T.",    initials:"YT", authorColor:"#c07070", lang:"JP", level:"Advanced",      time:"15m ago",
    text:"Shadowing NHK World Radio is incredibly effective for pitch accent. 30 minutes a day for three weeks and my tutor said my intonation improved dramatically. The secret is to not think — just parrot.",
    likes:41, comments:13, liked:false, type:"tip",        badge:"Verified Tutor" },
  { id:3,  author:"Claire D.",  initials:"CD", authorColor:"#6a9ec0", lang:"FR", level:"Beginner",      time:"34m ago",
    text:"Just completed my first full French conversation without switching to English once! 47-day streak and it finally clicked. Merci à tous mes tuteurs — you kept me going through the hard weeks.",
    likes:89, comments:22, liked:true,  type:"milestone",  badge:null },
  { id:4,  author:"Jin P.",     initials:"JP", authorColor:"#7db87d", lang:"KO", level:"Intermediate",  time:"1h ago",
    text:"Quick grammar note: -(으)면 vs -면 confused me forever. If the verb stem ends in a consonant, add 으면. If it ends in a vowel, just add 면. Sounds obvious written out but it took me two months to internalise.",
    likes:33, comments:6,  liked:false, type:"tip",        badge:"Verified Tutor" },
  { id:5,  author:"Sofia R.",   initials:"SR", authorColor:"#e07858", lang:"ES", level:"Advanced",      time:"2h ago",
    text:"Anyone have good podcast recommendations for advanced Spanish? I've exhausted Radio Ambulante and want something with more regional variety — particularly Caribbean or Río Platense accents.",
    likes:17, comments:19, liked:false, type:"question",   badge:null },
  { id:6,  author:"Pierre M.",  initials:"PM", authorColor:"#6a9ec0", lang:"FR", level:"Intermediate",  time:"3h ago",
    text:"The French R is genuinely the hardest sound I've encountered in any language. Two months of daily practice and it's still inconsistent. Has anyone found a specific exercise that actually helped them past the wall?",
    likes:52, comments:31, liked:false, type:"discussion",  badge:null },
  { id:7,  author:"Ana L.",     initials:"AL", authorColor:"#e07858", lang:"ES", level:"Beginner",      time:"5h ago",
    text:"Resource drop: free PDF conjugation chart covering ALL irregular verbs in preterite tense with example sentences. Saved my exam last week. Link in the comments — no signup required.",
    likes:67, comments:14, liked:true,  type:"resource",   badge:null },
  { id:8,  author:"Mishka M.",  initials:"MM", authorColor:GOLD,      lang:"ES", level:"Intermediate",  time:"8h ago",
    text:"Finished Lesson 2.3 on Present Subjunctive today — the WEIRDOS framework is genuinely helpful for remembering trigger phrases. Scored 82 on the quiz! Feeling good about Intermediate progress.",
    likes:12, comments:4,  liked:false, type:"milestone",  badge:null, isMe:true },
];

const LEADERBOARD = [
  { rank:1, name:"Carlos M.",  initials:"CM", c:"#e07858", xp:4820, lang:"ES", streak:34 },
  { rank:2, name:"Yuki T.",    initials:"YT", c:"#c07070", xp:4210, lang:"JP", streak:28 },
  { rank:3, name:"Jin P.",     initials:"JP", c:"#7db87d", xp:3890, lang:"KO", streak:21 },
  { rank:4, name:"Sofia R.",   initials:"SR", c:"#e07858", xp:3540, lang:"ES", streak:19 },
  { rank:5, name:"Mishka M.",  initials:"MM", c:GOLD,      xp:1840, lang:"ES", streak:12, isMe:true },
  { rank:6, name:"Pierre M.",  initials:"PM", c:"#6a9ec0", xp:1620, lang:"FR", streak:8  },
  { rank:7, name:"Claire D.",  initials:"CD", c:"#6a9ec0", xp:1480, lang:"FR", streak:47 },
];

const ACTIVE_NOW = [
  { name:"Carlos M.",  initials:"CM", c:"#e07858", status:"In a session"       },
  { name:"Yuki T.",    initials:"YT", c:"#c07070", status:"Browsing resources"  },
  { name:"Ana L.",     initials:"AL", c:"#e07858", status:"Online"              },
  { name:"Soo Y.",     initials:"SY", c:"#7db87d", status:"Online"              },
  { name:"Diego V.",   initials:"DV", c:"#e07858", status:"In a session"        },
];

const TICKER_ITEMS = [
  "Carlos M. just booked a Spanish session",
  "New tip posted in Japanese",
  "Claire D. hit a 47-day streak",
  "Sofia R. asked about podcast recommendations",
  "Yuki T. shared a pitch accent guide",
  "Community milestone: 1,000 sessions booked this month",
  "Jin P. published a new Korean grammar tip",
  "Pierre M. is asking about the French R — weigh in!",
];

function Avatar({ initials, color, size=34, isMe=false }) {
  return (
    <div style={{ width:size, height:size, borderRadius:4, flexShrink:0,
      background:`${color}1a`, border:`1px solid ${isMe ? GOLD : color}55`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Oswald',sans-serif", fontSize:size*0.32,
      fontWeight:700, color: isMe ? GOLD : color, letterSpacing:"0.04em" }}>
      {initials}
    </div>
  );
}

function RankMedal({ rank }) {
  const cols = { 1:["#f5d060","#8a6a00"], 2:["#c0c8d0","#6a7a84"], 3:["#d49060","#6a3010"] };
  const [fg, bg2] = cols[rank] || [DIM, "transparent"];
  return (
    <div style={{ width:26, height:26, borderRadius:3, flexShrink:0,
      background: rank<=3 ? `linear-gradient(135deg,${fg},${bg2})` : "transparent",
      border: rank>3 ? `1px solid ${DIM}` : "none",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Oswald',sans-serif", fontSize:13, fontWeight:700,
      color: rank<=3 ? DARK : DIM }}>
      {rank}
    </div>
  );
}

export default function CommunityPage() {
  const [posts,     setPosts]     = useState(SEED_POSTS);
  const [filter,    setFilter]    = useState("ALL");
  const [composing, setComposing] = useState(false);
  const [postText,  setPostText]  = useState("");
  const [postLang,  setPostLang]  = useState("ES");
  const [postType,  setPostType]  = useState("discussion");
  const [flash,     setFlash]     = useState(false);

  const filtered = filter === "ALL" ? posts : posts.filter(p => p.lang === filter);

  function toggleLike(id) {
    setPosts(ps => ps.map(p =>
      p.id === id ? { ...p, liked:!p.liked, likes:p.liked?p.likes-1:p.likes+1 } : p
    ));
  }

  function submitPost() {
    if (!postText.trim()) return;
    setPosts(ps => [{
      id:Date.now(), author:"Mishka M.", initials:"MM", authorColor:GOLD,
      lang:postLang, level:"Intermediate", time:"just now",
      text:postText, likes:0, comments:0, liked:false,
      type:postType, badge:null, isMe:true,
    }, ...ps]);
    setPostText(""); setComposing(false);
    setFlash(true); setTimeout(() => setFlash(false), 2800);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%",
      background:DARK, color:CREAM, overflow:"hidden",
      backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
      <style>{CSS}</style>

      {/* ══ LIVE TICKER ══ */}
      <div style={{ height:42, background:"#0c0600", borderBottom:`1px solid ${BORD}`,
        display:"flex", alignItems:"center", overflow:"hidden", flexShrink:0 }}>
        <div style={{ background:GOLD, padding:"0 18px", height:"100%", display:"flex",
          alignItems:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700,
            color:CREAM, letterSpacing:"0.14em" }}>LIVE</span>
        </div>
        <div style={{ flex:1, overflow:"hidden" }}>
          <div style={{ display:"inline-flex", gap:56, animation:"ticker 40s linear infinite",
            whiteSpace:"nowrap" }}>
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i) => (
              <span key={i} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14,
                color:BODY, letterSpacing:"0.05em", lineHeight:"42px" }}>◆ {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MASTHEAD ══ */}
      <header style={{ background:CARD2, borderBottom:`2px solid ${GOLD}`, flexShrink:0 }}>
        {/* Date bar */}
        <div className="comm-masthead-date" style={{ padding:"10px 24px", borderBottom:`1px solid ${BORD}`,
          display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center" }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14,
            color:DIM, letterSpacing:"0.12em" }}>SPEAKSPHERE · COMMUNITY DISPATCH</span>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, color:DIM, textAlign:"center" }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
          </span>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14,
            color:DIM, textAlign:"right" }}>{posts.length} posts · {ACTIVE_NOW.length} online</span>
        </div>

        {/* Big title + tabs */}
        <div style={{ padding:"8px 24px 0", display:"flex", alignItems:"flex-end", gap:20 }}>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:42,
            fontWeight:700, color:CREAM, lineHeight:1, letterSpacing:"0.06em",
            textTransform:"uppercase", flex:1 }}>
            The Community
          </h1>

          {/* Stamp filter tabs */}
          <div style={{ display:"flex", gap:0, alignItems:"flex-end" }}>
            {[{code:"ALL", name:"All", c:GOLD, stamp:"ALL", script:""},...Object.entries(LANGS).map(([code,lm])=>({code,...lm}))].map((lm) => {
              const active = filter === lm.code;
              return (
                <button key={lm.code} onClick={() => setFilter(lm.code)} className="stamp-tab"
                  style={{ padding:"5px 13px 7px",
                    border:`1px solid ${active ? lm.c+"70" : BORD}`,
                    borderBottom: active ? `2px solid ${lm.c}` : `1px solid ${BORD}`,
                    background: active ? `${lm.c}15` : "transparent",
                    marginBottom: active ? -2 : 0,
                    fontFamily:"'Oswald',sans-serif", fontSize:12, letterSpacing:"0.1em",
                    color: active ? lm.c : MUTED, borderRadius:"4px 4px 0 0",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                  {lm.script && <span style={{ fontFamily:"Georgia,serif", fontSize:12, opacity:0.65 }}>{lm.script}</span>}
                  <span>{lm.stamp || lm.code}</span>
                </button>
              );
            })}

            <button onClick={() => setComposing(c=>!c)} className="stamp-tab"
              style={{ marginLeft:10, padding:"5px 16px 7px", borderRadius:"4px 4px 0 0",
                border:`1px solid ${composing ? GOLD+"70" : BORD}`,
                borderBottom: composing ? `2px solid ${GOLD}` : `1px solid ${BORD}`,
                background: composing ? "rgba(212,168,67,0.20)" : "transparent",
                fontFamily:"'Oswald',sans-serif", fontSize:12, letterSpacing:"0.1em",
                color: composing ? GOLD : MUTED, marginBottom: composing ? -2 : 0 }}>
              {composing ? "✕ CANCEL" : "+ DISPATCH"}
            </button>
          </div>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="comm-layout" style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── FEED ── */}
        <div className="comm-feed" style={{ flex:1, overflowY:"auto", padding:"18px 24px", display:"flex",
          flexDirection:"column", gap:0 }}>

          {/* Flash */}
          {flash && (
            <div style={{ marginBottom:14, background:CARD,
              border:`1px solid ${A_GREEN}50`, borderLeft:`3px solid ${A_GREEN}`,
              borderRadius:4, padding:"9px 16px", display:"flex", alignItems:"center", gap:10,
              animation:"popIn .2s ease both" }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                stroke={A_GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:12,
                letterSpacing:"0.08em", color:A_GREEN }}>Dispatch published.</span>
            </div>
          )}

          {/* Composer */}
          {composing && (
            <div className="comm-composer" style={{ marginBottom:18, background:CARD,
              border:`1px solid ${GOLD}28`, borderTop:`2px solid ${GOLD}`,
              borderRadius:"0 0 5px 5px", padding:"18px 20px",
              animation:"fadeUp .2s ease both" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
                <Avatar initials="MM" color={GOLD} isMe size={34}/>
                <div>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:15,
                    color:CREAM, letterSpacing:"0.04em" }}>Mishka M.</p>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                    color:MUTED, letterSpacing:"0.08em" }}>Journeyman · Intermediate Spanish</p>
                </div>
                <div style={{ flex:1, height:1, background:BORD2, marginLeft:8 }}/>
              </div>

              <textarea value={postText} onChange={e => setPostText(e.target.value)}
                placeholder="Write your dispatch — share a tip, ask a question, celebrate a win…"
                rows={4}
                style={{ width:"100%", background:"rgba(255,255,255,0.02)",
                  border:`1px solid ${postText ? GOLD+"30" : BORD}`, borderRadius:3,
                  padding:"11px 14px", fontFamily:"'Lora',serif", fontSize:14,
                  color:CREAM, resize:"none", outline:"none", lineHeight:1.75,
                  marginBottom:12, transition:"border-color .2s" }}/>

              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                {Object.entries(LANGS).map(([code, lm]) => (
                  <button key={code} onClick={() => setPostLang(code)} className="tag-btn"
                    style={{ padding:"3px 9px", borderRadius:2, cursor:"pointer",
                      border:`1px solid ${postLang===code ? lm.c+"60" : BORD2}`,
                      background: postLang===code ? `${lm.c}18` : "transparent",
                      fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      letterSpacing:"0.1em", color: postLang===code ? lm.c : DIM,
                      transition:"all .12s" }}>{lm.stamp}</button>
                ))}
                <div style={{ width:1, height:16, background:BORD, margin:"0 4px" }}/>
                {Object.entries(TYPE_META).map(([t, tm]) => (
                  <button key={t} onClick={() => setPostType(t)} className="tag-btn"
                    style={{ padding:"3px 9px", borderRadius:2, cursor:"pointer",
                      border:`1px solid ${postType===t ? tm.c+"60" : BORD2}`,
                      background: postType===t ? tm.bg : "transparent",
                      fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      letterSpacing:"0.08em", color: postType===t ? tm.c : DIM,
                      transition:"all .12s" }}>{tm.label}</button>
                ))}
                <button onClick={submitPost} disabled={!postText.trim()} className="submit-btn"
                  style={{ marginLeft:"auto", padding:"6px 20px", borderRadius:3, border:"none",
                    background: postText.trim() ? GOLD : DIM, cursor: postText.trim()?"pointer":"default",
                    fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.12em",
                    color:CREAM, fontWeight:700, transition:"all .15s",
                    opacity: postText.trim() ? 1 : 0.4 }}>PUBLISH</button>
              </div>
            </div>
          )}

          {/* Section rule */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:BORD }}/>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
              color:DIM, letterSpacing:"0.16em", textTransform:"uppercase" }}>
              {filter==="ALL" ? "All Dispatches" : `${LANGS[filter]?.name} Dispatches`} — {filtered.length}
            </span>
            <div style={{ flex:1, height:1, background:BORD }}/>
          </div>

          {/* Post cards */}
          {filtered.map((post, i) => {
            const lm = LANGS[post.lang];
            const tm = TYPE_META[post.type] || TYPE_META.discussion;
            return (
              <div key={post.id} className="post-card comm-post"
                style={{ marginBottom:10, background:CARD,
                  border:`1px solid ${post.isMe ? GOLD+"28" : BORD}`,
                  borderLeft:`3px solid ${lm.c}`,
                  borderRadius:"0 5px 5px 0", padding:"15px 18px 13px",
                  transition:"border-color .2s, box-shadow .2s",
                  animation:`fadeUp .22s ease ${Math.min(i,6)*0.04}s both` }}>

                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:11, marginBottom:9 }}>
                  <Avatar initials={post.initials} color={post.authorColor} isMe={!!post.isMe}/>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:2 }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                        letterSpacing:"0.14em", color:tm.c, background:tm.bg,
                        border:`1px solid ${tm.c}40`, borderRadius:2, padding:"2px 8px" }}>
                        {tm.label}
                      </span>
                      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:16,
                        color: post.isMe ? GOLD : CREAM, letterSpacing:"0.03em" }}>
                        {post.author}
                      </span>
                      {post.isMe && (
                        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                          color:GOLD, border:`1px solid ${GOLD}40`, borderRadius:2,
                          padding:"1px 6px", letterSpacing:"0.1em" }}>YOU</span>
                      )}
                      {post.badge && (
                        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                          color:A_GREEN, border:`1px solid ${A_GREEN}35`,
                          borderRadius:2, padding:"1px 6px", letterSpacing:"0.08em" }}>
                          {post.badge}
                        </span>
                      )}
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                        color:lm.c, border:`1px solid ${lm.c}35`,
                        borderRadius:2, padding:"2px 7px", letterSpacing:"0.08em" }}>
                        {lm.name.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:DIM, letterSpacing:"0.06em" }}>{post.level} · {post.time}</span>
                  </div>
                </div>

                {/* Body */}
                <p style={{ fontFamily:"'Lora',serif", fontSize:16, color:BODY,
                  lineHeight:1.78, marginBottom:12, paddingLeft:45 }}>{post.text}</p>

                {/* Actions */}
                <div style={{ paddingLeft:45, display:"flex", alignItems:"center", gap:7 }}>
                  <button onClick={() => toggleLike(post.id)} className="like-btn"
                    style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 11px",
                      borderRadius:3, cursor:"pointer",
                      border:`1px solid ${post.liked ? GOLD+"55" : BORD2}`,
                      background: post.liked ? "rgba(212,168,67,0.14)" : "transparent",
                      transition:"all .14s" }}>
                    <svg width={12} height={12} viewBox="0 0 24 24"
                      fill={post.liked ? GOLD : "none"}
                      stroke={post.liked ? GOLD : MUTED} strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color: post.liked ? GOLD : MUTED, letterSpacing:"0.06em",
                      transition:"color .14s" }}>{post.likes}</span>
                  </button>

                  <button className="like-btn"
                    style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 11px",
                      borderRadius:3, cursor:"pointer", border:`1px solid ${BORD2}`,
                      background:"transparent", transition:"all .14s" }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
                      stroke={MUTED} strokeWidth="1.8" strokeLinecap="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:MUTED, letterSpacing:"0.06em" }}>{post.comments}</span>
                  </button>

                  <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:`${lm.c}70` }}/>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:DIM, letterSpacing:"0.06em" }}>{post.time}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:26,
                fontWeight:300, letterSpacing:"0.1em", textTransform:"uppercase",
                color:DIM, marginBottom:8 }}>No dispatches yet</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:DIM, fontStyle:"italic" }}>
                Be the first to post in this language.
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="comm-sidebar" style={{ width:290, borderLeft:`1px solid ${BORD}`, background:CARD2,
          display:"flex", flexDirection:"column", overflowY:"auto", flexShrink:0 }}>

          {/* Leaderboard */}
          <div style={{ padding:"14px 16px 0" }}>
            <div style={{ borderTop:`2px solid ${GOLD}`, borderBottom:`1px solid ${BORD}`,
              padding:"7px 0", marginBottom:12 }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:22,
                fontWeight:600, color:CREAM, letterSpacing:"0.06em",
                textTransform:"uppercase", lineHeight:1.1 }}>Leaderboard</p>
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                color:DIM, letterSpacing:"0.12em", textTransform:"uppercase", marginTop:2 }}>
                Top Learners by XP
              </p>
            </div>

            {LEADERBOARD.map((u, i) => (
              <div key={i} className="user-row"
                style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 3px",
                  borderRadius:3, transition:"background .12s",
                  background: u.isMe ? "rgba(212,168,67,0.05)" : "transparent",
                  borderBottom:`1px solid ${BORD2}`, marginBottom:2 }}>
                <RankMedal rank={u.rank}/>
                <Avatar initials={u.initials} color={u.c} size={26} isMe={!!u.isMe}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
                    color: u.isMe ? GOLD : CREAM, letterSpacing:"0.02em",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {u.name}{u.isMe ? " ★" : ""}
                  </p>
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:MUTED }}>{u.xp.toLocaleString()} XP</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                      color:u.c }}>· {u.streak}d</span>
                  </div>
                  <div style={{ marginTop:2, height:2, borderRadius:1,
                    background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ height:"100%", borderRadius:1,
                      background:`linear-gradient(90deg,${u.c}70,${u.c})`,
                      width:`${Math.min((u.xp/5000)*100,100)}%` }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active now */}
          <div style={{ padding:"12px 16px 0", marginTop:6 }}>
            <div style={{ borderTop:`2px solid ${BORD}`, borderBottom:`1px solid ${BORD2}`,
              padding:"7px 0", marginBottom:10,
              display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:A_GREEN,
                animation:"pulse 2s infinite" }}/>
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                color:MUTED, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                Active Now · {ACTIVE_NOW.length}
              </p>
            </div>

            {ACTIVE_NOW.map((u, i) => (
              <div key={i} className="user-row"
                style={{ display:"flex", alignItems:"center", gap:9, padding:"5px 3px",
                  borderRadius:3, transition:"background .12s", marginBottom:4 }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <Avatar initials={u.initials} color={u.c} size={26}/>
                  <div style={{ position:"absolute", bottom:-1, right:-1,
                    width:7, height:7, borderRadius:"50%",
                    border:`1.5px solid ${CARD2}`,
                    background: u.status.includes("session") ? A_AMBER : A_GREEN }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:CREAM,
                    letterSpacing:"0.02em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {u.name}
                  </p>
                  <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                    color: u.status.includes("session") ? A_AMBER : A_GREEN,
                    letterSpacing:"0.04em" }}>{u.status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly stats */}
          <div style={{ padding:"12px 16px", marginTop:6 }}>
            <div style={{ borderTop:`2px solid ${BORD}`, borderBottom:`1px solid ${BORD2}`,
              padding:"7px 0", marginBottom:12 }}>
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                color:MUTED, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                This Week's Figures
              </p>
            </div>
            {[
              { label:"Dispatches published", value:"142"  },
              { label:"Sessions booked",      value:"89"   },
              { label:"New members",          value:"23"   },
              { label:"Tips upvoted",         value:"1.2k" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"baseline", marginBottom:9,
                borderBottom:`1px dotted ${BORD2}`, paddingBottom:8 }}>
                <span style={{ fontFamily:"'Lora',serif", fontSize:14, color:BODY,
                  fontStyle:"italic" }}>{s.label}</span>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:22,
                  color:GOLDLT, letterSpacing:"0.04em", lineHeight:1 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}