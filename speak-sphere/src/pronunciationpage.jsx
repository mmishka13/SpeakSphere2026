import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const DARK   = "#140b04";
const CARD   = "#1a0d05";
const CARD2  = "#200f06";
const GOLD   = "#c9a05a";
const GOLDLT = "#e8c07a";
const CREAM  = "#eadcca";
const MUTED  = "#9a7d5a";
const DIM    = "#5a3a22";
const BORD   = "rgba(201,160,90,0.12)";
const BORD2  = "rgba(201,160,90,0.06)";
const BODY   = "#c4aa80";
const A_GREEN  = "#7db87d";
const A_BLUE   = "#6a9ec0";
const A_ROSE   = "#c07070";
const A_AMBER  = "#d4a96a";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;1,400;1,600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(201,160,90,0.2); border-radius:2px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes barDance { 0%,100%{transform:scaleY(0.2)} 50%{transform:scaleY(1)} }
  @keyframes ripple   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes scoreIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .lang-pill:hover  { border-color:rgba(201,160,90,0.4) !important; background:rgba(201,160,90,0.08) !important; }
  .rec-btn:hover    { filter:brightness(1.1); transform:scale(1.04); }
  .word-chip:hover  { transform:translateY(-1px); filter:brightness(1.15); }
  .history-row:hover { background:rgba(201,160,90,0.04) !important; }
  .tip-card:hover   { border-color:rgba(201,160,90,0.22) !important; }
`;

/* ─── LANGUAGE DATA ─────────────────────────────────────────── */
const LANGS = [
  { code:"ES", name:"Spanish",  c:"#e07858", script:"Hola",       placeholder:"e.g. Buenos días, ¿cómo estás?" },
  { code:"FR", name:"French",   c:"#6a9ec0", script:"Bonjour",    placeholder:"e.g. Bonjour, comment allez-vous?" },
  { code:"JP", name:"Japanese", c:"#c07070", script:"こんにちは", placeholder:"e.g. おはようございます" },
  { code:"KO", name:"Korean",   c:"#7db87d", script:"안녕",       placeholder:"e.g. 안녕하세요, 잘 지내세요?" },
];

/* ─── FAKE AI TIPS PER LANGUAGE ─────────────────────────────── */
const LANG_TIPS = {
  ES: [
    { issue:"Rolling R",     fix:"Tap your tongue quickly against the ridge behind your upper teeth." },
    { issue:"Vowel clarity", fix:"Spanish vowels are pure — 'a' is always 'ah', never 'uh'." },
    { issue:"Word stress",   fix:"Stress the second-to-last syllable unless an accent mark says otherwise." },
    { issue:"B vs V",        fix:"In Spanish, B and V sound nearly identical — a soft bilabial sound." },
  ],
  FR: [
    { issue:"Nasal vowels",  fix:"'On', 'an', 'in' — don't close your mouth at the end of these sounds." },
    { issue:"Silent letters",fix:"Final consonants are usually silent unless the next word starts with a vowel." },
    { issue:"R sound",       fix:"French R is guttural — produced in the back of the throat." },
    { issue:"Liaison",       fix:"Link final consonants to following vowel sounds when speaking naturally." },
  ],
  JP: [
    { issue:"Pitch accent",  fix:"Japanese uses pitch (high/low) rather than stress to differentiate words." },
    { issue:"Long vowels",   fix:"Hold long vowels (ō, ū) for exactly double the duration of short ones." },
    { issue:"ん (n)",        fix:"Before b/p/m, 'n' sounds like 'm'. Before vowels, it's syllabic." },
    { issue:"っ (small tsu)",fix:"This marks a brief pause / consonant doubling before the next consonant." },
  ],
  KO: [
    { issue:"Tense consonants", fix:"ㄲ, ㄸ, ㅃ are tensed — tighten your throat slightly before releasing." },
    { issue:"Vowel ㅡ",        fix:"'eu' — round lips slightly, unrounded in the middle of the mouth." },
    { issue:"Final consonants", fix:"Korean syllable-final consonants are unreleased (no puff of air)." },
    { issue:"Intonation",       fix:"Korean sentences rise in the middle and fall at the end." },
  ],
};

/* ─── SAMPLE SENTENCES ──────────────────────────────────────── */
const SAMPLES = {
  ES: ["Buenos días, ¿cómo estás?", "Me llamo Mishka y estudio español.", "¿Dónde está la biblioteca?", "Quisiera una mesa para dos, por favor."],
  FR: ["Bonjour, comment allez-vous?", "Je voudrais un café, s'il vous plaît.", "Où est la station de métro?", "Je m'appelle Mishka et j'apprends le français."],
  JP: ["おはようございます。", "すみません、駅はどこですか？", "はじめまして、よろしくお願いします。", "このラーメンはとてもおいしいです。"],
  KO: ["안녕하세요, 만나서 반갑습니다.", "저는 미쉬카입니다.", "이 근처에 카페가 있나요?", "한국어를 공부하고 있어요."],
};

/* ─── FAKE SCORE GENERATOR ──────────────────────────────────── */
function generateScore(sentence, langCode) {
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  const seed  = sentence.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng   = (min, max, offset=0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const overall = rng(62, 96, 1);
  const fluency = rng(55, 98, 2);
  const accuracy = rng(58, 97, 3);
  const rhythm   = rng(50, 95, 4);

  const wordScores = words.map((w, i) => {
    const s = rng(45, 100, i * 7 + 10);
    return { word: w, score: s };
  });

  const tips = LANG_TIPS[langCode] || LANG_TIPS.ES;
  const selectedTips = tips.slice(0, rng(1, 3, 99));

  const comments = [
    overall >= 88 ? "Excellent work — your pronunciation is nearly native-level." : null,
    overall >= 75 && overall < 88 ? "Good effort! A few sounds need polish but your rhythm is solid." : null,
    overall < 75 ? "Keep practising — focus on the highlighted words below." : null,
  ].filter(Boolean);

  return { overall, fluency, accuracy, rhythm, wordScores, tips: selectedTips, comment: comments[0] };
}

/* ─── SCORE COLOR ───────────────────────────────────────────── */
function scoreColor(s) {
  if (s >= 85) return A_GREEN;
  if (s >= 65) return A_AMBER;
  return A_ROSE;
}

/* ─── ARC RING ──────────────────────────────────────────────── */
function ArcRing({ pct, size=110, stroke=8, color, label, value }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [d, setD] = useState(0);
  useEffect(() => { const t = setTimeout(() => setD(pct), 150); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ - circ * d / 100}
            style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:700,
            color:CREAM, lineHeight:1 }}>{value}</span>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
            color:MUTED, letterSpacing:"0.1em", marginTop:2 }}>/100</span>
        </div>
      </div>
      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
        letterSpacing:"0.14em", textTransform:"uppercase", color:MUTED }}>{label}</span>
    </div>
  );
}

/* ─── WAVEFORM BARS ─────────────────────────────────────────── */
function Waveform({ active, color }) {
  const BARS = 28;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3, height:40 }}>
      {Array.from({ length:BARS }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: active ? color : "rgba(255,255,255,0.08)",
          height: active ? `${20 + Math.random() * 80}%` : "20%",
          animation: active ? `barDance ${0.4 + (i % 5) * 0.15}s ease-in-out infinite` : "none",
          animationDelay: active ? `${(i * 0.05) % 0.8}s` : "0s",
          transition: "background 0.3s",
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function PronunciationPage() {
  const [langCode,   setLangCode]   = useState("ES");
  const [sentence,   setSentence]   = useState("");
  const [phase,      setPhase]      = useState("idle"); // idle | recording | analyzing | result
  const [result,     setResult]     = useState(null);
  const [history,    setHistory]    = useState([]);
  const [elapsed,    setElapsed]    = useState(0);
  const timerRef = useRef(null);

  const lm = LANGS.find(l => l.code === langCode) || LANGS[0];

  /* timer while recording */
  useEffect(() => {
    if (phase === "recording") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function startRecording() {
    if (!sentence.trim()) return;
    setPhase("recording");
    setResult(null);
  }

  function stopRecording() {
    setPhase("analyzing");
    const delay = 1800 + Math.random() * 1000;
    setTimeout(() => {
      const r = generateScore(sentence, langCode);
      setResult(r);
      setHistory(h => [{ sentence, lang:langCode, score:r.overall, date: new Date() }, ...h.slice(0,9)]);
      setPhase("result");
    }, delay);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
  }

  function useSample(s) {
    setSentence(s);
    setPhase("idle");
    setResult(null);
  }

  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:DARK,
      color:CREAM, overflow:"hidden", fontFamily:"'Oswald',sans-serif" }}>
      <style>{CSS}</style>

      {/* ── TOPBAR ── */}
      <header style={{ borderBottom:`1px solid ${BORD}`, padding:"14px 24px",
        background:CARD2, flexShrink:0, display:"flex", alignItems:"center", gap:16 }}>
        <div>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
            letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase" }}>
            Speaksphere / Pronunciation
          </span>
          <h1 style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, fontWeight:700,
            color:CREAM, letterSpacing:"0.04em", lineHeight:1, marginTop:2 }}>
            Pronunciation Studio
          </h1>
        </div>

        {/* Language selector */}
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLangCode(l.code); reset(); }}
              className="lang-pill"
              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px",
                borderRadius:4, border:`1px solid ${langCode===l.code ? `${l.c}50` : BORD}`,
                background: langCode===l.code ? `${l.c}15` : "transparent",
                cursor:"pointer", transition:"all .15s" }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:12, color:l.c }}>{l.script.slice(0,3)}</span>
              <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                letterSpacing:"0.08em", textTransform:"uppercase",
                color: langCode===l.code ? l.c : MUTED }}>{l.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── LEFT: INPUT + RECORDER ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column",
          padding:"24px 28px", overflowY:"auto", gap:20 }}>

          {/* Sentence input */}
          <div style={{ animation:"fadeUp .3s ease both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                letterSpacing:"0.16em", textTransform:"uppercase", color:MUTED }}>
                Type your sentence
              </span>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                color:DIM }}>{sentence.length} chars</span>
            </div>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", top:0, left:0, width:10, height:10,
                borderTop:`1px solid ${lm.c}60`, borderLeft:`1px solid ${lm.c}60`,
                pointerEvents:"none" }}/>
              <div style={{ position:"absolute", top:0, right:0, width:10, height:10,
                borderTop:`1px solid ${lm.c}60`, borderRight:`1px solid ${lm.c}60`,
                pointerEvents:"none" }}/>
              <textarea
                value={sentence}
                onChange={e => { setSentence(e.target.value); if (phase==="result") reset(); }}
                placeholder={lm.placeholder}
                rows={3}
                disabled={phase === "recording" || phase === "analyzing"}
                style={{ width:"100%", background:CARD, border:`1px solid ${BORD}`,
                  borderRadius:4, padding:"14px 16px", fontFamily:"'Lora',serif",
                  fontSize:16, color:CREAM, resize:"none", outline:"none",
                  lineHeight:1.6, transition:"border-color .2s",
                  borderColor: sentence ? `${lm.c}30` : BORD,
                  opacity: (phase==="recording"||phase==="analyzing") ? 0.6 : 1 }}
              />
            </div>

            {/* Sample sentences */}
            <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                letterSpacing:"0.12em", color:DIM, textTransform:"uppercase" }}>Try:</span>
              {SAMPLES[langCode].map((s, i) => (
                <button key={i} onClick={() => useSample(s)}
                  style={{ fontFamily:"'Lora',serif", fontSize:11, color:BODY,
                    fontStyle:"italic", background:"transparent",
                    border:`1px solid ${BORD2}`, borderRadius:3, padding:"3px 8px",
                    cursor:"pointer", transition:"all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=`${lm.c}40`; e.currentTarget.style.color=CREAM; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=BORD2; e.currentTarget.style.color=BODY; }}>
                  {s.length > 32 ? s.slice(0,32)+"…" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Recorder card */}
          <div style={{ background:CARD, border:`1px solid ${phase==="recording" ? `${lm.c}40` : BORD}`,
            borderRadius:6, padding:"28px 24px", display:"flex", flexDirection:"column",
            alignItems:"center", gap:20, transition:"border-color .3s",
            backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
            animation:"fadeUp .3s ease .05s both" }}>

            {/* Waveform */}
            <Waveform active={phase === "recording"} color={lm.c}/>

            {/* Timer */}
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:22,
              color: phase==="recording" ? lm.c : DIM,
              letterSpacing:"0.2em", transition:"color .3s",
              animation: phase==="recording" ? "pulse 1.5s infinite" : "none" }}>
              {fmtTime(elapsed)}
            </div>

            {/* Status text */}
            <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:BODY,
              fontStyle:"italic", textAlign:"center", minHeight:20 }}>
              {phase === "idle"      && (sentence.trim() ? "Ready to record — press the button below." : "Enter a sentence above to begin.")}
              {phase === "recording" && "Recording… speak clearly into your microphone."}
              {phase === "analyzing" && "Analysing your pronunciation…"}
              {phase === "result"    && "Analysis complete. See your results below."}
            </p>

            {/* Main button */}
            {phase === "idle" && (
              <button onClick={startRecording} disabled={!sentence.trim()} className="rec-btn"
                style={{ width:72, height:72, borderRadius:"50%",
                  background: sentence.trim() ? lm.c : DIM,
                  border:"none", cursor: sentence.trim() ? "pointer" : "default",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .2s", position:"relative" }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
                  stroke={DARK} strokeWidth="2" strokeLinecap="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
                </svg>
              </button>
            )}

            {phase === "recording" && (
              <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {/* Ripple rings */}
                {[0,1,2].map(i => (
                  <div key={i} style={{ position:"absolute", width:72, height:72,
                    borderRadius:"50%", border:`1px solid ${lm.c}`,
                    animation:`ripple 1.8s ease-out infinite`,
                    animationDelay:`${i * 0.6}s`, pointerEvents:"none" }}/>
                ))}
                <button onClick={stopRecording} className="rec-btn"
                  style={{ width:72, height:72, borderRadius:"50%",
                    background:A_ROSE, border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all .2s", zIndex:1 }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill={DARK}>
                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                  </svg>
                </button>
              </div>
            )}

            {phase === "analyzing" && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                <div style={{ display:"flex", gap:5 }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:lm.c,
                      animation:`pulse 1.2s ease-in-out infinite`,
                      animationDelay:`${i * 0.18}s` }}/>
                  ))}
                </div>
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                  letterSpacing:"0.16em", color:lm.c, textTransform:"uppercase" }}>
                  Processing audio…
                </span>
              </div>
            )}

            {phase === "result" && (
              <button onClick={reset} className="rec-btn"
                style={{ padding:"10px 28px", borderRadius:4, border:`1px solid ${lm.c}50`,
                  background:"transparent", color:lm.c, cursor:"pointer",
                  fontFamily:"'Oswald',sans-serif", fontSize:12,
                  letterSpacing:"0.1em", textTransform:"uppercase",
                  transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background=`${lm.c}18`; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
                Record Again
              </button>
            )}
          </div>

          {/* ── RESULTS ── */}
          {phase === "result" && result && (
            <div style={{ display:"flex", flexDirection:"column", gap:16,
              animation:"scoreIn .4s cubic-bezier(.34,1.2,.64,1) both" }}>

              {/* Score rings */}
              <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:6,
                padding:"24px", backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                      letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase" }}>
                      Pronunciation Score
                    </span>
                    <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:BODY,
                      fontStyle:"italic", marginTop:4 }}>{result.comment}</p>
                  </div>
                  <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:42, fontWeight:700,
                    color:scoreColor(result.overall), lineHeight:1 }}>
                    {result.overall}
                    <span style={{ fontSize:18, color:MUTED }}>/100</span>
                  </div>
                </div>

                <div style={{ display:"flex", justifyContent:"space-around" }}>
                  <ArcRing pct={result.fluency}  size={90} stroke={7}
                    color={scoreColor(result.fluency)}  label="Fluency"   value={result.fluency}/>
                  <ArcRing pct={result.accuracy} size={90} stroke={7}
                    color={scoreColor(result.accuracy)} label="Accuracy"  value={result.accuracy}/>
                  <ArcRing pct={result.rhythm}   size={90} stroke={7}
                    color={scoreColor(result.rhythm)}   label="Rhythm"    value={result.rhythm}/>
                </div>
              </div>

              {/* Word-by-word breakdown */}
              <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:6,
                padding:"20px 22px", backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                  letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase",
                  display:"block", marginBottom:14 }}>Word Breakdown</span>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {result.wordScores.map((ws, i) => (
                    <div key={i} className="word-chip"
                      style={{ display:"flex", flexDirection:"column", alignItems:"center",
                        gap:4, padding:"8px 12px", borderRadius:4, cursor:"default",
                        background:`${scoreColor(ws.score)}10`,
                        border:`1px solid ${scoreColor(ws.score)}35`,
                        transition:"all .15s" }}>
                      <span style={{ fontFamily:"'Lora',serif", fontSize:14,
                        color:CREAM, lineHeight:1 }}>{ws.word}</span>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                        color:scoreColor(ws.score), letterSpacing:"0.06em" }}>{ws.score}%</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div style={{ display:"flex", gap:14, marginTop:14 }}>
                  {[[A_GREEN,"85–100 Excellent"],[A_AMBER,"65–84 Good"],[A_ROSE,"<65 Needs work"]].map(([c,l]) => (
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:6, height:6, borderRadius:1, background:c }}/>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                        color:MUTED, letterSpacing:"0.08em" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {result.tips.length > 0 && (
                <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:6,
                  padding:"20px 22px", backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                    letterSpacing:"0.14em", color:lm.c, textTransform:"uppercase",
                    display:"block", marginBottom:14 }}>Coaching Tips · {lm.name}</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {result.tips.map((tip, i) => (
                      <div key={i} className="tip-card"
                        style={{ display:"flex", gap:12, padding:"12px 14px",
                          background:`${lm.c}07`, border:`1px solid ${lm.c}20`,
                          borderLeft:`3px solid ${lm.c}`, borderRadius:"0 4px 4px 0",
                          transition:"border-color .15s" }}>
                        <div style={{ flexShrink:0, marginTop:2 }}>
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                            stroke={lm.c} strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4M12 16h.01"/>
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
                            color:CREAM, letterSpacing:"0.04em", marginBottom:3 }}>{tip.issue}</p>
                          <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:BODY,
                            fontStyle:"italic", lineHeight:1.6 }}>{tip.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Attempts */}
              {history.length > 1 && (
                <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:6,
                  padding:"20px 22px", backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px" }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                    letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase",
                    display:"block", marginBottom:16 }}>Past Attempts</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {history.map((h, i) => {
                      const stars = Math.round((h.score / 100) * 5);
                      const hlm   = LANGS.find(l => l.code === h.lang) || LANGS[0];
                      return (
                        <div key={i}
                          style={{ display:"flex", alignItems:"center", gap:14,
                            padding:"10px 14px", borderRadius:4,
                            background: i === 0 ? `${hlm.c}10` : "rgba(255,255,255,0.02)",
                            border:`1px solid ${i === 0 ? `${hlm.c}25` : BORD2}`,
                            transition:"all .15s" }}>

                          {/* Rank */}
                          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                            color: i === 0 ? hlm.c : DIM, letterSpacing:"0.06em",
                            flexShrink:0, minWidth:20 }}>#{i+1}</span>

                          {/* Sentence */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:CREAM,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                              marginBottom:4 }}>
                              {h.sentence.length > 38 ? h.sentence.slice(0,38)+"…" : h.sentence}
                            </p>
                            {/* Stars */}
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <span style={{ display:"flex", gap:2 }}>
                                {[1,2,3,4,5].map(s => (
                                  <svg key={s} width={13} height={13} viewBox="0 0 14 14"
                                    fill={s <= stars ? scoreColor(h.score) : "none"}
                                    stroke={s <= stars ? scoreColor(h.score) : DIM}
                                    strokeWidth="1">
                                    <polygon points="7,1 8.8,5.2 13.5,5.6 10,8.7 11.1,13.3 7,10.8 2.9,13.3 4,8.7 0.5,5.6 5.2,5.2"/>
                                  </svg>
                                ))}
                              </span>
                              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                                color:MUTED, letterSpacing:"0.06em" }}>{hlm.name}</span>
                              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                                color:DIM, marginLeft:"auto" }}>
                                {h.date.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
                              </span>
                            </div>
                          </div>

                          {/* Score */}
                          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:20,
                            fontWeight:700, color:scoreColor(h.score), flexShrink:0 }}>
                            {h.score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Past attempts when not in result view */}
          {phase !== "result" && history.length > 0 && (
            <div style={{ background:CARD, border:`1px solid ${BORD}`, borderRadius:6,
              padding:"20px 22px", backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
              animation:"fadeUp .3s ease both" }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
                letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase",
                display:"block", marginBottom:16 }}>Past Attempts</span>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {history.map((h, i) => {
                  const stars = Math.round((h.score / 100) * 5);
                  const hlm   = LANGS.find(l => l.code === h.lang) || LANGS[0];
                  return (
                    <div key={i}
                      style={{ display:"flex", alignItems:"center", gap:14,
                        padding:"10px 14px", borderRadius:4,
                        background: i === 0 ? `${hlm.c}10` : "rgba(255,255,255,0.02)",
                        border:`1px solid ${i === 0 ? `${hlm.c}25` : BORD2}` }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10,
                        color: i === 0 ? hlm.c : DIM, flexShrink:0, minWidth:20 }}>#{i+1}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:CREAM,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:4 }}>
                          {h.sentence.length > 38 ? h.sentence.slice(0,38)+"…" : h.sentence}
                        </p>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ display:"flex", gap:2 }}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width={13} height={13} viewBox="0 0 14 14"
                                fill={s <= stars ? scoreColor(h.score) : "none"}
                                stroke={s <= stars ? scoreColor(h.score) : DIM}
                                strokeWidth="1">
                                <polygon points="7,1 8.8,5.2 13.5,5.6 10,8.7 11.1,13.3 7,10.8 2.9,13.3 4,8.7 0.5,5.6 5.2,5.2"/>
                              </svg>
                            ))}
                          </span>
                          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                            color:MUTED, letterSpacing:"0.06em" }}>{hlm.name}</span>
                          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                            color:DIM, marginLeft:"auto" }}>
                            {h.date.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:20,
                        fontWeight:700, color:scoreColor(h.score), flexShrink:0 }}>{h.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: HISTORY ── */}
        <div style={{ width:240, borderLeft:`1px solid ${BORD}`, background:CARD2,
          display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

          <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${BORD}` }}>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9,
              letterSpacing:"0.14em", color:MUTED, textTransform:"uppercase" }}>Session History</span>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, color:CREAM,
              marginTop:4, letterSpacing:"0.02em" }}>{history.length} attempts</p>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
            {history.length === 0 ? (
              <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:DIM,
                fontStyle:"italic", textAlign:"center", padding:"24px 16px", lineHeight:1.6 }}>
                Your scored attempts will appear here.
              </p>
            ) : history.map((h, i) => {
              const hlm = LANGS.find(l => l.code === h.lang) || LANGS[0];
              return (
                <div key={i} className="history-row"
                  style={{ padding:"10px 16px", borderBottom:`1px solid ${BORD2}`,
                    cursor:"default", transition:"background .12s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:13,
                      color:CREAM, letterSpacing:"0.02em", flex:1, marginRight:8,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {h.sentence.length > 24 ? h.sentence.slice(0,24)+"…" : h.sentence}
                    </span>
                    <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:15,
                      fontWeight:700, color:scoreColor(h.score), flexShrink:0 }}>{h.score}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                      color:hlm.c, letterSpacing:"0.08em" }}>{hlm.name}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8, color:DIM }}>
                      {h.date.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}
                    </span>
                  </div>
                  {/* Mini score bar */}
                  <div style={{ marginTop:6, height:2, borderRadius:1,
                    background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ height:"100%", borderRadius:1,
                      width:`${h.score}%`, background:scoreColor(h.score),
                      transition:"width .6s ease" }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Average score */}
          {history.length > 0 && (
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${BORD}` }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                letterSpacing:"0.12em", color:MUTED, textTransform:"uppercase",
                display:"block", marginBottom:6 }}>Session Average</span>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:28, fontWeight:700,
                  color:scoreColor(Math.round(history.reduce((a,h)=>a+h.score,0)/history.length)) }}>
                  {Math.round(history.reduce((a,h)=>a+h.score,0)/history.length)}
                </span>
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:MUTED }}>/100</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}