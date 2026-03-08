import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// CUSTOM SVG ICONS  (no emojis anywhere)
// ─────────────────────────────────────────────

const IconAI = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="36" height="36" rx="10" stroke="#c9a05a" strokeWidth="1.2"/>
    <circle cx="19" cy="15" r="5" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M10 28c0-4.418 4.03-8 9-8s9 3.582 9 8" stroke="#c9a05a" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M26 9l2-2M26 9h3M26 9v3" stroke="#e8c07a" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <rect x="1" y="5" width="36" height="32" rx="6" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M1 13h36" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M12 1v8M26 1v8" stroke="#c9a05a" strokeWidth="1.2" strokeLinecap="round"/>
    <rect x="8" y="18" width="5" height="5" rx="1" fill="#c9a05a" opacity=".5"/>
    <rect x="16.5" y="18" width="5" height="5" rx="1" fill="#c9a05a" opacity=".5"/>
    <rect x="25" y="18" width="5" height="5" rx="1" fill="#e8c07a" opacity=".7"/>
    <rect x="8" y="26" width="5" height="5" rx="1" fill="#c9a05a" opacity=".3"/>
    <rect x="16.5" y="26" width="5" height="5" rx="1" fill="#c9a05a" opacity=".3"/>
  </svg>
);

const IconMic = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <rect x="13" y="2" width="12" height="20" rx="6" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M6 19c0 7.18 5.82 13 13 13s13-5.82 13-13" stroke="#c9a05a" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M19 32v4" stroke="#c9a05a" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="14" y1="36" x2="24" y2="36" stroke="#e8c07a" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="19" y1="8" x2="19" y2="14" stroke="#e8c07a" strokeWidth="1" strokeLinecap="round" opacity=".6"/>
  </svg>
);

const IconBook = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <path d="M5 6h16a4 4 0 014 4v22a4 4 0 01-4 4H5V6z" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M33 6H21a2 2 0 00-2 2v22a2 2 0 002 2h12V6z" stroke="#c9a05a" strokeWidth="1.2"/>
    <line x1="9" y1="13" x2="17" y2="13" stroke="#e8c07a" strokeWidth="1" strokeLinecap="round"/>
    <line x1="9" y1="18" x2="17" y2="18" stroke="#c9a05a" strokeWidth="1" strokeLinecap="round" opacity=".5"/>
    <line x1="9" y1="23" x2="14" y2="23" stroke="#c9a05a" strokeWidth="1" strokeLinecap="round" opacity=".4"/>
  </svg>
);

const IconPenPal = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <circle cx="13" cy="13" r="7" stroke="#c9a05a" strokeWidth="1.2"/>
    <circle cx="27" cy="13" r="7" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M2 33c0-5 4.925-9 11-9" stroke="#c9a05a" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M36 33c0-5-4.925-9-11-9" stroke="#c9a05a" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M16 28h6" stroke="#e8c07a" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M19 25v6" stroke="#e8c07a" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconForum = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
    <path d="M3 5h24a2 2 0 012 2v14a2 2 0 01-2 2H9l-6 5V7a2 2 0 012-2z" stroke="#c9a05a" strokeWidth="1.2"/>
    <path d="M13 26h16a2 2 0 012 2v6l-4-3H13a2 2 0 01-2-2v-1" stroke="#c9a05a" strokeWidth="1.2" opacity=".6"/>
    <line x1="9" y1="11" x2="21" y2="11" stroke="#e8c07a" strokeWidth="1" strokeLinecap="round"/>
    <line x1="9" y1="16" x2="16" y2="16" stroke="#c9a05a" strokeWidth="1" strokeLinecap="round" opacity=".5"/>
  </svg>
);

// Hexagonal language monogram badge
const LangBadge = ({ code, size = 52 }) => {
  const cx = size / 2, cy = size / 2, r = size * 0.44;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <polygon points={hex} stroke="#c9a05a" strokeWidth="1.2" fill="rgba(61,36,20,0.55)"/>
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize={size * 0.26}
        fill="#e8c07a" letterSpacing="1">{code}</text>
    </svg>
  );
};

// Circular hero orb badge
const OrbBadge = ({ code, size = 60 }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
    <circle cx={size/2} cy={size/2} r={size/2 - 1} stroke="#c9a05a" strokeWidth="1" fill="rgba(30,12,4,0.82)"/>
    <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
      fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize={size * 0.28}
      fill="#e8c07a" letterSpacing="1">{code}</text>
  </svg>
);

const IconGlobe = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="13" cy="13" r="11" stroke="#e8c07a" strokeWidth="1.4"/>
    <ellipse cx="13" cy="13" rx="5" ry="11" stroke="#e8c07a" strokeWidth="1" opacity=".6"/>
    <line x1="2" y1="13" x2="24" y2="13" stroke="#e8c07a" strokeWidth="1" opacity=".5"/>
    <line x1="4" y1="8" x2="22" y2="8" stroke="#e8c07a" strokeWidth="1" opacity=".3"/>
    <line x1="4" y1="18" x2="22" y2="18" stroke="#e8c07a" strokeWidth="1" opacity=".3"/>
  </svg>
);

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="#c9a05a" aria-hidden="true">
    <polygon points="7,1 8.8,5.2 13.5,5.6 10,8.7 11.1,13.3 7,10.8 2.9,13.3 4,8.7 0.5,5.6 5.2,5.2"/>
  </svg>
);

const ArrowRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#c9a05a" strokeWidth="1.2" aria-hidden="true">
    <circle cx="7" cy="7" r="6"/>
    <path d="M7 6v4M7 4.5v.01" strokeLinecap="round"/>
  </svg>
);

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const LANGUAGE_ORBS = [
  { code: "FR", label: "French",   top: "18%", left: "7%",   delay: "0s",   size: 62 },
  { code: "ES", label: "Spanish",  top: "62%", left: "5%",   delay: "1.3s", size: 50 },
  { code: "JP", label: "Japanese", top: "22%", right: "7%",  delay: "0.7s", size: 66 },
  { code: "KO", label: "Korean",   top: "64%", right: "7%",  delay: "1.9s", size: 48 },
  { code: "DE", label: "German",   top: "82%", left: "18%",  delay: "1.0s", size: 44 },
  { code: "HI", label: "Hindi",    top: "14%", right: "20%", delay: "1.6s", size: 54 },
];

const FEATURES = [
  { Icon: IconAI,       title: "AI Language Tutor",     desc: "Practice conversation, get grammar corrections, and build vocabulary with a Claude-powered AI tutor — available any time, at any level." },
  { Icon: IconCalendar, title: "Live Tutoring Sessions", desc: "Book peer-led video sessions for conversation practice, grammar workshops, pronunciation labs, and cultural exchange." },
  { Icon: IconMic,      title: "Pronunciation Studio",  desc: "Record yourself, compare to native audio, and get phonetic breakdowns that pinpoint exactly where to improve." },
  { Icon: IconBook,     title: "Resource Library",      desc: "Lessons, grammar guides, videos, quizzes, and downloadable PDFs — organized by language and proficiency level." },
  { Icon: IconPenPal,   title: "Pen Pal Matching",      desc: "Get matched with a native speaker learning your language. Practice together through messaging and phrase sharing." },
  { Icon: IconForum,    title: "Community Forum",       desc: "Ask grammar questions, get translations, explain slang, and help fellow learners across language-specific threads." },
];

const LANGUAGES = [
  { code: "FR", name: "French",   learners: "1,240", region: "Europe" },
  { code: "ES", name: "Spanish",  learners: "1,890", region: "Global" },
  { code: "JP", name: "Japanese", learners: "980",   region: "East Asia" },
  { code: "KO", name: "Korean",   learners: "760",   region: "East Asia" },
  { code: "DE", name: "German",   learners: "620",   region: "Europe" },
  { code: "HI", name: "Hindi",    learners: "540",   region: "South Asia" },
];

const TESTIMONIALS = [
  { name: "Amara K.",  lang: "French",   initials: "AK", quote: "The AI tutor helped me go from struggling with conjugations to holding full conversations in just 6 weeks." },
  { name: "Diego R.",  lang: "Japanese", initials: "DR", quote: "Booking live sessions was so easy. My tutor was a student just like me — which made it way less intimidating." },
  { name: "Priya M.",  lang: "Korean",   initials: "PM", quote: "The pronunciation studio is unlike anything else. I could hear exactly where I was going wrong and fix it." },
];

const STATS = [
  { value: 500, suffix: "+", label: "Active Students" },
  { value: 6,   suffix: "",  label: "Languages" },
  { value: 200, suffix: "+", label: "Live Sessions" },
  { value: 98,  suffix: "%", label: "Satisfaction" },
];

const MARQUEE_ITEMS = [
  "Conversation Practice","Grammar Workshops","Cultural Exchange",
  "Pronunciation Labs","Peer Tutoring","Vocabulary Building",
  "Study Groups","Live Sessions","Language Exchange","AI Practice",
];

// ─────────────────────────────────────────────
// COUNT-UP HOOK
// ─────────────────────────────────────────────
function useCountUp(target, duration = 1500, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const raf = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setN(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [active, target, duration]);
  return n;
}

function StatCard({ value, suffix, label, active }) {
  const n = useCountUp(value, 1400, active);
  return (
    <div style={s.statCard}>
      <span style={s.statNum}>{n}{suffix}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled,     setScrolled]     = useState(false);
  const [statsActive,  setStatsActive]  = useState(false);
  const [hovFeat,      setHovFeat]      = useState(null);
  const [hovLang,      setHovLang]      = useState(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      {/* skip link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* ── NAV ── */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }} aria-label="Main navigation">
        <div style={s.navInner}>
          <a href="/" style={s.navLogo} aria-label="SpeakSphere home">
            <IconGlobe size={23}/>
            <span style={s.logoTxt}>SpeakSphere</span>
          </a>
          <div style={s.navLinks}>
            {["Features","Languages","Community","About"].map(item => (
              <a key={item} href={`/${item.toLowerCase()}`} style={s.navLink}>{item}</a>
            ))}
          </div>
          <div style={s.navActions}>
            <a href="/login"  style={s.btnGhost}>Log In</a>
            <a href="/signup" style={s.btnSolid}>Get Started</a>
          </div>
        </div>
      </nav>

      <main id="main-content">

        {/* ── HERO ── */}
        <section style={s.hero} aria-label="Hero">
          <div style={s.grain}      aria-hidden="true"/>
          <div style={s.ambient1}   aria-hidden="true"/>
          <div style={s.ambient2}   aria-hidden="true"/>

          {LANGUAGE_ORBS.map(orb => (
            <div key={orb.code} aria-hidden="true" style={{
              ...s.orb,
              top: orb.top, left: orb.left, right: orb.right,
              animationDelay: orb.delay,
            }}>
              <OrbBadge code={orb.code} size={orb.size}/>
              <span style={s.orbLabel}>{orb.label}</span>
            </div>
          ))}

          <div style={s.heroContent}>
            <div style={s.heroPill} role="note">
              <span style={s.pillDot} aria-hidden="true"/>
              Built by students · FBLA Website Design 2025–2026
            </div>
            <h1 style={s.h1}>
              <span style={s.h1Line1}>LEARN LANGUAGES.</span>
              <span style={s.h1Line2}>CONNECT GLOBALLY.</span>
            </h1>
            <p style={s.heroSub}>
              A peer-powered hub with live tutoring, AI conversation practice,
              pronunciation coaching, and a global student community.
            </p>
            <div style={s.heroCTAs}>
              <a href="/signup" style={s.ctaPrimary}>
                Start Learning Free <ArrowRight size={14}/>
              </a>
              <a href="#features" style={s.ctaOutline}>
                Explore Features
              </a>
            </div>
          </div>

          <div style={s.scrollHint} aria-hidden="true">
            <div style={s.scrollDot}/>
            <span style={s.scrollTxt}>scroll</span>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef} style={s.statsBar} aria-label="Platform statistics">
          {STATS.map(st => <StatCard key={st.label} {...st} active={statsActive}/>)}
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={s.section} aria-labelledby="feat-h">
          <div style={s.inner}>
            <p style={s.eyebrow}>EVERYTHING YOU NEED</p>
            <h2 id="feat-h" style={s.h2}>One Hub. Every Tool.</h2>
            <p style={s.sectionSub}>
              From AI conversation practice to live peer tutoring — everything you need
              to go from beginner to confident speaker.
            </p>
            <div style={s.featGrid} role="list">
              {FEATURES.map(({ Icon, title, desc }, i) => (
                <div key={title} role="listitem" tabIndex={0}
                  style={{
                    ...s.featCard,
                    ...(hovFeat === i ? s.featCardHov : {}),
                    animationDelay: `${i * 0.09}s`,
                  }}
                  onMouseEnter={() => setHovFeat(i)}
                  onMouseLeave={() => setHovFeat(null)}
                  onFocus={() => setHovFeat(i)}
                  onBlur={() => setHovFeat(null)}
                  aria-label={`${title}: ${desc}`}
                >
                  <div style={{
                    ...s.featIconWrap,
                    background: hovFeat === i
                      ? "rgba(201,160,90,0.09)"
                      : "rgba(201,160,90,0.03)",
                  }}>
                    <Icon/>
                  </div>
                  <h3 style={{
                    ...s.featTitle,
                    color: hovFeat === i ? "#e8c07a" : "#eadcca",
                  }}>{title}</h3>
                  <p style={s.featDesc}>{desc}</p>
                  <div style={{
                    ...s.featLine,
                    width: hovFeat === i ? "44px" : "0px",
                  }}/>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={s.marqueeWrap} aria-hidden="true" role="presentation">
          <div style={s.marqueeFadeL}/>
          <div style={s.marqueeTrack}>
            <div className="marquee-row" style={s.marqueeRow}>
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <div key={i} style={s.chip}>
                  <span style={s.chipDot}/>
                  <span style={s.chipTxt}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={s.marqueeFadeR}/>
        </div>

        {/* ── LANGUAGES ── */}
        <section style={s.section} aria-labelledby="lang-h">
          <div style={s.inner}>
            <p style={s.eyebrow}>LAUNCH LANGUAGES</p>
            <h2 id="lang-h" style={s.h2}>6 Languages. Endless Possibilities.</h2>
            <p style={s.sectionSub}>
              Start with these six — admins can add more any time from the dashboard.
            </p>
            <div style={s.langGrid} role="list">
              {LANGUAGES.map((lang, i) => (
                <div key={lang.code} role="listitem" tabIndex={0}
                  style={{
                    ...s.langCard,
                    ...(hovLang === i ? s.langCardHov : {}),
                  }}
                  onMouseEnter={() => setHovLang(i)}
                  onMouseLeave={() => setHovLang(null)}
                  onFocus={() => setHovLang(i)}
                  onBlur={() => setHovLang(null)}
                  aria-label={`${lang.name}: ${lang.learners} learners, ${lang.region}`}
                >
                  <LangBadge code={lang.code} size={56}/>
                  <span style={s.langName}>{lang.name}</span>
                  <span style={s.langRegion}>{lang.region}</span>
                  <span style={s.langCount}>{lang.learners} learners</span>
                  {hovLang === i && (
                    <a href="/signup" style={s.langBtn} tabIndex={-1} aria-hidden="true">
                      Join <ArrowRight size={11}/>
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p style={s.adminNote}>
              <InfoIcon/>
              Admins can add new languages directly from the Admin Dashboard — no code required.
            </p>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ ...s.section, background: "rgba(14,7,2,0.7)" }} aria-labelledby="test-h">
          <div style={s.inner}>
            <p style={s.eyebrow}>STUDENT STORIES</p>
            <h2 id="test-h" style={s.h2}>Real Students. Real Results.</h2>
            <div style={s.testGrid} role="list">
              {TESTIMONIALS.map(t => (
                <figure key={t.name} role="listitem" style={s.testCard}>
                  <div style={s.testStars} aria-label="5 out of 5 stars">
                    {Array.from({length:5}).map((_,i) => <StarIcon key={i}/>)}
                  </div>
                  <blockquote style={s.testQuote}>"{t.quote}"</blockquote>
                  <figcaption style={s.testMeta}>
                    <div style={s.testAvatar} aria-hidden="true">{t.initials}</div>
                    <div>
                      <div style={s.testName}>{t.name}</div>
                      <div style={s.testLang}>Learning {t.lang}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={s.ctaBanner} aria-labelledby="cta-h">
          <div style={s.grain} aria-hidden="true"/>
          <div style={s.ctaAmbient} aria-hidden="true"/>
          <p style={s.eyebrow}>READY TO START?</p>
          <h2 id="cta-h" style={{ ...s.h2, maxWidth: 520, margin: "0 auto 14px", position:"relative", zIndex:1 }}>
            Your Language Journey<br/>Starts Here.
          </h2>
          <p style={{ ...s.sectionSub, marginBottom: 40, position:"relative", zIndex:1 }}>
            Join thousands of students already learning and connecting on SpeakSphere.
            Free to join. No credit card required.
          </p>
          <a href="/signup" style={s.ctaBannerBtn}>
            Create Free Account <ArrowRight size={14}/>
          </a>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={s.footer} role="contentinfo">
        <div style={s.footerInner}>
          <div>
            <div style={s.footerLogoRow}>
              <IconGlobe size={19}/>
              <strong style={{ fontFamily:"'Oswald',sans-serif", letterSpacing:"0.05em", fontSize:17, color:"#e8c07a" }}>
                SpeakSphere
              </strong>
            </div>
            <p style={s.footerTagline}>Built by students, for students.<br/>FBLA Website Design 2025–2026.</p>
          </div>
          <nav style={s.footerLinks} aria-label="Footer navigation">
            {[["Features","/features"],["Languages","/languages"],["Community","/community"],
              ["About","/about"],["Privacy","/privacy"],["Help / FAQ","/help"]].map(([l,h]) => (
              <a key={l} href={h} style={s.footerLink}>{l}</a>
            ))}
          </nav>
          <p style={s.footerCopy}>© 2026 SpeakSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// DESIGN TOKENS — earthy, matte-rich
// ─────────────────────────────────────────────
const GOLD   = "#c9a05a";
const GOLD_L = "#e8c07a";
const CREAM  = "#eadcca";
const MUTED  = "#9a7d5a";
const DARK   = "#140b04";
const CARD   = "#1c0f06";
const SURF   = "#231208";

const s = {
  root: {
    fontFamily:"'Lora', Georgia, serif",
    background: DARK,
    color: CREAM,
    minHeight:"100vh",
    overflowX:"hidden",
  },

  // NAV
  nav: {
    position:"fixed", top:0, left:0, right:0, zIndex:100,
    transition:"background 0.35s, border-color 0.35s",
    borderBottom:"1px solid transparent",
  },
  navScrolled: {
    background:"rgba(20,11,4,0.97)",
    borderBottom:`1px solid rgba(201,160,90,0.13)`,
    backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
  },
  navInner: {
    maxWidth:1180, margin:"0 auto", padding:"0 28px",
    height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
  },
  navLogo: { display:"flex", alignItems:"center", gap:9, textDecoration:"none" },
  logoTxt: {
    fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:600,
    color: GOLD_L, letterSpacing:"0.05em",
  },
  navLinks: { display:"flex", gap:28 },
  navLink: {
    fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.08em",
    color: MUTED, textDecoration:"none", transition:"color 0.2s",
  },
  navActions: { display:"flex", gap:10, alignItems:"center" },
  btnGhost: {
    fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.06em",
    color: GOLD_L, border:`1px solid rgba(201,160,90,0.28)`, borderRadius:5,
    padding:"7px 16px", textDecoration:"none",
  },
  btnSolid: {
    fontFamily:"'Oswald',sans-serif", fontSize:13, letterSpacing:"0.06em",
    color: DARK, background: GOLD, borderRadius:5,
    padding:"7px 16px", textDecoration:"none", fontWeight:600,
  },

  // HERO
  hero: {
    position:"relative", minHeight:"100vh",
    display:"flex", alignItems:"center", justifyContent:"center",
    overflow:"hidden", background: DARK,
  },
  grain: {
    position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
    // SVG noise pattern — gives the earthy tactile feel without gloss
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundRepeat:"repeat", backgroundSize:"300px",
    mixBlendMode:"overlay",
  },
  ambient1: {
    position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
    // wide, soft, low-opacity — not glossy
    background:"radial-gradient(ellipse 65% 45% at 50% 8%, rgba(160,105,30,0.10) 0%, transparent 68%)",
  },
  ambient2: {
    position:"absolute", bottom:"-8%", right:"0%", zIndex:1, pointerEvents:"none",
    width:440, height:440, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(140,90,20,0.07) 0%, transparent 70%)",
    animation:"floatSlow 10s ease-in-out infinite reverse",
  },
  orb: {
    position:"absolute", display:"flex", flexDirection:"column",
    alignItems:"center", gap:5, zIndex:3,
    animation:"floatOrb 5s ease-in-out infinite",
  },
  orbLabel: {
    fontFamily:"'Oswald',sans-serif", fontSize:9, letterSpacing:"0.1em",
    color: MUTED, textTransform:"uppercase",
  },
  heroContent: {
    position:"relative", zIndex:10, textAlign:"center",
    maxWidth:800, padding:"0 24px",
    animation:"fadeUp 0.9s ease both",
  },
  heroPill: {
    display:"inline-flex", alignItems:"center", gap:8,
    fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.13em",
    color: MUTED, background:"rgba(28,15,6,0.95)",
    border:`1px solid rgba(201,160,90,0.16)`, borderRadius:100,
    padding:"5px 14px", marginBottom:26,
  },
  pillDot: {
    width:6, height:6, borderRadius:"50%", background:"#7db87d",
    display:"inline-block", animation:"pulse 2.4s ease infinite",
  },
  h1: {
    fontFamily:"'Oswald',sans-serif", fontWeight:700,
    lineHeight:1.06, letterSpacing:"0.01em", margin:"0 0 22px",
  },
  h1Line1: {
    display:"block", fontSize:"clamp(40px,6.5vw,82px)", color: CREAM,
  },
  h1Line2: {
    display:"block", fontSize:"clamp(40px,6.5vw,82px)",
    color: GOLD, // single warm gold — no gradient
  },
  heroSub: {
    fontSize:"clamp(15px,1.7vw,18px)", color: MUTED,
    lineHeight:1.78, marginBottom:38,
    maxWidth:540, marginLeft:"auto", marginRight:"auto",
    fontFamily:"'Lora',serif",
  },
  heroCTAs: { display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" },
  ctaPrimary: {
    fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:"0.07em",
    fontWeight:600, color: DARK, background: GOLD,
    borderRadius:7, padding:"12px 26px",
    textDecoration:"none", display:"inline-flex", alignItems:"center", gap:9,
    // subtle shadow — matte-feel, not glassy
    boxShadow:"0 4px 18px rgba(150,100,30,0.25)",
    transition:"transform 0.18s, box-shadow 0.18s",
  },
  ctaOutline: {
    fontFamily:"'Oswald',sans-serif", fontSize:14, letterSpacing:"0.07em",
    color: GOLD_L, border:`1px solid rgba(201,160,90,0.3)`,
    borderRadius:7, padding:"12px 22px", textDecoration:"none",
  },
  scrollHint: {
    position:"absolute", bottom:30, left:"50%", transform:"translateX(-50%)",
    display:"flex", flexDirection:"column", alignItems:"center", gap:6, zIndex:10,
  },
  scrollDot: {
    width:5, height:5, borderRadius:"50%", background: GOLD,
    animation:"scrollBounce 1.8s ease-in-out infinite",
  },
  scrollTxt: {
    fontFamily:"'Oswald',sans-serif", fontSize:9,
    letterSpacing:"0.2em", color: MUTED,
  },

  // STATS
  statsBar: {
    display:"flex", flexWrap:"wrap", justifyContent:"center",
    background:"rgba(16,8,2,0.9)",
    borderTop:`1px solid rgba(201,160,90,0.09)`,
    borderBottom:`1px solid rgba(201,160,90,0.09)`,
  },
  statCard: {
    display:"flex", flexDirection:"column", alignItems:"center",
    padding:"26px 42px",
    borderRight:`1px solid rgba(201,160,90,0.07)`,
    flex:"1 1 120px",
  },
  statNum: {
    fontFamily:"'Oswald',sans-serif", fontSize:38, fontWeight:700,
    color: GOLD_L, lineHeight:1,
  },
  statLabel: {
    fontFamily:"'Oswald',sans-serif", fontSize:10,
    letterSpacing:"0.14em", color: MUTED,
    marginTop:5, textTransform:"uppercase",
  },

  // SECTION
  section: { padding:"92px 24px" },
  inner:   { maxWidth:1160, margin:"0 auto" },
  eyebrow: {
    fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.2em",
    color: GOLD, textAlign:"center", marginBottom:12, textTransform:"uppercase",
  },
  h2: {
    fontFamily:"'Oswald',sans-serif",
    fontSize:"clamp(28px,4.2vw,48px)", fontWeight:700,
    color: CREAM, textAlign:"center", marginBottom:14, lineHeight:1.16,
  },
  sectionSub: {
    fontSize:15, color: MUTED, textAlign:"center",
    maxWidth:500, margin:"0 auto 52px",
    lineHeight:1.78, fontFamily:"'Lora',serif",
  },

  // FEATURES
  featGrid: {
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))",
    gap:18,
  },
  featCard: {
    background: CARD,
    border:`1px solid rgba(201,160,90,0.09)`,
    borderRadius:13, padding:"30px 24px",
    transition:"transform 0.28s, border-color 0.28s, box-shadow 0.28s",
    position:"relative", overflow:"hidden",
    animation:"fadeUp 0.55s ease both",
    cursor:"default",
  },
  featCardHov: {
    transform:"translateY(-8px)",
    borderColor:"rgba(201,160,90,0.32)",
    boxShadow:"0 14px 44px rgba(0,0,0,0.5)",
  },
  featIconWrap: {
    width:56, height:56, borderRadius:11,
    display:"flex", alignItems:"center", justifyContent:"center",
    marginBottom:16, border:`1px solid rgba(201,160,90,0.09)`,
    transition:"background 0.28s",
  },
  featTitle: {
    fontFamily:"'Oswald',sans-serif", fontSize:17, fontWeight:600,
    letterSpacing:"0.03em", marginBottom:9, transition:"color 0.22s",
  },
  featDesc: { fontSize:13, color: MUTED, lineHeight:1.72, marginBottom:16 },
  featLine: {
    height:2, background: GOLD, borderRadius:2,
    transition:"width 0.38s ease",
  },

  // MARQUEE
  marqueeWrap: {
    position:"relative", overflow:"hidden",
    borderTop:`1px solid rgba(201,160,90,0.07)`,
    borderBottom:`1px solid rgba(201,160,90,0.07)`,
    background:"rgba(14,7,2,0.8)", padding:"16px 0",
  },
  marqueeFadeL: {
    position:"absolute", top:0, bottom:0, left:0, width:72, zIndex:2,
    pointerEvents:"none",
    background:"linear-gradient(to right, rgba(14,7,2,1), transparent)",
  },
  marqueeFadeR: {
    position:"absolute", top:0, bottom:0, right:0, width:72, zIndex:2,
    pointerEvents:"none",
    background:"linear-gradient(to left, rgba(14,7,2,1), transparent)",
  },
  marqueeTrack: { overflow:"hidden" },
  marqueeRow: {
    display:"flex", gap:12, width:"max-content",
    animation:"marquee 32s linear infinite",
  },
  chip: {
    display:"flex", alignItems:"center", gap:7,
    background:"rgba(28,15,6,0.9)",
    border:`1px solid rgba(201,160,90,0.11)`,
    borderRadius:100, padding:"6px 14px", flexShrink:0,
  },
  chipDot: {
    width:4, height:4, borderRadius:"50%", background: GOLD, flexShrink:0,
  },
  chipTxt: {
    fontFamily:"'Oswald',sans-serif", fontSize:10,
    letterSpacing:"0.11em", color: MUTED, whiteSpace:"nowrap",
    textTransform:"uppercase",
  },

  // LANGUAGES
  langGrid: {
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))",
    gap:16, marginBottom:24,
  },
  langCard: {
    background: SURF,
    border:`1px solid rgba(201,160,90,0.09)`,
    borderRadius:13, padding:"26px 14px",
    display:"flex", flexDirection:"column", alignItems:"center", gap:7,
    transition:"transform 0.28s, border-color 0.28s, box-shadow 0.28s",
    cursor:"default", position:"relative", minHeight:175, justifyContent:"center",
  },
  langCardHov: {
    transform:"translateY(-7px)",
    borderColor:"rgba(201,160,90,0.38)",
    boxShadow:"0 12px 36px rgba(0,0,0,0.5)",
  },
  langName: {
    fontFamily:"'Oswald',sans-serif", fontSize:16, fontWeight:600,
    color: CREAM, letterSpacing:"0.04em",
  },
  langRegion: { fontSize:10, color: MUTED, letterSpacing:"0.06em" },
  langCount:  { fontSize:11, color: GOLD, fontWeight:600 },
  langBtn: {
    fontFamily:"'Oswald',sans-serif", fontSize:10, letterSpacing:"0.06em",
    color: DARK, background: GOLD, borderRadius:5,
    padding:"5px 11px", textDecoration:"none",
    position:"absolute", bottom:11,
    display:"inline-flex", alignItems:"center", gap:4,
    fontWeight:600, animation:"fadeUp 0.18s ease both",
  },
  adminNote: {
    display:"flex", alignItems:"center", justifyContent:"center",
    gap:6, fontSize:11, color: MUTED,
    fontFamily:"'Oswald',sans-serif", letterSpacing:"0.05em",
  },

  // TESTIMONIALS
  testGrid: {
    display:"grid",
    gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))",
    gap:18,
  },
  testCard: {
    background: CARD,
    border:`1px solid rgba(201,160,90,0.09)`,
    borderRadius:13, padding:"26px 22px", margin:0,
  },
  testStars: { display:"flex", gap:3, marginBottom:13 },
  testQuote: {
    fontSize:13, color:"#c2ae90", lineHeight:1.78,
    fontStyle:"italic", margin:"0 0 20px",
    fontFamily:"'Lora',serif",
  },
  testMeta: { display:"flex", alignItems:"center", gap:11 },
  testAvatar: {
    width:38, height:38, borderRadius:"50%",
    background:`linear-gradient(135deg, ${GOLD}, #8a6020)`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Oswald',sans-serif", fontSize:12, fontWeight:700,
    color: DARK, flexShrink:0,
  },
  testName: {
    fontFamily:"'Oswald',sans-serif", fontSize:13,
    fontWeight:600, color: CREAM, letterSpacing:"0.04em",
  },
  testLang: { fontSize:11, color: MUTED, marginTop:2 },

  // CTA BANNER
  ctaBanner: {
    position:"relative", textAlign:"center",
    padding:"104px 24px",
    background:"rgba(12,6,1,0.98)",
    borderTop:`1px solid rgba(201,160,90,0.08)`,
    overflow:"hidden",
  },
  ctaAmbient: {
    position:"absolute", inset:0, pointerEvents:"none",
    background:"radial-gradient(ellipse 55% 45% at 50% 50%, rgba(140,95,20,0.07) 0%, transparent 70%)",
  },
  ctaBannerBtn: {
    fontFamily:"'Oswald',sans-serif", fontSize:15, letterSpacing:"0.07em",
    fontWeight:600, color: DARK, background: GOLD,
    borderRadius:8, padding:"13px 32px",
    textDecoration:"none", display:"inline-flex",
    alignItems:"center", gap:9,
    boxShadow:"0 6px 22px rgba(140,100,30,0.22)",
    position:"relative", zIndex:1,
  },

  // FOOTER
  footer: {
    background:"#0a0501",
    borderTop:`1px solid rgba(201,160,90,0.07)`,
    padding:"48px 24px 32px",
  },
  footerInner: {
    maxWidth:1160, margin:"0 auto",
    display:"flex", flexDirection:"column",
    alignItems:"center", gap:24, textAlign:"center",
  },
  footerLogoRow: {
    display:"inline-flex", alignItems:"center", gap:7, marginBottom:9,
  },
  footerTagline: { fontSize:11, color: MUTED, lineHeight:1.65, margin:0 },
  footerLinks: {
    display:"flex", flexWrap:"wrap",
    gap:"9px 22px", justifyContent:"center",
  },
  footerLink: {
    fontFamily:"'Oswald',sans-serif", fontSize:11,
    letterSpacing:"0.07em", color: MUTED, textDecoration:"none",
  },
  footerCopy: { fontSize:10, color:"#3e2510", letterSpacing:"0.04em" },
};

// ─────────────────────────────────────────────
// ANIMATIONS + GLOBAL CSS
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :focus-visible {
    outline: 2px solid #c9a05a;
    outline-offset: 3px;
    border-radius: 4px;
  }

  a { transition: opacity 0.2s; }
  a:hover { opacity: 0.8; }

  .skip-link {
    position: absolute; top: -48px; left: 16px;
    background: #c9a05a; color: #140b04;
    font-family: 'Oswald', sans-serif; font-size: 13px; letter-spacing: 0.06em;
    padding: 8px 16px; border-radius: 0 0 6px 6px; z-index: 9999;
    transition: top 0.2s;
  }
  .skip-link:focus { top: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatOrb {
    0%,100% { transform: translateY(0) rotate(0deg); }
    40%     { transform: translateY(-13px) rotate(1.5deg); }
    70%     { transform: translateY(7px) rotate(-1.5deg); }
  }
  @keyframes floatSlow {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-20px); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.4; transform:scale(0.72); }
  }
  @keyframes scrollBounce {
    0%,100% { transform:translateY(0); opacity:1; }
    50%     { transform:translateY(9px); opacity:0.3; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .marquee-row:hover { animation-play-state: paused; }

  @media (max-width: 680px) {
    nav { backdrop-filter: blur(14px) !important; background: rgba(20,11,4,0.97) !important; }
  }
`;