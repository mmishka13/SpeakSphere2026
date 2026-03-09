import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import LandingPage  from "./home.jsx";
import AuthPage     from "./authpage.jsx";
import Dashboard    from "./dashboard.jsx";
import CalendarPage   from "./calendarpage.jsx";
import PronunciationPage from "./pronunciationpage.jsx";
import ResourcesPage  from "./resourcespage.jsx";
import CommunityPage  from "./communitypage.jsx";
import PenPalsPage    from "./penpals.jsx";

/* ── Design tokens (dark academia — matches Dashboard) ── */
const DARK   = "#140b04";
const CARD   = "#1a0d05";
const GOLD   = "#c9a05a";
const GOLDLT = "#e8c07a";
const CREAM  = "#eadcca";
const MUTED  = "#9a7d5a";
const DIM    = "#5a3a22";
const BORD   = "rgba(201,160,90,0.12)";
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

/* ── SVG Icons ────────────────────────────────────────── */
function Ico({ d, size=16, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
const DashIcon  = (p) => <Ico {...p} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>;
const CalIcon   = (p) => <Ico {...p} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>;
const BookIcon  = (p) => <Ico {...p} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>;
const MicIcon   = (p) => <Ico {...p} d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3zM19 10a7 7 0 01-14 0M12 19v3M8 22h8"/>;
const MailIcon  = (p) => <Ico {...p} d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"/>;
const ChatIcon  = (p) => <Ico {...p} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>;
const GearIcon  = (p) => <Ico {...p} d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>;

const NAV_ITEMS = [
  { path:"/dashboard",     label:"Dashboard",     Icon:DashIcon  },
  { path:"/calendar",      label:"Schedule",      Icon:CalIcon   },
  { path:"/resources",     label:"Resources",     Icon:BookIcon  },
  { path:"/pronunciation", label:"Pronunciation", Icon:MicIcon   },
  { path:"/pen-pals",      label:"Pen Pals",      Icon:MailIcon  },
  { path:"/community",     label:"Community",     Icon:ChatIcon  },
];

/* ── Coming Soon ─────────────────────────────────────── */
function ComingSoon({ label }) {
  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
      background:DARK, fontFamily:"'Oswald',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:32, color:GOLD,
          letterSpacing:"0.1em", marginBottom:12 }}>—</p>
        <h2 style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, color:CREAM,
          letterSpacing:"0.04em", marginBottom:8 }}>{label}</h2>
        <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:MUTED, fontStyle:"italic" }}>
          This page is coming soon.</p>
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────── */
function Sidebar({ onExpand }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const active    = location.pathname;
  const [expanded, setExpanded] = useState(false);
  const sideW = expanded ? 210 : 56;

  function handleExpand(val) {
    setExpanded(val);
    onExpand?.(val);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;1,400&display=swap');
        .app-nav-btn:hover { background:rgba(201,160,90,0.07) !important; }
        .app-nav-btn:hover span { opacity:1 !important; color:#eadcca !important; }
      `}</style>
      <aside
        onMouseEnter={() => handleExpand(true)}
        onMouseLeave={() => handleExpand(false)}
        style={{ width:sideW, flexShrink:0, background:DARK,
          borderRight:`1px solid ${BORD}`, position:"fixed", top:0, left:0, bottom:0,
          zIndex:50, display:"flex", flexDirection:"column",
          backgroundImage:GRAIN, backgroundRepeat:"repeat", backgroundSize:"300px",
          transition:"width .22s cubic-bezier(.4,0,.2,1)", overflow:"hidden" }}>

        {/* Logo */}
        <div style={{ padding:"20px 14px 16px", borderBottom:`1px solid rgba(201,160,90,0.08)`,
          cursor:"pointer", display:"flex", alignItems:"center", gap:10, flexShrink:0, minWidth:210 }}
          onClick={() => navigate("/")}>
          <svg width={26} height={26} viewBox="0 0 26 26" fill="none" style={{ flexShrink:0 }}>
            <circle cx="13" cy="13" r="11" stroke={GOLD} strokeWidth="1.2"/>
            <ellipse cx="13" cy="13" rx="5" ry="11" stroke={GOLD} strokeWidth="0.8" opacity=".5"/>
            <line x1="2" y1="13" x2="24" y2="13" stroke={GOLD} strokeWidth="0.8" opacity=".4"/>
          </svg>
          <div style={{ opacity: expanded ? 1 : 0, transition:"opacity .15s", whiteSpace:"nowrap" }}>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:13, fontWeight:600,
              color:CREAM, letterSpacing:"0.08em" }}>SPEAKSPHERE</p>
            <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:8, color:DIM, letterSpacing:"0.14em" }}>
              LANGUAGE HUB</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const isActive = active === path || active.startsWith(path + "/");
            return (
              <button key={path} onClick={() => navigate(path)}
                className="app-nav-btn"
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                  padding:"9px 11px", borderRadius:4, border:"none", marginBottom:2,
                  background: isActive ? "rgba(201,160,90,0.09)" : "transparent",
                  borderLeft: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
                  cursor:"pointer", transition:"all .14s", textAlign:"left", minWidth:210 }}>
                <div style={{ flexShrink:0, width:20, display:"flex", justifyContent:"center" }}>
                  <Icon size={16} color={isActive ? GOLD : MUTED}/>
                </div>
                <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:11,
                  letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap",
                  color: isActive ? CREAM : MUTED, fontWeight: isActive ? 600 : 400,
                  opacity: expanded ? 1 : 0, transition:"opacity .12s" }}>
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
            <div style={{ flex:1, minWidth:0, opacity: expanded ? 1 : 0, transition:"opacity .12s" }}>
              <p style={{ fontFamily:"'Oswald',sans-serif", fontSize:12, color:CREAM,
                letterSpacing:"0.04em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                Mishka Mittal</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:10, color:MUTED, fontStyle:"italic" }}>
                Journeyman · ES</p>
            </div>
            <button onClick={() => navigate("/dashboard")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:3, flexShrink:0,
                opacity: expanded ? 1 : 0, transition:"opacity .12s" }}>
              <GearIcon size={13} color={DIM}/>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── App shell ───────────────────────────────────────── */
function AppShell() {
  const location    = useLocation();
  const [sideExpanded, setSideExpanded] = useState(false);

  return (
    <div style={{ display:"flex", height:"100vh", background:DARK }}>
      <Sidebar onExpand={setSideExpanded}/>
      <div style={{
        marginLeft: sideExpanded ? 210 : 56,
        flex:1, overflow:"hidden", display:"flex", flexDirection:"column",
        transition:"margin-left .22s cubic-bezier(.4,0,.2,1)"
      }}>
        <Routes>
          <Route path="/dashboard"     element={<Dashboard/>}/>
          <Route path="/calendar"      element={<CalendarPage/>}/>
          <Route path="/resources"     element={<ResourcesPage/>}/>
          <Route path="/pronunciation" element={<PronunciationPage/>}/>
          <Route path="/pen-pals"      element={<PenPalsPage/>}/>
          <Route path="/community"     element={<CommunityPage/>}/>
          <Route path="*"              element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </div>
    </div>
  );
}

/* ── Root ────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage/>}/>
        <Route path="/login"  element={<AuthPage/>}/>
        <Route path="/signup" element={<AuthPage/>}/>
        <Route path="/*"      element={<AppShell/>}/>
      </Routes>
    </BrowserRouter>
  );
}