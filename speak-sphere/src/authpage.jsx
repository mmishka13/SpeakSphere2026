import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


// ─── CUSTOM SVG ICONS ────────────────────────────────────────
const IconGlobe = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="13" cy="13" r="11" stroke="#f0cc55" strokeWidth="1.4"/>
    <ellipse cx="13" cy="13" rx="5" ry="11" stroke="#f0cc55" strokeWidth="1" opacity=".6"/>
    <line x1="2" y1="13" x2="24" y2="13" stroke="#f0cc55" strokeWidth="1" opacity=".5"/>
    <line x1="4" y1="8"  x2="22" y2="8"  stroke="#f0cc55" strokeWidth="1" opacity=".3"/>
    <line x1="4" y1="18" x2="22" y2="18" stroke="#f0cc55" strokeWidth="1" opacity=".3"/>
  </svg>
);
const IconEye = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#c8aa80" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
    <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9z"/>
    <circle cx="9" cy="9" r="2.5"/>
    {!open && <line x1="2" y1="2" x2="16" y2="16"/>}
  </svg>
);
const IconArrow = ({ left = false, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {left ? <path d="M13 8H3M7 4l-4 4 4 4"/> : <path d="M3 8h10M9 4l4 4-4 4"/>}
  </svg>
);
const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="#5cb88a" opacity=".15" stroke="#5cb88a" strokeWidth="1"/>
    <path d="M5 9l3 3 5-6" stroke="#5cb88a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconX = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="#e87a5a" opacity=".15" stroke="#e87a5a" strokeWidth="1"/>
    <path d="M6 6l6 6M12 6l-6 6" stroke="#e87a5a" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconUser    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8aa80" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"/></svg>;
const IconMail    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8aa80" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><rect x="1" y="3" width="14" height="10" rx="2"/><path d="M1 5l7 5 7-5"/></svg>;
const IconLock    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8aa80" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="2"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>;
const IconCake    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8aa80" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><rect x="1" y="7" width="14" height="8" rx="1"/><path d="M4 7V5h8v2"/><path d="M8 1v4"/></svg>;
const IconGradCap = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8aa80" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><path d="M8 3L1 7l7 4 7-4-7-4z"/><path d="M3 9v4c0 1 2 2 5 2s5-1 5-2V9"/></svg>;

// ─── DATA ────────────────────────────────────────────────────
const LANGUAGES = ["Spanish","French","Japanese","Korean","German","Hindi"];
const GRADES    = ["6th","7th","8th","9th","10th","11th","12th","College Freshman","College Sophomore","College Junior","College Senior"];
const LEVELS    = [
  { label:"Complete Beginner", short:"Beginner",     dots:1 },
  { label:"Elementary",        short:"Elementary",   dots:2 },
  { label:"Intermediate",      short:"Intermediate", dots:3 },
  { label:"Upper-Intermediate",short:"Upper-Inter.", dots:4 },
  { label:"Advanced",          short:"Advanced",     dots:5 },
];

const LANG_SCRIPTS = { Spanish:"Hola", French:"Bonjour", Japanese:"こんにちは", Korean:"안녕하세요", German:"Hallo", Hindi:"नमस्ते" };

// ─── EXAM DATA ───────────────────────────────────────────────
const EXAM = {
  Spanish:[
    {id:1, section:"Vocabulary", q:"What does 'hablar' mean?",                                       opts:["To eat","To speak","To run","To sleep"],                answer:1},
    {id:2, section:"Vocabulary", q:"Which word means 'library'?",                                    opts:["librería","libro","biblioteca","libreta"],              answer:2},
    {id:3, section:"Vocabulary", q:"Choose the word for 'window'.",                                  opts:["puerta","ventana","techo","suelo"],                     answer:1},
    {id:4, section:"Vocabulary", q:"'Madrugada' refers to which time of day?",                       opts:["Noon","Evening","Early morning","Midnight exactly"],    answer:2},
    {id:5, section:"Vocabulary", q:"What does 'aunque' mean?",                                       opts:["because","therefore","even though","unless"],          answer:2},
    {id:6, section:"Grammar",    q:"Fill in: 'Ayer yo ___ al mercado.' (ir)",                        opts:["voy","fui","iba","iré"],                                answer:1},
    {id:7, section:"Grammar",    q:"Which is the correct reflexive? 'She washes herself.'",          opts:["Ella lava","Ella se lava","Ella la lava","Ella te lava"],answer:1},
    {id:8, section:"Grammar",    q:"Correct subjunctive: 'Quiero que tú ___ aquí.'",                 opts:["estás","estabas","estés","estarás"],                    answer:2},
    {id:9, section:"Grammar",    q:"'Hacía frío cuando llegué.' What tense is 'hacía'?",             opts:["Preterite","Imperfect","Future","Conditional"],         answer:1},
    {id:10,section:"Grammar",    q:"Which uses 'por' correctly?",                                    opts:["Estudio por ser médico","Lo compré por diez dólares","Voy por la mañana","Gracias por me ayudas"],answer:1},
    {id:11,section:"Reading",    passage:"'El tren salió a las ocho. María llegó tarde y lo perdió. Tuvo que esperar dos horas.'", q:"Why did María wait two hours?", opts:["Train was delayed","She missed it","No ticket","Station closed"], answer:1},
    {id:12,section:"Reading",    passage:"'El tren salió a las ocho. María llegó tarde y lo perdió. Tuvo que esperar dos horas.'", q:"What time did the train leave?", opts:["7 AM","8 AM","9 AM","10 AM"], answer:1},
    {id:13,section:"Reading",    passage:"'Oaxaca es famosa por su gastronomía, especialmente el mole. Miles de turistas la visitan cada año.'", q:"What is Oaxaca known for?", opts:["Beaches","Architecture","Food","Music"], answer:2},
    {id:14,section:"Reading",    passage:"'Oaxaca es famosa por su gastronomía, especialmente el mole. Miles de turistas la visitan cada año.'", q:"Who visits Oaxaca each year?", opts:["Students","Tourists","Farmers","Officials"], answer:1},
    {id:15,section:"Reading",    passage:"'Aunque llovía, los niños jugaban en el parque. Sus madres los observaban desde la ventana.'", q:"Where were the mothers watching from?", opts:["Park bench","Doorway","Window","Street"], answer:2},
  ],
  French:[
    {id:1, section:"Vocabulary", q:"What does 'parler' mean?",                                       opts:["To eat","To speak","To walk","To sleep"],               answer:1},
    {id:2, section:"Vocabulary", q:"Which word means 'window'?",                                     opts:["porte","fenêtre","toit","sol"],                         answer:1},
    {id:3, section:"Vocabulary", q:"Choose the word for 'library'.",                                 opts:["librairie","livre","bibliothèque","cahier"],            answer:2},
    {id:4, section:"Vocabulary", q:"What does 'pourtant' mean?",                                     opts:["because","however","unless","therefore"],              answer:1},
    {id:5, section:"Vocabulary", q:"'Crépuscule' refers to which time?",                             opts:["Dawn","Noon","Twilight","Midnight"],                    answer:2},
    {id:6, section:"Grammar",    q:"Fill in: 'Hier, je ___ au marché.' (aller)",                     opts:["vais","allais","suis allé","irai"],                     answer:2},
    {id:7, section:"Grammar",    q:"Which is correct? 'She washes herself.'",                        opts:["Elle lave","Elle se lave","Elle la lave","Elle te lave"],answer:1},
    {id:8, section:"Grammar",    q:"Correct subjunctive: 'Je veux que tu ___ ici.'",                 opts:["es","étais","sois","seras"],                            answer:2},
    {id:9, section:"Grammar",    q:"'Il faisait froid quand je suis arrivé.' Tense of 'faisait'?",   opts:["Passé composé","Imparfait","Futur","Conditionnel"],     answer:1},
    {id:10,section:"Grammar",    q:"Which uses 'depuis' correctly?",                                 opts:["J'étudie depuis deux ans","Je l'ai acheté depuis dix euros","Je pars depuis demain","Merci depuis votre aide"],answer:0},
    {id:11,section:"Reading",    passage:"'Le train est parti à huit heures. Marie est arrivée en retard et l'a manqué. Elle a dû attendre deux heures.'", q:"Why did Marie wait?", opts:["Train delayed","Missed train","No ticket","Station closed"], answer:1},
    {id:12,section:"Reading",    passage:"'Le train est parti à huit heures. Marie est arrivée en retard et l'a manqué. Elle a dû attendre deux heures.'", q:"What time did the train leave?", opts:["7h","8h","9h","10h"], answer:1},
    {id:13,section:"Reading",    passage:"'Paris est connue pour sa gastronomie, notamment les croissants. Des millions de touristes la visitent chaque année.'", q:"What is Paris known for?", opts:["Beaches","Architecture","Food","Music"], answer:2},
    {id:14,section:"Reading",    passage:"'Paris est connue pour sa gastronomie, notamment les croissants. Des millions de touristes la visitent chaque année.'", q:"Who visits Paris yearly?", opts:["Students","Millions of tourists","Farmers","Officials"], answer:1},
    {id:15,section:"Reading",    passage:"'Bien qu'il pleuvait, les enfants jouaient dans le parc. Leurs mères les observaient depuis la fenêtre.'", q:"Where were the mothers?", opts:["Park bench","Doorway","Window","Street"], answer:2},
  ],
};
["Japanese","Korean","German","Hindi"].forEach(l => { EXAM[l] = EXAM.Spanish; });

function getLevel(score){
  if(score<=4)  return {level:"Beginner",      color:"#5cb88a", pct:20};
  if(score<=8)  return {level:"Elementary",    color:"#7ab8e8", pct:40};
  if(score<=11) return {level:"Intermediate",  color:"#d4a843", pct:60};
  if(score<=13) return {level:"Upper-Inter.",  color:"#e8a05a", pct:80};
  return              {level:"Advanced",       color:"#e85a5a", pct:100};
}

// ─── ANIMATED BACKGROUND ─────────────────────────────────────
function Background({ children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#0d0702", overflow:"hidden" }} aria-hidden="true">
      {/* grid lines */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.04 }} aria-hidden="true">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d4a843" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      {/* ambient orbs */}
      <div style={{ position:"absolute", top:"-10%", left:"60%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(180,120,40,0.07) 0%, transparent 65%)", animation:"driftA 12s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", bottom:"-5%", left:"-5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(140,90,25,0.06) 0%, transparent 65%)", animation:"driftB 15s ease-in-out infinite" }}/>
      {/* grain */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`, backgroundSize:"300px", mixBlendMode:"overlay", opacity:0.6 }}/>
      {children}
    </div>
  );
}

// ─── ANIMATED COUNTER ────────────────────────────────────────
function Counter({ to, duration = 800 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let t0 = null;
    const raf = ts => { if(!t0) t0=ts; const p=Math.min((ts-t0)/duration,1); setN(Math.floor(p*to)); if(p<1) requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate();

  // Set mode based on URL path
  const initMode = window.location.pathname === "/login" ? "login" : "signup";
  const [mode, setMode]       = useState(initMode); // signup | login | exam | result
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [examIdx, setExamIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [picked,  setPicked]  = useState(null);
  const [shown,   setShown]   = useState(false);
  const cardRef = useRef(null);

  const [form, setForm] = useState({ name:"", email:"", password:"", age:"", grade:"", language:"", proficiency:"" });
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setError(""); };

  const validate = () => {
    if(!form.name.trim())            return "Please enter your full name.";
    if(!form.email.includes("@"))    return "Please enter a valid email.";
    if(form.password.length < 6)     return "Password must be at least 6 characters.";
    if(!form.age||+form.age<10||+form.age>25) return "Please enter a valid age (10–25).";
    if(!form.grade)                  return "Please select your grade.";
    if(!form.language)               return "Please choose a language to learn.";
    if(!form.proficiency)            return "Please select your current level.";
    return null;
  };

  const handleSignup = async e => {
    e.preventDefault();
    const err = validate(); if(err){ setError(err); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // simulate network
      setMode("exam"); setExamIdx(0); setAnswers({}); setPicked(null); setShown(false);
    } catch(e){
      setError("Something went wrong. Please try again.");
    }
    finally{ setLoading(false); }
  };

  const qs   = EXAM[form.language]||EXAM.Spanish;
  const curQ = qs[examIdx];
  const SECTIONS = ["Vocabulary","Grammar","Reading"];

  const pick = idx => {
    if(shown) return;
    setPicked(idx); setShown(true);
    setAnswers(a=>({...a,[examIdx]:idx}));
  };
  const next = () => {
    if(examIdx < qs.length-1){ setExamIdx(i=>i+1); setPicked(null); setShown(false); }
    else setMode("result");
  };

  const score  = Object.entries(answers).filter(([i,a])=>qs[i].answer===a).length;
  const result = getLevel(score);

  // ── STRENGTH ──────────────────────────────────────────────
  const pwScore = [/.{6,}/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].filter(r=>r.test(form.password)).length;
  const pwColor = ["","#e87a5a","#f0cc55","#7ab8e8","#5cb88a"][pwScore];
  const pwLabel = ["","Weak","Fair","Good","Strong"][pwScore];

  // ═══════════════════════════════════════════════════════════
  // SIGNUP PAGE
  // ═══════════════════════════════════════════════════════════
  if(mode==="signup"||mode==="login") return (
    <div style={p.root}>
      <style>{CSS}</style>
      <Background/>

      {/* ── NAV BAR ── */}
      <nav style={p.nav} aria-label="Site navigation">
        <a href="/" style={p.navLogo}>
          <IconGlobe size={22}/><span style={p.logoTxt}>SpeakSphere</span>
        </a>
        <div style={p.navRight}>
          <span style={p.navHint}>Already have an account?</span>
          <button style={p.navBtn} onClick={()=>setMode(mode==="signup"?"login":"signup")}>
            {mode==="signup"?"Log In":"Sign Up"}
          </button>
        </div>
      </nav>

      {/* ── MAIN LAYOUT ── */}
      <div style={p.layout}>

        {/* LEFT PANEL — decorative */}
        <aside style={p.leftPanel} aria-hidden="true">
          <div style={p.leftInner}>
            {/* big language word rotating */}
            <div style={p.bigWord} className="pulse-word">
              {LANG_SCRIPTS[form.language]||"Hello"}
            </div>
            <p style={p.leftLang}>{form.language||"Pick a language →"}</p>
            <div style={p.leftDivider}/>
            <p style={p.leftEyebrow}>WHY SPEAKSPHERE</p>
            {["AI-powered conversation tutor","Live peer tutoring sessions","Placement exam to find your level","Pronunciation coaching studio","Global pen pal matching","Community discussion forums"].map((f,i)=>(
              <div key={i} style={{ ...p.leftFeat, animationDelay:`${i*0.08}s` }} className="feat-in">
                <span style={p.leftFeatDot}/>
                <span style={p.leftFeatTxt}>{f}</span>
              </div>
            ))}
            {/* floating lang badges */}
            {LANGUAGES.map((l,i)=>(
              <div key={l} aria-hidden="true" style={{ ...p.floatingBadge, top:`${18+i*13}%`, right: i%2===0?"-10px":"-30px", animationDelay:`${i*0.4}s` }} className="float-badge">
                <span style={p.floatingBadgeCode}>{l.slice(0,2).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL — form */}
        <main style={p.rightPanel} id="main-content">
          <div style={p.formCard} className="card-enter" ref={cardRef}>

            {mode==="login" ? (
              <>
                <h1 style={p.formTitle}>Welcome back</h1>
                <p style={p.formSub}>Log in to continue your language journey.</p>
                <form onSubmit={async e=>{ e.preventDefault(); if(!form.email||!form.password){setError("Please fill in all fields.");return;} setLoading(true); await new Promise(r=>setTimeout(r,700)); setLoading(false); navigate("/dashboard"); }} noValidate>
                  <InputField icon={<IconMail/>}  label="Email"    id="li-email" type="email"    value={form.email}    onChange={v=>set("email",v)}    placeholder="you@example.com"/>
                  <InputField icon={<IconLock/>}  label="Password" id="li-pass"  type={showPw?"text":"password"} value={form.password} onChange={v=>set("password",v)} placeholder="Your password"
                    suffix={<button type="button" style={p.eyeBtn} onClick={()=>setShowPw(x=>!x)} aria-label={showPw?"Hide":"Show"}><IconEye open={showPw}/></button>}/>
                  {error&&<ErrMsg msg={error}/>}
                  <button type="submit" style={p.submitBtn}>{loading?<Dots/>:<><span>Log In</span><IconArrow/></>}</button>
                </form>
              </>
            ) : (
              <>
                <div style={p.formHeaderRow}>
                  <div>
                    <h1 style={p.formTitle}>Create your account</h1>
                    <p style={p.formSub}>Join thousands of students learning languages together.</p>
                  </div>
                  <div style={p.stepBadge} aria-label="Step 1 of 2: Profile">
                    <span style={p.stepNum}>1</span><span style={p.stepOf}>/2</span>
                    <span style={p.stepLbl}>Profile</span>
                  </div>
                </div>

                <form onSubmit={handleSignup} noValidate aria-label="Sign up">

                  {/* ── Row: Name + Email ── */}
                  <div style={p.row}>
                    <InputField icon={<IconUser/>}    label="Full name" id="name"  type="text"  value={form.name}  onChange={v=>set("name",v)}  placeholder="Alex Rivera" autoComplete="name"/>
                    <InputField icon={<IconMail/>}    label="Email"     id="email" type="email" value={form.email} onChange={v=>set("email",v)} placeholder="you@example.com" autoComplete="email"/>
                  </div>

                  {/* ── Password ── */}
                  <InputField icon={<IconLock/>} label="Password" id="pass" type={showPw?"text":"password"}
                    value={form.password} onChange={v=>set("password",v)} placeholder="Minimum 6 characters" autoComplete="new-password"
                    suffix={<button type="button" style={p.eyeBtn} onClick={()=>setShowPw(x=>!x)} aria-label={showPw?"Hide password":"Show password"}><IconEye open={showPw}/></button>}/>
                  {form.password&&(
                    <div style={p.strengthRow} aria-live="polite" aria-label={`Password strength: ${pwLabel}`}>
                      <div style={p.strengthBars}>
                        {[1,2,3,4].map(i=><div key={i} style={{ ...p.strengthBar, background:i<=pwScore?pwColor:"rgba(212,168,67,0.1)" }}/>)}
                      </div>
                      <span style={{ ...p.strengthLbl, color:pwColor }}>{pwLabel}</span>
                    </div>
                  )}

                  {/* ── Row: Age + Grade ── */}
                  <div style={p.row}>
                    <InputField icon={<IconCake/>}    label="Age"   id="age"   type="number" value={form.age}   onChange={v=>set("age",v)}   placeholder="16" min="10" max="25"/>
                    <SelectField icon={<IconGradCap/>} label="Grade" id="grade" value={form.grade} onChange={v=>set("grade",v)} options={GRADES} placeholder="Select grade"/>
                  </div>

                  {/* ── Language picker ── */}
                  <div style={p.block}>
                    <label style={p.label}>Language I want to learn</label>
                    <div style={p.langGrid} role="group" aria-label="Language selection">
                      {LANGUAGES.map(lang=>(
                        <button key={lang} type="button"
                          style={{ ...p.langTile, ...(form.language===lang?p.langTileOn:{}) }}
                          onClick={()=>set("language",lang)}
                          aria-pressed={form.language===lang}>
                          <span style={p.langTileScript}>{LANG_SCRIPTS[lang]}</span>
                          <span style={p.langTileName}>{lang}</span>
                          {form.language===lang&&<span style={p.langTileCheck} aria-hidden="true">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Proficiency ── */}
                  <div style={p.block}>
                    <label style={p.label}>Current level <em style={p.labelNote}>(the exam will verify)</em></label>
                    <div style={p.levelRow} role="group" aria-label="Proficiency level">
                      {LEVELS.map(lv=>(
                        <button key={lv.label} type="button"
                          style={{ ...p.levelBtn, ...(form.proficiency===lv.label?p.levelBtnOn:{}) }}
                          onClick={()=>set("proficiency",lv.label)}
                          aria-pressed={form.proficiency===lv.label}>
                          <div style={p.levelDots} aria-hidden="true">
                            {Array.from({length:5}).map((_,d)=>(
                              <div key={d} style={{ ...p.levelDot, background: d<lv.dots?(form.proficiency===lv.label?"#0d0702":"#d4a843"):"rgba(212,168,67,0.15)" }}/>
                            ))}
                          </div>
                          <span style={p.levelLbl}>{lv.short}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error&&<ErrMsg msg={error}/>}

                  <button type="submit" style={p.submitBtn} disabled={loading} aria-busy={loading}>
                    {loading?<Dots/>:<><span>Create Account & Start Exam</span><IconArrow/></>}
                  </button>

                  <p style={p.examNotice}>
                    Next: a 15-question {form.language||"language"} placement exam to find your perfect starting level.
                  </p>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // EXAM — full screen immersive
  // ═══════════════════════════════════════════════════════════
  if(mode==="exam"){
    const secIdx    = SECTIONS.indexOf(curQ.section);
    const qInSec    = qs.filter((q,i)=>i<=examIdx&&q.section===curQ.section).length;
    const totalInSec= 5;
    const pct       = ((examIdx+1)/qs.length)*100;

    return (
      <div style={e.root}>
        <style>{CSS}</style>
        <Background/>

        {/* ── TOP BAR ── */}
        <header style={e.topBar} aria-label="Exam progress">
          <a href="/" style={p.navLogo} aria-label="SpeakSphere">
            <IconGlobe size={20}/><span style={{ ...p.logoTxt, fontSize:16 }}>SpeakSphere</span>
          </a>
          {/* progress track */}
          <div style={e.progressWrap} aria-label={`Question ${examIdx+1} of ${qs.length}`}>
            <div style={e.progressTrack}>
              <div style={{ ...e.progressFill, width:`${pct}%` }} role="progressbar" aria-valuenow={examIdx+1} aria-valuemin={1} aria-valuemax={15}/>
            </div>
            <span style={e.progressCount}>{examIdx+1}<span style={{ opacity:0.5 }}>/15</span></span>
          </div>
          {/* section pills */}
          <div style={e.sectionPills} role="tablist">
            {SECTIONS.map((sec,i)=>{
              const done = i<secIdx;
              const active = sec===curQ.section;
              return(
                <div key={sec} role="tab" aria-selected={active}
                  style={{ ...e.secPill, ...(active?e.secPillActive:{}), ...(done?e.secPillDone:{}) }}>
                  {done?<IconCheck size={12}/>:<span style={e.secDot} aria-hidden="true"/>}
                  <span>{sec}</span>
                </div>
              );
            })}
          </div>
        </header>

        {/* ── EXAM BODY ── */}
        <div style={e.body}>

          {/* left: question */}
          <div style={e.qCol}>
            {/* section label */}
            <div style={e.secLabel}>
              <span style={e.secLabelDot} aria-hidden="true"/>
              <span style={e.secLabelTxt}>{curQ.section}</span>
              <span style={e.secLabelCount}>{qInSec}/{totalInSec}</span>
            </div>

            {/* passage */}
            {curQ.passage&&(
              <div style={e.passage} className="card-enter">
                <p style={e.passageTag}>READ THIS PASSAGE</p>
                <p style={e.passageTxt}>{curQ.passage}</p>
              </div>
            )}

            {/* question number + text */}
            <div style={e.qNumRow}>
              <span style={e.qNum} aria-hidden="true">Q{examIdx+1}</span>
              <div style={e.qNumLine} aria-hidden="true"/>
            </div>
            <h2 style={e.question} className="card-enter" key={examIdx}>{curQ.q}</h2>

            {/* feedback */}
            {shown&&(
              <div style={{ ...e.feedback, background: picked===curQ.answer?"rgba(92,184,138,0.08)":"rgba(232,122,90,0.08)", borderColor: picked===curQ.answer?"rgba(92,184,138,0.3)":"rgba(232,122,90,0.3)" }} className="card-enter">
                {picked===curQ.answer?<IconCheck size={20}/>:<IconX size={20}/>}
                <p style={{ ...e.feedbackTxt, color: picked===curQ.answer?"#5cb88a":"#e87a5a" }}>
                  {picked===curQ.answer
                    ? "Correct! Great job."
                    : `Not quite — the correct answer was ${String.fromCharCode(65+curQ.answer)}.`}
                </p>
              </div>
            )}

          </div>

          {/* right: options */}
          <div style={e.optCol}>
            <p style={e.chooseLabel}>CHOOSE YOUR ANSWER</p>
            <div style={e.opts} role="group" aria-label="Answer choices">
              {curQ.opts.map((opt,i)=>{
                let st = e.opt;
                if(shown){
                  if(i===curQ.answer)      st={...e.opt,...e.optRight};
                  else if(i===picked)      st={...e.opt,...e.optWrong};
                  else                     st={...e.opt,...e.optDim};
                } else if(picked===i)      st={...e.opt,...e.optPicked};
                return(
                  <button key={i} style={st} onClick={()=>pick(i)} disabled={shown}
                    aria-pressed={picked===i}
                    aria-label={`${String.fromCharCode(65+i)}: ${opt}`}
                    className={!shown?"opt-hover":""}>
                    <span style={e.optLetter}>{String.fromCharCode(65+i)}</span>
                    <span style={e.optTxt}>{opt}</span>
                    {shown&&i===curQ.answer&&<IconCheck size={16}/>}
                    {shown&&i===picked&&i!==curQ.answer&&<IconX size={16}/>}
                  </button>
                );
              })}
            </div>

            {/* mini score tracker */}
            <div style={e.scoreTracker} aria-label="Running score">
              <p style={e.scoreTrackerLbl}>RUNNING SCORE</p>
              <div style={e.scoreDots}>
                {qs.map((_,i)=>{
                  const answered = answers[i]!==undefined;
                  const correct  = answers[i]===qs[i].answer;
                  return <div key={i} style={{ ...e.scoreDot,
                    background: !answered?"rgba(212,168,67,0.1)":correct?"#5cb88a":"#e87a5a",
                    transform: i===examIdx?"scale(1.5)":"scale(1)",
                    boxShadow: answered&&correct ? "0 0 8px rgba(92,184,138,0.7)" : answered&&!correct ? "0 0 6px rgba(232,122,90,0.5)" : "none",
                    animation: answered&&correct&&i===examIdx-1 ? "dotPop 0.5s ease" : "none",
                  }} aria-hidden="true"/>;
                })}
              </div>
              <p style={e.scoreNum}>
                {Object.entries(answers).filter(([i,a])=>qs[i].answer===a).length}
                <span style={{ opacity:0.4 }}>/{Object.keys(answers).length||"–"}</span>
                <span style={e.scoreNumSub}> correct so far</span>
              </p>
            </div>

            {/* ── NEXT BUTTON lives here on the right for easy access ── */}
            {shown&&(
              <button style={e.nextBtn} onClick={next} className="card-enter"
                aria-label={examIdx<qs.length-1?"Go to next question":"See placement results"}>
                {examIdx<qs.length-1
                  ? <><span>Next Question</span><IconArrow/></>
                  : <><span>See My Results</span><IconArrow/></>}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════
  if(mode==="result") return (
    <div style={r.root}>
      <style>{CSS}</style>
      <Background/>

      <div style={r.card} className="card-enter">
        <a href="/" style={{ ...p.navLogo, marginBottom:28 }}>
          <IconGlobe size={22}/><span style={p.logoTxt}>SpeakSphere</span>
        </a>

        <p style={r.eyebrow}>PLACEMENT COMPLETE</p>
        <h1 style={r.title}><Counter to={score}/> / 15 correct</h1>
        <p style={r.sub}>Your {form.language} placement result:</p>

        {/* level dial */}
        <div style={r.dialWrap} aria-label={`Placement level: ${result.level}`}>
          <svg width="180" height="100" viewBox="0 0 180 100" aria-hidden="true">
            <path d="M10 90 A80 80 0 0 1 170 90" fill="none" stroke="rgba(212,168,67,0.1)" strokeWidth="12" strokeLinecap="round"/>
            <path d="M10 90 A80 80 0 0 1 170 90" fill="none" stroke={result.color} strokeWidth="12" strokeLinecap="round"
              strokeDasharray="251" strokeDashoffset={251-(251*result.pct/100)}
              style={{ transition:"stroke-dashoffset 1.2s ease", filter:`drop-shadow(0 0 6px ${result.color}66)` }}/>
            <text x="90" y="82" textAnchor="middle" fontFamily="'Oswald',sans-serif" fontSize="22" fontWeight="700" fill={result.color}>{result.level}</text>
          </svg>
        </div>

        {/* breakdown */}
        <div style={r.breakdown} aria-label="Section breakdown">
          {SECTIONS.map(sec=>{
            const sqs = qs.map((q,i)=>({...q,idx:i})).filter(q=>q.section===sec);
            const ok  = sqs.filter(q=>answers[q.idx]===q.answer).length;
            return(
              <div key={sec} style={r.bRow}>
                <span style={r.bLabel}>{sec}</span>
                <div style={r.bTrack}><div style={{ ...r.bFill, width:`${(ok/5)*100}%` }}/></div>
                <span style={r.bScore}>{ok}/5</span>
              </div>
            );
          })}
        </div>

        <p style={r.note}>This will be your starting level. You can adjust it anytime from your profile.</p>
        <button style={{ ...p.submitBtn, maxWidth:360, margin:"0 auto" }} onClick={()=>navigate('/dashboard')}>
          <span>Go to My Dashboard</span><IconArrow/>
        </button>
      </div>
    </div>
  );
}

// ─── SMALL COMPONENTS ────────────────────────────────────────
function InputField({ icon, label, id, type, value, onChange, placeholder, autoComplete, min, max, suffix }) {
  return (
    <div style={p.block}>
      <label style={p.label} htmlFor={id}>{label}</label>
      <div style={p.inputWrap}>
        <span style={p.inputIcon} aria-hidden="true">{icon}</span>
        <input id={id} type={type} value={value} placeholder={placeholder}
          autoComplete={autoComplete} min={min} max={max}
          onChange={e=>onChange(e.target.value)}
          style={p.input} aria-label={label}/>
        {suffix&&<span style={p.inputSuffix}>{suffix}</span>}
      </div>
    </div>
  );
}
function SelectField({ icon, label, id, value, onChange, options, placeholder }) {
  return (
    <div style={p.block}>
      <label style={p.label} htmlFor={id}>{label}</label>
      <div style={p.inputWrap}>
        <span style={p.inputIcon} aria-hidden="true">{icon}</span>
        <select id={id} value={value} onChange={e=>onChange(e.target.value)}
          style={{ ...p.input, ...p.select }} aria-label={label}>
          <option value="" disabled>{placeholder}</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}
function ErrMsg({ msg }) {
  return <p style={p.errMsg} role="alert" aria-live="polite">{msg}</p>;
}
function Dots() {
  return <span style={{ display:"flex",gap:4,alignItems:"center" }} aria-label="Loading">
    {[0,1,2].map(i=><span key={i} style={{ width:6,height:6,borderRadius:"50%",background:"#0d0702",animation:`dotPulse 1s ${i*0.2}s ease-in-out infinite` }}/>)}
  </span>;
}

// ─── STYLE TOKENS ────────────────────────────────────────────
const GOLD   = "#d4a843", GOLD_L="#f0cc55", CREAM="#f5ede0", MUTED="#c8aa80", DARK="#0d0702", CARD="#1b0f06", SURF="#0d0702", BDR="rgba(212,168,67,0.20)";

// signup styles
const p = {
  root:       { minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", fontFamily:"'Lora',Georgia,serif", color:CREAM },
  nav:        { position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:60, background:"rgba(20,11,4,0.92)", borderBottom:`1px solid ${BDR}`, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" },
  navLogo:    { display:"flex", alignItems:"center", gap:9, textDecoration:"none" },
  logoTxt:    { fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:600, color:GOLD_L, letterSpacing:"0.05em" },
  navRight:   { display:"flex", alignItems:"center", gap:14 },
  navHint:    { fontSize:12, color:MUTED, fontFamily:"'Oswald',sans-serif", letterSpacing:"0.05em" },
  navBtn:     { fontFamily:"'Oswald',sans-serif", fontSize:12, letterSpacing:"0.07em", color:CREAM, background:GOLD, border:"none", borderRadius:5, padding:"6px 14px", cursor:"pointer", fontWeight:600 },
  layout:     { display:"flex", flex:1, marginTop:60, minHeight:"calc(100vh - 60px)", position:"relative", zIndex:1 },

  // LEFT PANEL
  leftPanel:  { width:340, flexShrink:0, borderRight:`1px solid ${BDR}`, position:"relative", overflow:"hidden", display:"flex", alignItems:"center" },
  leftInner:  { padding:"48px 36px", position:"relative", zIndex:2 },
  bigWord:    { fontFamily:"'Oswald',sans-serif", fontSize:64, fontWeight:700, color:GOLD, opacity:0.18, lineHeight:1, marginBottom:4, letterSpacing:"-0.02em", userSelect:"none" },
  leftLang:   { fontFamily:"'Oswald',sans-serif", fontSize:13, color:GOLD, letterSpacing:"0.1em", marginBottom:24 },
  leftDivider:{ width:32, height:2, background:GOLD, borderRadius:2, marginBottom:20, opacity:0.4 },
  leftEyebrow:{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.2em", color:MUTED, marginBottom:16, textTransform:"uppercase" },
  leftFeat:   { display:"flex", alignItems:"flex-start", gap:9, marginBottom:12, animation:"featIn 0.5s ease both" },
  leftFeatDot:{ width:5, height:5, borderRadius:"50%", background:GOLD, flexShrink:0, marginTop:5, opacity:0.7 },
  leftFeatTxt:{ fontSize:12, color:MUTED, lineHeight:1.55, fontFamily:"'Lora',serif" },
  floatingBadge:{ position:"absolute", width:38, height:38, borderRadius:"50%", background:"rgba(212,168,67,0.07)", border:`1px solid rgba(212,168,67,0.15)`, display:"flex", alignItems:"center", justifyContent:"center", animation:"floatBadge 4s ease-in-out infinite" },
  floatingBadgeCode:{ fontFamily:"'Oswald',sans-serif", fontSize:10, fontWeight:700, color:GOLD, letterSpacing:"0.06em" },

  // RIGHT FORM
  rightPanel: { flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", overflowY:"auto" },
  formCard:   { width:"100%", maxWidth:540, background:CARD, border:`1px solid ${BDR}`, borderRadius:18, padding:"36px 32px", boxShadow:"0 24px 80px rgba(0,0,0,0.55)", position:"relative" },
  formHeaderRow:{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, gap:12 },
  formTitle:  { fontFamily:"'Oswald',sans-serif", fontSize:24, fontWeight:700, color:CREAM, lineHeight:1.2, marginBottom:6 },
  formSub:    { fontSize:12, color:MUTED, lineHeight:1.6, fontFamily:"'Lora',serif" },
  stepBadge:  { flexShrink:0, background:"rgba(212,168,67,0.08)", border:`1px solid rgba(212,168,67,0.2)`, borderRadius:10, padding:"8px 14px", textAlign:"center" },
  stepNum:    { fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:700, color:GOLD, display:"block", lineHeight:1 },
  stepOf:     { fontFamily:"'Oswald',sans-serif", fontSize:12, color:MUTED },
  stepLbl:    { display:"block", fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.1em", color:MUTED, marginTop:2 },
  row:        { display:"flex", gap:12 },
  block:      { marginBottom:16 },
  label:      { display:"block", fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.12em", color:MUTED, textTransform:"uppercase", marginBottom:7 },
  labelNote:  { fontSize:10, fontFamily:"'Lora',serif", fontStyle:"italic", color:"rgba(154,125,90,0.55)", textTransform:"none", letterSpacing:"0.02em" },
  inputWrap:  { position:"relative", display:"flex", alignItems:"center" },
  inputIcon:  { position:"absolute", left:11, display:"flex", alignItems:"center", pointerEvents:"none" },
  input:      { width:"100%", background:SURF, border:`1px solid rgba(212,168,67,0.20)`, borderRadius:8, padding:"10px 12px 10px 34px", fontSize:13, color:CREAM, fontFamily:"'Lora',serif", outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", WebkitAppearance:"none" },
  select:     { cursor:"pointer" },
  inputSuffix:{ position:"absolute", right:8, display:"flex", alignItems:"center" },
  eyeBtn:     { background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center" },
  strengthRow:{ display:"flex", alignItems:"center", gap:8, marginTop:-10, marginBottom:14 },
  strengthBars:{ display:"flex", gap:4, flex:1 },
  strengthBar:{ height:3, flex:1, borderRadius:2, transition:"background 0.3s" },
  strengthLbl:{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.1em", transition:"color 0.3s" },

  // LANGUAGE TILES
  langGrid:   { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 },
  langTile:   { background:SURF, border:`1px solid rgba(212,168,67,0.12)`, borderRadius:10, padding:"10px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", transition:"all 0.2s", position:"relative", overflow:"hidden" },
  langTileOn: { background:"rgba(212,168,67,0.12)", borderColor:`rgba(212,168,67,0.45)` },
  langTileScript:{ fontFamily:"serif", fontSize:16, color:GOLD, opacity:0.75, lineHeight:1 },
  langTileName:  { fontFamily:"'Oswald',sans-serif", fontSize:11, letterSpacing:"0.07em", color:CREAM },
  langTileCheck: { position:"absolute", top:4, right:6, fontSize:10, color:GOLD, fontWeight:700 },

  // LEVEL BUTTONS
  levelRow:   { display:"flex", gap:7, flexWrap:"wrap" },
  levelBtn:   { flex:"1 1 80px", background:SURF, border:`1px solid rgba(212,168,67,0.12)`, borderRadius:9, padding:"10px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", transition:"all 0.2s" },
  levelBtnOn: { background:"rgba(212,168,67,0.14)", borderColor:"rgba(212,168,67,0.45)" },
  levelDots:  { display:"flex", gap:3 },
  levelDot:   { width:5, height:5, borderRadius:"50%", transition:"background 0.2s" },
  levelLbl:   { fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.08em", color:MUTED, whiteSpace:"nowrap" },

  errMsg:     { fontSize:12, color:"#e87a5a", background:"rgba(232,122,90,0.07)", border:"1px solid rgba(232,122,90,0.2)", borderRadius:7, padding:"8px 12px", marginBottom:14, fontFamily:"'Lora',serif" },
  submitBtn:  { width:"100%", background:GOLD, border:"none", borderRadius:9, padding:"13px 20px", fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:"0.08em", fontWeight:600, color:CREAM, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 4px 20px rgba(150,100,30,0.22)", transition:"transform 0.15s, opacity 0.15s", marginTop:6 },
  examNotice: { fontSize:11, color:MUTED, textAlign:"center", marginTop:12, lineHeight:1.6, fontFamily:"'Lora',serif", fontStyle:"italic" },
};

// exam styles
const e = {
  root:       { minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", fontFamily:"'Lora',Georgia,serif", color:CREAM },
  topBar:     { position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", gap:20, padding:"0 32px", height:58, background:"rgba(20,11,4,0.95)", borderBottom:`1px solid ${BDR}`, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", flexWrap:"wrap" },
  progressWrap:{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:160 },
  progressTrack:{ flex:1, height:5, background:"rgba(212,168,67,0.1)", borderRadius:3, overflow:"hidden" },
  progressFill: { height:"100%", background:GOLD, borderRadius:3, transition:"width 0.5s ease" },
  progressCount:{ fontFamily:"'Oswald',sans-serif", fontSize:13, color:GOLD, letterSpacing:"0.06em", flexShrink:0 },
  sectionPills:{ display:"flex", gap:6 },
  secPill:    { display:"flex", alignItems:"center", gap:5, fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.1em", color:MUTED, background:"rgba(35,18,8,0.8)", border:`1px solid rgba(212,168,67,0.1)`, borderRadius:100, padding:"4px 12px", transition:"all 0.25s" },
  secPillActive:{ color:GOLD_L, borderColor:"rgba(212,168,67,0.35)", background:"rgba(212,168,67,0.08)" },
  secPillDone:{ color:"#5cb88a", borderColor:"rgba(92,184,138,0.25)", background:"rgba(92,184,138,0.05)" },
  secDot:     { width:5, height:5, borderRadius:"50%", background:"currentColor", display:"inline-block" },

  body:       { flex:1, display:"flex", position:"relative", zIndex:1, minHeight:"calc(100vh - 58px)" },
  qCol:       { flex:"0 0 52%", padding:"64px 56px 64px 64px", display:"flex", flexDirection:"column", justifyContent:"center", borderRight:`1px solid ${BDR}` },
  optCol:     { flex:1, padding:"64px 48px 64px 52px", display:"flex", flexDirection:"column", justifyContent:"center", gap:0 },

  secLabel:   { display:"flex", alignItems:"center", gap:10, marginBottom:36 },
  secLabelDot:{ width:9, height:9, borderRadius:"50%", background:GOLD, flexShrink:0, boxShadow:`0 0 8px rgba(212,168,67,0.6)` },
  secLabelTxt:{ fontFamily:"'Oswald',sans-serif", fontSize:12, letterSpacing:"0.18em", color:GOLD, textTransform:"uppercase" },
  secLabelCount:{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:MUTED, letterSpacing:"0.08em", marginLeft:"auto" },

  passage:    { background:"rgba(35,18,8,0.85)", border:`1px solid rgba(212,168,67,0.18)`, borderRadius:12, padding:"20px 24px", marginBottom:36, borderLeft:`3px solid rgba(212,168,67,0.5)` },
  passageTag: { fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.22em", color:GOLD, marginBottom:10, textTransform:"uppercase" },
  passageTxt: { fontSize:15, color:"#ccb898", lineHeight:1.85, fontFamily:"'Lora',serif", fontStyle:"italic" },

  qNumRow:    { display:"flex", alignItems:"center", gap:16, marginBottom:20 },
  qNum:       { fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700, color:"rgba(212,168,67,0.4)", letterSpacing:"0.12em", flexShrink:0 },
  qNumLine:   { flex:1, height:1, background:"rgba(212,168,67,0.12)" },
  // ↑ bigger, more air, bolder question text
  question:   { fontFamily:"'Oswald',sans-serif", fontSize:"clamp(22px,2.6vw,32px)", fontWeight:700, color:"#f0e2cc", lineHeight:1.3, marginBottom:36, letterSpacing:"-0.01em" },

  feedback:   { display:"flex", alignItems:"flex-start", gap:12, border:"1px solid", borderRadius:12, padding:"16px 20px", marginBottom:0 },
  feedbackTxt:{ fontSize:14, lineHeight:1.65, fontFamily:"'Lora',serif", fontStyle:"italic" },
  nextBtn:    { display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", fontFamily:"'Oswald',sans-serif", fontSize:15, letterSpacing:"0.08em", fontWeight:600, color:CREAM, background:GOLD, border:"none", borderRadius:10, padding:"16px 22px", cursor:"pointer", marginTop:14, boxShadow:"0 6px 28px rgba(150,100,30,0.32)", transition:"transform 0.15s, box-shadow 0.15s" },

  chooseLabel:{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.22em", color:MUTED, marginBottom:18, textTransform:"uppercase" },
  opts:       { display:"flex", flexDirection:"column", gap:12, marginBottom:28 },
  // bigger padding, more visual weight per option
  opt:        { display:"flex", alignItems:"center", gap:16, width:"100%", background:SURF, border:`1px solid rgba(212,168,67,0.1)`, borderRadius:12, padding:"16px 20px", cursor:"pointer", transition:"all 0.22s", textAlign:"left", position:"relative", overflow:"hidden" },
  optPicked:  { borderColor:"rgba(212,168,67,0.6)", background:"rgba(212,168,67,0.07)", boxShadow:`0 0 0 1px rgba(212,168,67,0.25), 0 0 20px rgba(212,168,67,0.08)` },
  optRight:   { borderColor:"rgba(92,184,138,0.6)", background:"rgba(92,184,138,0.09)", boxShadow:`0 0 0 1px rgba(92,184,138,0.2), 0 0 20px rgba(92,184,138,0.07)` },
  optWrong:   { borderColor:"rgba(232,122,90,0.6)", background:"rgba(232,122,90,0.08)", boxShadow:`0 0 0 1px rgba(232,122,90,0.2)` },
  optDim:     { opacity:0.32, filter:"saturate(0.4)" },
  optLetter:  { fontFamily:"'Oswald',sans-serif", fontSize:13, fontWeight:700, color:GOLD, letterSpacing:"0.1em", width:24, flexShrink:0 },
  optTxt:     { fontSize:15, color:CREAM, fontFamily:"'Lora',serif", flex:1, lineHeight:1.45 },

  scoreTracker:{ background:"rgba(20,11,4,0.65)", border:`1px solid ${BDR}`, borderRadius:14, padding:"20px 22px" },
  scoreTrackerLbl:{ fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.2em", color:MUTED, marginBottom:14, textTransform:"uppercase" },
  scoreDots:  { display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 },
  scoreDot:   { width:11, height:11, borderRadius:"50%", transition:"background 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease" },
  scoreNum:   { fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:700, color:GOLD, lineHeight:1 },
  scoreNumSub:{ fontSize:11, color:MUTED, fontWeight:400, letterSpacing:"0.04em" },
};

// result styles
const r = {
  root:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative", fontFamily:"'Lora',Georgia,serif", color:CREAM },
  card:  { width:"100%", maxWidth:480, background:CARD, border:`1px solid ${BDR}`, borderRadius:18, padding:"40px 36px", boxShadow:"0 24px 80px rgba(0,0,0,0.55)", position:"relative", zIndex:1, textAlign:"center" },
  eyebrow:{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.2em", color:GOLD, marginBottom:10 },
  title: { fontFamily:"'Oswald',sans-serif", fontSize:42, fontWeight:700, color:CREAM, marginBottom:6 },
  sub:   { fontSize:13, color:MUTED, marginBottom:12, fontFamily:"'Lora',serif" },
  dialWrap:{ display:"flex", justifyContent:"center", margin:"8px 0 24px" },
  breakdown:{ marginBottom:20 },
  bRow:  { display:"flex", alignItems:"center", gap:10, marginBottom:10 },
  bLabel:{ fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.1em", color:MUTED, width:72, textAlign:"right", textTransform:"uppercase" },
  bTrack:{ flex:1, height:6, background:"rgba(212,168,67,0.1)", borderRadius:3, overflow:"hidden" },
  bFill: { height:"100%", background:GOLD, borderRadius:3, transition:"width 1s ease" },
  bScore:{ fontFamily:"'Oswald',sans-serif", fontSize:11, color:GOLD, width:28, textAlign:"left", letterSpacing:"0.06em" },
  note:  { fontSize:11, color:MUTED, fontStyle:"italic", fontFamily:"'Lora',serif", marginBottom:22, lineHeight:1.65 },
};

// ─── GLOBAL CSS ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }

  :focus-visible { outline: 2px solid #d4a843; outline-offset: 3px; border-radius: 4px; }

  input:focus, select:focus {
    border-color: rgba(212,168,67,0.5) !important;
    box-shadow: 0 0 0 3px rgba(212,168,67,0.08), 0 0 12px rgba(212,168,67,0.06) !important;
  }
  input::placeholder { color: rgba(154,125,90,0.38); }
  select option { background: #0d0702; color: #f5ede0; }

  button:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Card entrance */
  .card-enter { animation: fadeUp 0.4s ease both; }

  /* Answer option hover — slide + shimmer border */
  .opt-hover {
    position: relative;
  }
  .opt-hover::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid transparent;
    background: linear-gradient(135deg, rgba(212,168,67,0) 0%, rgba(212,168,67,0.18) 50%, rgba(212,168,67,0) 100%) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }
  .opt-hover:hover::before { opacity: 1; }
  .opt-hover:hover {
    border-color: rgba(212,168,67,0.4) !important;
    background: rgba(212,168,67,0.06) !important;
    transform: translateX(5px) !important;
    box-shadow: 0 0 0 1px rgba(212,168,67,0.15), 0 4px 20px rgba(0,0,0,0.3) !important;
  }
  .opt-hover:active {
    transform: translateX(5px) scale(0.99) !important;
  }

  /* Next button lift on hover */
  button[aria-label*="next question"]:hover,
  button[aria-label*="results"]:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 36px rgba(150,100,30,0.42) !important;
  }

  /* Submit button hover */
  button[type="submit"]:hover:not(:disabled) {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 30px rgba(150,100,30,0.38) !important;
    opacity: 1 !important;
  }

  /* Form card subtle top accent line */
  .card-enter::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,168,67,0.35), transparent);
    border-radius: 1px;
    pointer-events: none;
  }

  /* Lang tile hover */
  button[aria-pressed]:hover {
    border-color: rgba(212,168,67,0.35) !important;
    transform: translateY(-2px) !important;
  }
  button[aria-pressed="true"] {
    box-shadow: 0 0 0 1px rgba(212,168,67,0.3), 0 4px 16px rgba(150,100,30,0.2) !important;
  }

  .feat-in  { animation: featIn   0.5s ease both; }
  .pulse-word { animation: pulseWord 3s ease-in-out infinite; }
  .float-badge { animation: floatBadge 4s ease-in-out infinite; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes featIn    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulseWord { 0%,100%{opacity:0.15} 50%{opacity:0.26} }
  @keyframes floatBadge{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes driftA    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,20px)} }
  @keyframes driftB    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-25px)} }
  @keyframes dotPulse  { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* Score dot pop when a correct answer is registered */
  @keyframes dotPop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.9); box-shadow: 0 0 14px rgba(92,184,138,0.9); }
    65%  { transform: scale(0.85); }
    100% { transform: scale(1); box-shadow: 0 0 8px rgba(92,184,138,0.5); }
  }

  /* Wrong dot shake */
  @keyframes dotShake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-3px); }
    40%     { transform: translateX(3px); }
    60%     { transform: translateX(-2px); }
    80%     { transform: translateX(2px); }
  }

  /* Progress bar shimmer */
  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position: 200% center; }
  }

  @media (max-width: 860px) {
    [data-leftpanel] { display: none !important; }
    [data-exam-body] { flex-direction: column !important; }
  }
  @media (max-width: 600px) {
    [data-row] { flex-direction: column !important; }
    [data-langgrid] { grid-template-columns: repeat(2,1fr) !important; }
  }
`;